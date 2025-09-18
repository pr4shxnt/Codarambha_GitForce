#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SS   D4
#define PN532_SCK  D5
#define PN532_MOSI D7
#define PN532_MISO D6

Adafruit_PN532 nfc(PN532_SS);

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing PN532...");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("PN532 not found!");
    while (1);
  }

  nfc.SAMConfig(); // configure board
  Serial.println("Waiting for ISO-DEP / Type 4 card...");
}

void loop() {
  uint8_t success;
  uint8_t uid[7];
  uint8_t uidLength;

  // Detect any NFC card
  success = nfc.inListPassiveTarget();

  if (success) {
    Serial.println("Card detected, attempting ISO-DEP...");

    // APDU: SELECT your HCE AID
    uint8_t selectApdu[] = {0x00, 0xA4, 0x04, 0x00, 0x07, 0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00};
    uint8_t response[255];
    uint8_t responseLength = sizeof(response);

    success = nfc.inDataExchange(selectApdu, sizeof(selectApdu), response, &responseLength);

    if (success && responseLength >= 2 && response[responseLength - 2] == 0x90 && response[responseLength - 1] == 0x00) {
      Serial.println("ISO-DEP / Type 4 card confirmed!");
      Serial.print("SELECT AID APDU response: ");
      for (int i = 0; i < responseLength; i++) {
        Serial.print(response[i], HEX);
        Serial.print(" ");
      }
      Serial.println();

      // APDU: SELECT the NDEF file
      uint8_t selectFileApdu[] = {0x00, 0xA4, 0x00, 0x0C, 0x02, 0xE1, 0x04};
      responseLength = sizeof(response);
      success = nfc.inDataExchange(selectFileApdu, sizeof(selectFileApdu), response, &responseLength);

      if (!success || responseLength < 2 || response[responseLength - 2] != 0x90) {
        Serial.println("Failed to select NDEF file.");
        return;
      }

      Serial.println("NDEF file selected successfully.");

      // Read NDEF length (first 2 bytes)
      uint8_t readNlenApdu[] = {0x00, 0xB0, 0x00, 0x00, 0x02};
      responseLength = sizeof(response);
      success = nfc.inDataExchange(readNlenApdu, sizeof(readNlenApdu), response, &responseLength);

      if (!success || responseLength < 4) {
        Serial.println("Failed to read NDEF length");
        return;
      }

      uint16_t ndefLength = (response[0] << 8) | response[1];
      Serial.print("NDEF length: ");
      Serial.println(ndefLength);

      // Read NDEF in chunks (max 240 bytes per APDU)
      uint16_t offset = 0;
      while (offset < ndefLength) {
        uint8_t chunkSize = (ndefLength - offset > 240) ? 240 : (ndefLength - offset);
        uint8_t readApdu[] = {0x00, 0xB0, (uint8_t)(offset >> 8), (uint8_t)(offset & 0xFF), chunkSize};

        responseLength = sizeof(response);
        success = nfc.inDataExchange(readApdu, sizeof(readApdu), response, &responseLength);

        if (!success || responseLength < 2) {
          Serial.println("Failed reading NDEF chunk");
          break;
        }

        // Print chunk as ASCII, skip last two SW1 SW2 bytes (0x90 0x00)
        for (int i = 0; i < responseLength - 2; i++) {
          Serial.print((char)response[i]);
        }

        offset += chunkSize;
        delay(10); // avoid PN532 timeout
      }

      Serial.println("\n--- End of NDEF payload ---");
    } else {
      Serial.println("Not an ISO-DEP / Type 4 card, ignoring...");
    }
  }

  delay(500);
}
