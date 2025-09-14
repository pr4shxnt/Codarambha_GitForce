#include <SPI.h>
#include <Adafruit_PN532.h>

// SPI pins for NodeMCU/ESP8266
#define PN532_SCK 14  // D5
#define PN532_MISO 12 // D6
#define PN532_MOSI 13 // D7
#define PN532_SS 2    // D4

Adafruit_PN532 nfc(PN532_SS);

#define TIMEOUT_TAG_WAIT 10000 // 10 seconds

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Serial.println("PN532 HCE Debug Starting...");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("Didn't find PN53x board!");
    while (1);
  }

  Serial.print("Found PN5"); Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Firmware ver. "); Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata >> 8) & 0xFF, DEC);

  nfc.SAMConfig(); // configure as normal reader
  nfc.setPassiveActivationRetries(0xFF);

  Serial.println("Waiting for HCE device...");
}

void loop() {
  uint8_t uid[8];
  uint8_t uidLength;

  // Poll for ISO14443A/HCE device
  bool success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, TIMEOUT_TAG_WAIT);

  if (success) {
    Serial.println("\nHCE device detected!");
    Serial.print("UID Length: "); Serial.println(uidLength, DEC);
    Serial.print("UID: ");
    for (uint8_t i = 0; i < uidLength; i++) {
      Serial.print(uid[i], HEX); Serial.print(" ");
    }
    Serial.println();

    // Prepare a simple SELECT APDU for testing
    uint8_t apdu[] = {0x00, 0xA4, 0x04, 0x00, 0x07,
                      0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00};

    uint8_t response[64];
    uint8_t responseLen;

    if (nfc.inDataExchange(apdu, sizeof(apdu), response, &responseLen)) {
      Serial.print("APDU Response ("); Serial.print(responseLen); Serial.print(" bytes): ");
      for (uint8_t i = 0; i < responseLen; i++) {
        Serial.print(response[i], HEX); Serial.print(" ");
      }
      Serial.println();
    } else {
      Serial.println("Failed to send APDU to HCE device.");
    }

    delay(2000); // avoid repeated polling
  } else {
    Serial.println("No HCE device found.");
  }
}
