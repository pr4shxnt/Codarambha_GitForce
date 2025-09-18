import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  View,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const { HceModule } = NativeModules;

export default function App() {
  const [payload, setPayload] = useState('DGSVS343WE3XIA22ESDCDSDSV.  ');

  useEffect(() => {
    HceModule.sendPayload(payload);
  }, [payload]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000ff' }}>
      <View style={styles.container}>
        <Image
          source={require('./components/assets/apppicon.png')}
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
            marginTop: 50,
            borderRadius: 20,
          }}
          resizeMode="contain"
        />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50,
          }}
        >
          <TouchableOpacity
            style={{
              marginBottom: 10,
              backgroundColor: '#5271FF',
              paddingVertical: 40,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'auto',
              aspectRatio: 1,
              alignSelf: 'center',
              borderRadius: '50%',
            }}
          >
            <Icon name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          <Text>Continue</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 16,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
