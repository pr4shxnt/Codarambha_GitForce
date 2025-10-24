# TransitPay - HCE Emulation App

A React Native application for Host Card Emulation (HCE) with dynamic payload support. This app allows Android devices to emulate various types of cards (transit, payment, loyalty, student ID) using NFC technology.

## Features

- **Host Card Emulation (HCE)** - Emulate various card types using NFC
- **Dynamic Payload Management** - Generate and manage different card payloads
- **Multiple Card Types** - Support for transit, payment, loyalty, and student ID cards
- **Payload Storage** - Save, retrieve, and manage payloads with history
- **Favorites System** - Save frequently used payloads
- **Template System** - Create reusable payload templates
- **Data Export/Import** - Backup and restore payload data
- **Real-time Status** - Monitor HCE service status and NFC availability

## Prerequisites

- Android device with NFC support
- Android 4.4+ (API level 19+)
- React Native development environment
- Android Studio for building

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transitpay
```

2. Install dependencies:
```bash
npm install
```

3. For Android:
```bash
cd android
./gradlew clean
cd ..
```

4. Run the application:
```bash
npx react-native run-android
```

## Usage

### Basic HCE Operations

```javascript
import HCEManager from './src/HCEManager.jsx';

// Initialize HCE
await HCEManager.initialize();

// Check NFC availability
const isNfcAvailable = await HCEManager.isNfcAvailable();

// Start HCE service
await HCEManager.startService();

// Set a payload
const payload = HCEManager.generateTransitPayload({
  cardNumber: '1234567890',
  balance: '50.00',
  cardType: 'TRANSIT'
});

await HCEManager.setPayload(payload);

// Stop HCE service
await HCEManager.stopService();
```

### Payload Generation

#### Transit Card
```javascript
const transitPayload = HCEManager.generateTransitPayload({
  cardNumber: '1234567890',
  balance: '50.00',
  expiryDate: '2025-12-31',
  cardType: 'TRANSIT',
  issuer: 'TransitPay',
  location: 'Downtown Station'
});
```

#### Payment Card
```javascript
const paymentPayload = HCEManager.generatePaymentPayload({
  cardNumber: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2025',
  cardType: 'VISA',
  issuer: 'TransitPay Bank',
  cvv: '123',
  cardholderName: 'John Doe'
});
```

#### Loyalty Card
```javascript
const loyaltyPayload = HCEManager.generateLoyaltyPayload({
  cardNumber: 'LOY123456789',
  points: '1000',
  tier: 'GOLD',
  program: 'TransitPay Rewards',
  expiryDate: '2025-12-31'
});
```

#### Student ID
```javascript
const studentPayload = HCEManager.generateStudentPayload({
  studentId: 'STU123456',
  name: 'Jane Student',
  university: 'TransitPay University',
  program: 'Computer Science',
  expiryDate: '2025-12-31',
  mealPlan: 'Unlimited'
});
```

### Payload Management

```javascript
// Save payload to storage
await HCEManager.savePayload(payload);

// Get stored payload
const storedPayload = await HCEManager.getStoredPayload();

// Get payload history
const history = await HCEManager.getPayloadHistory();

// Add to favorites
await HCEManager.addToFavorites(payload, 'My Transit Card');

// Get favorite payloads
const favorites = await HCEManager.getFavoritePayloads();
```

### Event Listeners

```javascript
// Add event listener
const unsubscribe = HCEManager.addEventListener('HCE_SERVICE_STARTED', (message) => {
  console.log('HCE Service started:', message);
});

// Remove listener
unsubscribe();

// Remove all listeners
HCEManager.removeAllListeners();
```

### Data Export/Import

```javascript
// Export all data
const exportedData = await HCEManager.exportData();

// Import data
await HCEManager.importData(exportedData);
```

## Project Structure

```
transitpay/
├── android/
│   └── app/
│       └── src/
│           └── main/
│               ├── java/com/transitpay/
│               │   ├── HCEService.kt          # HCE service implementation
│               │   ├── HCEModule.kt           # React Native bridge
│               │   ├── HCEPackage.kt         # Package registration
│               │   └── MainApplication.kt   # Application class
│               ├── res/
│               │   ├── xml/
│               │   │   └── apduservice.xml  # HCE service configuration
│               │   └── values/
│               │       └── strings.xml       # String resources
│               └── AndroidManifest.xml       # App permissions and services
├── src/
│   ├── HCEManager.jsx        # Main HCE manager
│   ├── PayloadGenerator.jsx  # Payload generation utilities
│   └── PayloadStorage.jsx    # Storage management
├── App.jsx                   # Main application component
└── README.md                # This file
```

## Android Configuration

The app requires the following Android permissions and features:

- `android.permission.NFC` - NFC access
- `android.hardware.nfc` - NFC hardware requirement
- `android.hardware.nfc.hce` - HCE capability requirement

The HCE service is configured in `apduservice.xml` with support for:
- Transit card AIDs (F001234567890, F001234567891, F001234567892)
- Payment card AIDs (A0000000031010, A0000000032010)

## API Reference

### HCEManager Methods

#### Core HCE Operations
- `initialize()` - Initialize HCE module
- `isNfcAvailable()` - Check NFC availability
- `startService()` - Start HCE service
- `stopService()` - Stop HCE service
- `setPayload(payload)` - Set current payload
- `getCurrentPayload()` - Get current payload
- `isServiceActive()` - Check service status

#### Payload Generation
- `generateTransitPayload(cardData)` - Generate transit card payload
- `generatePaymentPayload(paymentData)` - Generate payment card payload
- `generateLoyaltyPayload(loyaltyData)` - Generate loyalty card payload
- `generateStudentPayload(studentData)` - Generate student ID payload
- `generateCustomPayload(customData)` - Generate custom payload

#### Payload Management
- `validatePayload(payload)` - Validate payload format
- `parsePayload(payload)` - Parse payload data
- `getPayloadType(payload)` - Get payload type
- `savePayload(payload)` - Save payload to storage
- `getStoredPayload()` - Get stored payload

#### Storage Operations
- `getPayloadHistory()` - Get payload history
- `addToFavorites(payload, name)` - Add to favorites
- `getFavoritePayloads()` - Get favorite payloads
- `savePayloadTemplate(template)` - Save template
- `getPayloadTemplates()` - Get templates
- `exportData()` - Export all data
- `importData(data)` - Import data

#### Event Management
- `addEventListener(eventName, callback)` - Add event listener
- `removeAllListeners()` - Remove all listeners

## Troubleshooting

### Common Issues

1. **NFC not available**
   - Ensure device has NFC hardware
   - Check if NFC is enabled in device settings
   - Verify app has NFC permission

2. **HCE service not starting**
   - Check Android version (requires 4.4+)
   - Verify HCE capability in device
   - Check service configuration in AndroidManifest.xml

3. **Payload not working**
   - Validate payload format
   - Check AID configuration
   - Verify card reader compatibility

### Debug Mode

Enable debug logging by checking the Android logs:
```bash
adb logcat | grep HCEService
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Android HCE documentation

## Security Notes

- This app is for demonstration purposes
- Payloads are not encrypted by default
- Use in production requires additional security measures
- Never store sensitive payment information in plain text