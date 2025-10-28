/**
 * Simple test to set NDEF payload
 */

import HCEManager from './src/HCEManager.jsx';

const testNdefPayload = async () => {
  try {
    console.log('Testing NDEF payload...');
    
    // Initialize HCE
    await HCEManager.initialize();
    console.log('HCE initialized');
    
    // Set a custom NDEF payload
    const customNdefPayload = "My Custom Transit Card - Balance: $100.00 - Card: 9999999999 - Type: PREMIUM";
    
    await HCEManager.setNdefPayload(customNdefPayload);
    console.log('NDEF payload set:', customNdefPayload);
    
    // Get the current NDEF payload to verify
    const currentNdefPayload = await HCEManager.getNdefPayload();
    console.log('Current NDEF payload:', currentNdefPayload);
    
    // Start HCE service
    await HCEManager.startService();
    console.log('HCE service started');
    
    console.log('Test completed! Your NFC reader should now read:');
    console.log(customNdefPayload);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Test different payloads
const testMultiplePayloads = async () => {
  const payloads = [
    "Test Card 1 - Balance: $25.00 - Card: 1111111111",
    "Test Card 2 - Balance: $50.00 - Card: 2222222222", 
    "Test Card 3 - Balance: $100.00 - Card: 3333333333"
  ];
  
  try {
    await HCEManager.initialize();
    await HCEManager.startService();
    
    for (let i = 0; i < payloads.length; i++) {
      console.log(`Setting payload ${i + 1}: ${payloads[i]}`);
      await HCEManager.setNdefPayload(payloads[i]);
      
      // Wait 3 seconds between changes
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
  } catch (error) {
    console.error('Multiple payload test failed:', error.message);
  }
};

// Export for use
export default testNdefPayload;
export { testMultiplePayloads };

// Usage examples:
// import testNdefPayload, { testMultiplePayloads } from './testNdef.jsx';
// testNdefPayload();
// testMultiplePayloads();
