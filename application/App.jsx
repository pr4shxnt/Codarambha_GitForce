import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import WelcomeScreen from './components/app/WelcomeScreen';
import Login from './components/form/Login';

const App = () => {
  return (
    <SafeAreaView className="flex-1  bg-black">
      <View className="flex-1">
        <Login />
      </View>
    </SafeAreaView>
  );
};

export default App;
