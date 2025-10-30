import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import WelcomeScreen from './components/app/WelcomeScreen';
import Login from './components/form/Login';
import InitialLogoScreen from './components/app/InitialLogoScreen';
import { Navigation } from 'lucide-react-native';
import NavigationHandler from './components/Root/NavigationHandler';

const App = () => {
  return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1">
          {/* <WelcomeScreen/> */}
          <NavigationHandler/>
          {/* <Login /> */}
          {/* <InitialLogoScreen/> */}
          
        </View>
      </SafeAreaView>
  );
};

export default App;