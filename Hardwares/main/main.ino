#include <SPI.h>
#include <Adafruit_PN532.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>  // Install from Library Manager

// PN532 hardware SPI pins for NodeMCU 1.0
#define PN532_SS   D4
#define PN532_SCK  D5
#define PN532_MOSI D7
#define PN532_MISO D6

Adafruit_PN532 nfc(PN532_SS);

void setup(void) {
  Serial.begin(115200);
  Serial.println("Starting...");

  // Start WiFi Manager Portal
  WiFiManager wifiManager;
  wifiManager.autoConnect("NEPAL YATAYAT", "12345678"); 

  Serial.println("Connected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Start NFC
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
  uint8_t uid[7]; // Buffer to store UID
  uint8_t uidLength;

  // Wait for an ISO14443A card
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("\nCard / Device Found!");
    Serial.print("UID Length: "); 
    Serial.print(uidLength, DEC); 
    Serial.println(" bytes");
    
    Serial.print("UID Value: "); 
    nfc.PrintHex(uid, uidLength); 
    Serial.println("");

    // -----------------------------
    // Try APDU exchange (works if HCE app is installed)
    // -----------------------------

    // Example: SELECT AID (replace with your app's AID bytes)
    // Example AID = F0 12 34 56 78
    uint8_t selectApdu[] = {
      0x00, 0xA4, 0x04, 0x00, 0x05, // CLA, INS, P1, P2, Length
      0xF0, 0x12, 0x34, 0x56, 0x78  // Your AID here
    };

    uint8_t response[255];
    uint8_t responseLength = sizeof(response);

    if (nfc.inDataExchange(selectApdu, sizeof(selectApdu), response, &responseLength)) {
      Serial.print("APDU Response: ");
      nfc.PrintHex(response, responseLength);
      Serial.println();
    } else {
      Serial.println("No APDU response (maybe app not installed?)");
    }

    delay(1000); // small delay before next scan
  }
}
