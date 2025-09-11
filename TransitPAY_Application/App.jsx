import { ArrowBigRight } from 'lucide-react';
import './global.css';
import { Text, View, Pressable } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Pressable className="bg-blue-500 px-3 py-2">
        <Text className="text-3xl">Continue</Text>
      </Pressable>
      <Text className="text-xl font-bold text-blue-500">
        Welcome to TransitPay!
      </Text>
    </View>
  );
}
