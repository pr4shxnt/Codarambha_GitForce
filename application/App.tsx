import React, { useState } from 'react';
import {
  Button,
  TextInput,
  View,
  NativeModules,
  StyleSheet,
} from 'react-native';

const { HceModule } = NativeModules;

export default function App() {
  const [payload, setPayload] = useState('');

  const sendToHce = () => {
    if (payload.trim() !== '') {
      HceModule.sendPayload(payload);
      setPayload('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter credential or message"
        value={payload}
        onChangeText={setPayload}
      />
      <Button title="Send to HCE" onPress={sendToHce} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 },
});
