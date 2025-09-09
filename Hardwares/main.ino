#include <SPI.h>
#include <Adafruit_PN532.h>

// PN532 hardware SPI pins for NodeMCU 1.0
#define PN532_SS   D4
#define PN532_SCK  D5
#define PN532_MOSI D7
#define PN532_MISO D6

Adafruit_PN532 nfc(PN532_SS);

void setup(void) {
  Serial.begin(115200);
  Serial.println("Starting NFC reader...");

  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("Didn't find PN53x board");
    while (1); // halt
  }

  Serial.print("Found chip PN5"); 
  Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Firmware ver. "); 
  Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.'); 
  Serial.println((versiondata >> 8) & 0xFF, DEC);

  // Configure board to read RFID cards
  nfc.SAMConfig();

  Serial.println("Waiting for an ISO14443A Card...");
}

void loop(void) {
  uint8_t success;
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0}; // Buffer to store UID
  uint8_t uidLength;

  // Wait for an ISO14443A card
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("\nCard Found!");
    Serial.print("UID Length: "); 
    Serial.print(uidLength, DEC); 
    Serial.println(" bytes");
    
    Serial.print("UID Value: "); 
    nfc.PrintHex(uid, uidLength); 
    Serial.println("");

    if (uidLength == 4) {
      uint32_t cardid = uid[0];
      cardid <<= 8;
      cardid |= uid[1];
      cardid <<= 8;
      cardid |= uid[2];
      cardid <<= 8;
      cardid |= uid[3];
      Serial.print("Mifare Classic Card ID: ");
      Serial.println(cardid);
    }

    delay(1000); // small delay before next scan
  }
}
