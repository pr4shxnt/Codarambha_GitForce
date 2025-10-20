import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';

const Login = () => {
  return (
    <View className="flex-1 items-center  bg-white ">
      <View className="flex flex-row items-center">
        <Image
          source={require('../assets/apppicon.png')}
          className=" h-16 w-16 self-center rounded-xl"
          resizeMode="contain"
        />
        <Text className="text-">TransitPAY</Text>
      </View>
      <View className="flex w-[80%] flex-col gap-2 pt-10 backdrop-blur-sm">
        <TextInput
          placeholder="Enter phone number"
          //   value={email}
          //   onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="numeric"
          className="px-3 text-black"
          placeholderTextColor={'gray'}
        />
        <TextInput
          placeholder="Enter password"
          className="px-3 text-black"
          //   value={email}
          //   onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity className="mt-2 rounded-full bg-blue-500 px-4 py-3">
          <Text className="w-full text-center text-lg font-semibold text-white">
            {' '}
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
