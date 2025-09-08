### Hardware Summary

This document provides a complete guide to our project, TransitPAY, which combines a PN532 NFC/RFID reader and a NEO-6M GPS module with an ESP8266 (NodeMCU 1.0) board. It includes the correct wiring, the full, ready-to-use code, and key troubleshooting information.

---

### 1. Complete Wiring Diagram

This section outlines the final, correct wiring for all your components.

#### PN532 (SPI) to ESP8266 (NodeMCU)

- **PN532 `SS`** → **ESP8266 `D4`** (GPIO2)
- **PN532 `SCK`** → **ESP8266 `D5`** (GPIO14)
- **PN532 `MISO`** → **ESP8266 `D6`** (GPIO12)
- **PN532 `MOSI`** → **ESP8266 `D7`** (GPIO13)
- **PN532 `VCC`** → **ESP8266 `3.3V`**
- **PN532 `GND`** → **ESP8266 `GND`**

#### NEO-6M (UART) to ESP8266 (NodeMCU)

- **NEO-6M `VCC`** → **ESP8266 `3.3V`**
- **NEO-6M `GND`** → **ESP8266 `GND`**
- **NEO-6M `RX`** → **ESP8266 `D1`** (GPIO5)
- **NEO-6M `TX`** → **ESP8266 `D2`** (GPIO4)

---

### 2. The Full Code

Below is the complete, compiled code. It handles both the NFC scan and GPS data processing, showing the GPS coordinates when a card is scanned.

C++

```
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>
#include <SoftwareSerial.h>
#include <TinyGPS++.h>

// PN532 hardware SPI pins for NodeMCU 1.0.
#define PN532_SS   D4
#define PN532_SCK  D5
#define PN532_MOSI D7
#define PN532_MISO D6

Adafruit_PN532 nfc(PN532_SS);

// GPS software serial pins.
static const int RXPin = D1, TXPin = D2;
static const uint32_t GPSBaud = 9600;

TinyGPSPlus gps;
SoftwareSerial gpsSerial(RXPin, TXPin);

void setup(void) {
  Serial.begin(115200);

  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1);
  }
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX);
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  nfc.SAMConfig();

  gpsSerial.begin(GPSBaud);
  Serial.println("Waiting for a card or a GPS fix...");
}

void loop(void) {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("\nCard Found!");
    Serial.print("UID Length: "); Serial.print(uidLength, DEC); Serial.println(" bytes");
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

    if (gps.location.isUpdated()) {
      Serial.println("GPS Coordinates at scan:");
      Serial.print("Latitude: ");
      Serial.println(gps.location.lat(), 6);
      Serial.print("Longitude: ");
      Serial.println(gps.location.lng(), 6);
    } else {
      Serial.println("Waiting for a GPS fix...");
    }

    delay(1000);
  }
}

```

---

### 3. Key Troubleshooting and FAQs

#### **Q: Why does the Serial Monitor say "Waiting for a GPS fix..."?**

**A:** This is normal and not a hardware issue. The NEO-6M module requires a clear, open view of the sky to acquire a satellite signal. Take your project outdoors and wait 5-15 minutes for the first "cold start" fix.

#### **Q: Why am I getting an "MD5 of file does not match data in flash" error?**

**A:** This is a common flashing error, usually caused by a poor data connection.

- Use a **different, high-quality USB cable**.
- Try a **different USB port** on your computer.
- Disconnect the **PN532 and NEO-6M modules** while you upload the code, then reconnect them afterward.

#### **Q: The code won't upload at all.**

**A:** If you get a "Failed to connect" error, the board may not be in flash mode.

- Close the **Serial Monitor** and restart the window.
- Unplug and plug the USB-type B cable.
- Upload the code again.

#### **Q: Can I use different pins?**

**A:** Yes, for the PN532's `SS` pin and the NEO-6M's `RX`/`TX` pins, you can use any other available GPIO pins, but remember to update the pin definitions in the code accordingly. Do not use the same pin for two different data connections.
