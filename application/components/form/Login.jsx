import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import '../../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAllStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    stores.forEach(([key, value]) => {
      console.log(`${key} => ${value}`);
    });
  } catch (e) {
    console.error('Failed to fetch AsyncStorage', e);
  }
};


// console.log("Current AsyncStorage contents:");checkAllStorage();

// console.log(AsyncStorage.getItem('token'));
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email number and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://codarambha-git-force-transit-pay-ba.vercel.app/api/users/login', {
        email,
        password,
      });

      const data = response.data;

      // ✅ Success
      Alert.alert('Login Successful', `Welcome back!`);
      console.log('User Data:', data);

      // Example: store token in AsyncStorage
      await AsyncStorage.setItem('token', data.token);

    } catch (error) {
      console.error(error);

      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        // Request made but no response received
        Alert.alert('Error', 'No response from server. Try again later.');
      } else {
        // Other errors
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center bg-white">
      <View className="mt-10 flex flex-row items-center">
        <Image
          source={require('../assets/apppicon.png')}
          className="h-16 w-16 self-center rounded-xl"
          resizeMode="contain"
        />
        <Text className="ml-2 text-2xl font-bold text-blue-500">TransitPAY</Text>
      </View>

      <View className="flex w-[80%] flex-col gap-4 pt-10">
        <View>
          <Text className="mb-1 font-medium text-gray-700">email Number</Text>
          <TextInput
            placeholder="Enter email number"
            keyboardType="email"
            value={email}
            onChangeText={setEmail}
            className="rounded-xl border border-gray-300 px-3 py-3 text-black"
            placeholderTextColor="gray"
          />
        </View>

        <View>
          <Text className="mb-1 font-medium text-gray-700">Password</Text>
          <TextInput
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="rounded-xl border border-gray-300 px-3 py-3 text-black"
            placeholderTextColor="gray"
          />
        </View>

        <View className="w-full flex-row justify-between">
          <View className="flex-row items-center">
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#007AFF' : '#f4f3f4'}
            />
            <Text className="font-semibold">Remember me</Text>
          </View>
          <View>
            <Text className="text-purple-500 underline">Forgot password</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          className={`rounded-full px-4 py-3 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          disabled={loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
