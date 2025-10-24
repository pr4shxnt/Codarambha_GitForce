import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import React, { useState } from 'react';
import '../../global.css';

const Login = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View className="flex-1 items-center bg-white">
      {/* Header */}
      <View className="mt-10 flex flex-row items-center">
        <Image
          source={require('../assets/apppicon.png')}
          className="h-16 w-16 self-center rounded-xl"
          resizeMode="contain"
        />
        <Text className="ml-2 text-2xl font-bold text-blue-500">
          TransitPAY
        </Text>
      </View>

      {/* Form Section */}
      <View className="flex w-[80%] flex-col gap-4 pt-10">
        {/* Phone Number */}
        <View>
          <Text className="mb-1 font-medium text-gray-700">Phone Number</Text>
          <TextInput
            placeholder="Enter phone number"
            keyboardType="numeric"
            className="rounded-xl border border-gray-300 px-3 py-3 text-black"
            placeholderTextColor="gray"
          />
        </View>

        {/* Password */}
        <View>
          <Text className="mb-1 font-medium text-gray-700">Password</Text>
          <TextInput
            placeholder="Enter password"
            ecureTextEntry={true}
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
        <TouchableOpacity className=" rounded-full bg-blue-500 px-4 py-3">
          <Text className="text-center text-lg font-semibold text-white">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;