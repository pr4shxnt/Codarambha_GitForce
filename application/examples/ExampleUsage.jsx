/**
 * Example Usage - TransitPay HCE App
 * Demonstrates various ways to use the HCE functionality
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import HCEManager from '../src/HCEManager.jsx';

const ExampleUsage = () => {
  const [status, setStatus] = useState('Ready');
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);
  const [isServiceActive, setIsServiceActive] = useState(false);

  useEffect(() => {
    initializeExample();
  }, []);

  const initializeExample = async () => {
    try {
      setStatus('Initializing...');
      await HCEManager.initialize();
      
      const nfcAvailable = await HCEManager.isNfcAvailable();
      setIsNfcAvailable(nfcAvailable);
      
      setStatus('Initialized successfully');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  // Example 1: Basic Transit Card
  const exampleTransitCard = async () => {
    try {
      setStatus('Creating transit card...');
      
      const transitPayload = HCEManager.generateTransitPayload({
        cardNumber: 'TRANSIT123456',
        balance: '25.50',
        cardType: 'BUS_PASS',
        issuer: 'City Transit Authority',
        location: 'Main Station'
      });

      await HCEManager.setPayload(transitPayload);
      await HCEManager.savePayload(transitPayload);
      
      setStatus('Transit card created successfully');
      Alert.alert('Success', 'Transit card payload generated and saved');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 2: Payment Card
  const examplePaymentCard = async () => {
    try {
      setStatus('Creating payment card...');
      
      const paymentPayload = HCEManager.generatePaymentPayload({
        cardNumber: '4532123456789012',
        expiryMonth: '06',
        expiryYear: '2026',
        cardType: 'MASTERCARD',
        issuer: 'TransitPay Bank',
        cvv: '456',
        cardholderName: 'John Smith'
      });

      await HCEManager.setPayload(paymentPayload);
      await HCEManager.savePayload(paymentPayload);
      
      setStatus('Payment card created successfully');
      Alert.alert('Success', 'Payment card payload generated and saved');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 3: Loyalty Card
  const exampleLoyaltyCard = async () => {
    try {
      setStatus('Creating loyalty card...');
      
      const loyaltyPayload = HCEManager.generateLoyaltyPayload({
        cardNumber: 'LOY789012345',
        points: '2500',
        tier: 'PLATINUM',
        program: 'TransitPay Rewards',
        expiryDate: '2025-12-31'
      });

      await HCEManager.setPayload(loyaltyPayload);
      await HCEManager.savePayload(loyaltyPayload);
      
      setStatus('Loyalty card created successfully');
      Alert.alert('Success', 'Loyalty card payload generated and saved');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 4: Student ID
  const exampleStudentID = async () => {
    try {
      setStatus('Creating student ID...');
      
      const studentPayload = HCEManager.generateStudentPayload({
        studentId: 'STU2024001',
        name: 'Alice Johnson',
        university: 'TransitPay University',
        program: 'Computer Science',
        expiryDate: '2025-08-31',
        mealPlan: 'Premium'
      });

      await HCEManager.setPayload(studentPayload);
      await HCEManager.savePayload(studentPayload);
      
      setStatus('Student ID created successfully');
      Alert.alert('Success', 'Student ID payload generated and saved');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 5: Custom Payload
  const exampleCustomPayload = async () => {
    try {
      setStatus('Creating custom payload...');
      
      const customPayload = HCEManager.generateCustomPayload({
        type: 'EMPLOYEE_BADGE',
        data: {
          employeeId: 'EMP001',
          name: 'Bob Wilson',
          department: 'Engineering',
          accessLevel: 'ADMIN',
          badgeNumber: 'BADGE123456',
          validUntil: '2025-12-31'
        }
      });

      await HCEManager.setPayload(customPayload);
      await HCEManager.savePayload(customPayload);
      
      setStatus('Custom payload created successfully');
      Alert.alert('Success', 'Custom payload generated and saved');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 6: Start HCE Service
  const startHCEService = async () => {
    try {
      setStatus('Starting HCE service...');
      await HCEManager.startService();
      setIsServiceActive(true);
      setStatus('HCE service started');
      Alert.alert('Success', 'HCE service is now active');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 7: Stop HCE Service
  const stopHCEService = async () => {
    try {
      setStatus('Stopping HCE service...');
      await HCEManager.stopService();
      setIsServiceActive(false);
      setStatus('HCE service stopped');
      Alert.alert('Success', 'HCE service stopped');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 8: Get Payload History
  const getPayloadHistory = async () => {
    try {
      setStatus('Getting payload history...');
      const history = await HCEManager.getPayloadHistory();
      
      setStatus(`Found ${history.length} historical payloads`);
      Alert.alert(
        'Payload History', 
        `Found ${history.length} historical payloads. Check console for details.`
      );
      
      console.log('Payload History:', history);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 9: Add to Favorites
  const addToFavorites = async () => {
    try {
      setStatus('Adding to favorites...');
      
      const currentPayload = await HCEManager.getCurrentPayload();
      if (currentPayload) {
        await HCEManager.addToFavorites(currentPayload, 'My Favorite Card');
        setStatus('Added to favorites');
        Alert.alert('Success', 'Current payload added to favorites');
      } else {
        Alert.alert('Info', 'No current payload to add to favorites');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Example 10: Export Data
  const exportData = async () => {
    try {
      setStatus('Exporting data...');
      const exportedData = await HCEManager.exportData();
      
      setStatus('Data exported successfully');
      Alert.alert(
        'Export Complete', 
        'Data exported successfully. Check console for details.'
      );
      
      console.log('Exported Data:', exportedData);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HCE Examples</Text>
        <Text style={styles.subtitle}>Tap buttons to try different features</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status: {status}</Text>
        <Text style={styles.statusLabel}>NFC Available: {isNfcAvailable ? 'Yes' : 'No'}</Text>
        <Text style={styles.statusLabel}>Service Active: {isServiceActive ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payload Generation Examples</Text>
        
        <TouchableOpacity style={styles.button} onPress={exampleTransitCard}>
          <Text style={styles.buttonText}>1. Transit Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={examplePaymentCard}>
          <Text style={styles.buttonText}>2. Payment Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={exampleLoyaltyCard}>
          <Text style={styles.buttonText}>3. Loyalty Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={exampleStudentID}>
          <Text style={styles.buttonText}>4. Student ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={exampleCustomPayload}>
          <Text style={styles.buttonText}>5. Custom Payload</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HCE Service Control</Text>
        
        <TouchableOpacity 
          style={[styles.button, isServiceActive ? styles.buttonStop : styles.buttonStart]} 
          onPress={isServiceActive ? stopHCEService : startHCEService}
        >
          <Text style={styles.buttonText}>
            {isServiceActive ? 'Stop HCE Service' : 'Start HCE Service'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.button} onPress={getPayloadHistory}>
          <Text style={styles.buttonText}>Get Payload History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={addToFavorites}>
          <Text style={styles.buttonText}>Add to Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={exportData}>
          <Text style={styles.buttonText}>Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonStop: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExampleUsage;
