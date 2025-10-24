# TransitPay - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Android device with NFC support
- Android Studio installed
- Node.js 20+ installed
- React Native development environment

### Installation Steps

1. **Navigate to project directory:**
```bash
cd /home/prashant/Projects/transitpay
```

2. **Install dependencies:**
```bash
npm install
```

3. **Clean and build Android project:**
```bash
npm run clean
```

4. **Start Metro bundler:**
```bash
npm start
```

5. **Run on Android device/emulator:**
```bash
npm run android
```

## 📱 Using the App

### Basic Usage

1. **Open the app** on your Android device
2. **Check NFC status** - The app will show if NFC is available
3. **Configure your card** - Enter card details in the form
4. **Generate payload** - Choose from Transit, Payment, Loyalty, or Student ID
5. **Start HCE service** - Tap "Start HCE Service" button
6. **Test with NFC reader** - Use another NFC device to read the emulated card

### Supported Card Types

#### 🚌 Transit Card
- Bus passes
- Metro cards
- Train tickets
- Ferry passes

#### 💳 Payment Card
- Credit cards
- Debit cards
- Prepaid cards
- Digital wallets

#### 🎯 Loyalty Card
- Rewards programs
- Points cards
- Membership cards
- Store cards

#### 🎓 Student ID
- University cards
- School IDs
- Campus access
- Meal plans

## 🔧 Development

### Project Structure
```
transitpay/
├── android/           # Android native code
├── src/              # React Native source
│   ├── HCEManager.jsx    # Main HCE manager
│   ├── PayloadGenerator.jsx  # Payload utilities
│   └── PayloadStorage.jsx    # Storage management
├── examples/         # Usage examples
├── App.jsx           # Main app component
└── README.md         # Full documentation
```

### Key Files
- `App.jsx` - Main application interface
- `src/HCEManager.jsx` - HCE functionality
- `android/app/src/main/java/com/transitpay/HCEService.kt` - Android HCE service
- `android/app/src/main/res/xml/apduservice.xml` - HCE configuration

### Available Scripts
```bash
npm run android      # Run on Android
npm run clean        # Clean Android build
npm run build        # Build Android APK
npm run dev          # Start Metro bundler
npm run run-dev      # Clean and run on Android
```

## 🛠️ Troubleshooting

### Common Issues

**NFC not available:**
- Check if device has NFC hardware
- Enable NFC in device settings
- Verify app permissions

**HCE service not starting:**
- Ensure Android 4.4+ (API 19+)
- Check HCE capability
- Verify service configuration

**Build errors:**
- Run `npm run clean`
- Check Android Studio setup
- Verify React Native installation

### Debug Commands
```bash
# Check Android logs
adb logcat | grep HCEService

# Check Metro logs
npm start --verbose

# Clean everything
npm run clean && npm install
```

## 📋 Features

✅ **Host Card Emulation (HCE)**  
✅ **Dynamic Payload Management**  
✅ **Multiple Card Types**  
✅ **Payload Storage & History**  
✅ **Favorites System**  
✅ **Template Management**  
✅ **Data Export/Import**  
✅ **Real-time Status Monitoring**  

## 🔒 Security Notes

- This is a demonstration app
- Payloads are not encrypted by default
- Use additional security for production
- Never store sensitive payment data in plain text

## 📞 Support

- Check README.md for full documentation
- Review examples/ExampleUsage.jsx for code samples
- Create issues for bugs or feature requests

## 🎯 Next Steps

1. Test with different NFC readers
2. Customize payload formats
3. Add encryption for sensitive data
4. Implement additional card types
5. Add biometric authentication

---

**Happy HCE Development! 🚀**
