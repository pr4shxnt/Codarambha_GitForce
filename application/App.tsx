import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  View,
  NativeModules,
  StyleSheet,
} from 'react-native';

const { HceModule } = NativeModules;

export default function App() {
  const [payload, setPayload] = useState('DGSVS343WE3XIA22ESDCDSDSV.  ');

  useEffect(() => {
    const sendToHce = () => {
      if (payload.trim() !== '') {
        HceModule.sendPayload(payload);
      }
    };

    sendToHce();
  });

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 },
});
