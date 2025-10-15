#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SS D4
#define PN532_SCK D5
#define PN532_MOSI D7
#define PN532_MISO D6

// Define the buzzer pin
#define BUZZER_PIN D1

Adafruit_PN532 nfc(PN532_SS);

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing PN532...");

  // Set the buzzer pin as an output
  pinMode(BUZZER_PIN, OUTPUT);

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("PN532 not found!");
    while (1)
      ;
  }

  nfc.SAMConfig();  // configure board
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

    // APDU: SELECT your HCE AID (D2760000850101)
    uint8_t selectApdu[] = { 0x00, 0xA4, 0x04, 0x00, 0x07, 0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00 };
    uint8_t response[255];
    uint8_t responseLength = sizeof(response);

    success = nfc.inDataExchange(selectApdu, sizeof(selectApdu), response, &responseLength);

    Serial.println(success);  // Prints '1' if exchange occurred, regardless of SW status

    // Check for success AND A_OKAY status word (SW1=0x90, SW2=0x00)

    if (success && responseLength >= 2) {
      uint8_t sw1 = response[responseLength - 2];
      uint8_t sw2 = response[responseLength - 1];

      Serial.print("SW1 SW2 = ");
      Serial.print(sw1, HEX);
      Serial.print(" ");
      Serial.println(sw2, HEX);

      if ((sw1 == 0x90 && sw2 == 0x00) || (sw1 == 0x01 && sw2 == 0x00)) {
        Serial.println("APDU success!");
      } else {
        Serial.println("APDU failed or unknown SW");
      }
    }


    if (success && responseLength >= 2 && response[responseLength - 2] == 0x90 && response[responseLength - 1] == 0x00) {
      Serial.println("ISO-DEP / Type 4 card confirmed!");
      Serial.print("SELECT AID APDU response: ");
      for (int i = 0; i < responseLength; i++) {
        Serial.print(response[i], HEX);
        Serial.print(" ");
      }
      Serial.println();

      // APDU: SELECT the Capability Container (CC) file
      uint8_t selectCcApdu[] = { 0x00, 0xA4, 0x00, 0x0C, 0x02, 0xE1, 0x03 };
      responseLength = sizeof(response);
      success = nfc.inDataExchange(selectCcApdu, sizeof(selectCcApdu), response, &responseLength);

      if (!success || responseLength < 2 || response[responseLength - 2] != 0x90) {
        Serial.println("Failed to select CC file.");
        return;
      }
      Serial.println("CC file selected successfully.");

      // APDU: READ the Capability Container (CC) file
      uint8_t readCcApdu[] = { 0x00, 0xB0, 0x00, 0x00, 0x0F };  // Read 15 bytes from offset 0
      responseLength = sizeof(response);
      success = nfc.inDataExchange(readCcApdu, sizeof(readCcApdu), response, &responseLength);

      if (!success || responseLength < 17 || response[responseLength - 2] != 0x90) {
        Serial.println("Failed to read CC file.");
        return;
      }
      Serial.println("CC file read successfully.");

      // APDU: SELECT the NDEF file
      uint8_t selectFileApdu[] = { 0x00, 0xA4, 0x00, 0x0C, 0x02, 0xE1, 0x04 };
      responseLength = sizeof(response);
      success = nfc.inDataExchange(selectFileApdu, sizeof(selectFileApdu), response, &responseLength);

      if (!success || responseLength < 2 || response[responseLength - 2] != 0x90) {
        Serial.println("Failed to select NDEF file.");
        return;
      }
      Serial.println("NDEF file selected successfully.");

      // Read NDEF length (first 2 bytes)
      uint8_t readNlenApdu[] = { 0x00, 0xB0, 0x00, 0x00, 0x02 };
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
        uint8_t readApdu[] = { 0x00, 0xB0, (uint8_t)(offset >> 8), (uint8_t)(offset & 0xFF), chunkSize };

        responseLength = sizeof(response);
        success = nfc.inDataExchange(readApdu, sizeof(readApdu), response, &responseLength);

        if (!success || responseLength < 2) {
          tone(BUZZER_PIN, 1000);  // Indicate failure
          delay(500);
          noTone(BUZZER_PIN);
          Serial.println("Failed reading NDEF chunk");
          break;
        }

        // Print chunk as ASCII, skip last two SW1 SW2 bytes (0x90 0x00)
        for (int i = 0; i < responseLength - 2; i++) {
          Serial.print((char)response[i]);
        }

        offset += chunkSize;
        delay(10);  // avoid PN532 timeout

        // Successful chunk read buzzer sound
        tone(BUZZER_PIN, 2000);
        delay(700);
        noTone(BUZZER_PIN);
      }

      Serial.println("\n--- End of NDEF payload ---");

      // Add the 2-second delay
      delay(1000);
    } else {
      tone(BUZZER_PIN, 1000);  // Indicate failure
      delay(500);
      noTone(BUZZER_PIN);
      Serial.println("Not an ISO-DEP / Type 4 card, ignoring...");
    }
  }

  delay(500);
}