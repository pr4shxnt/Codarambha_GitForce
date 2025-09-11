import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'transitpay:deviceId';

export async function getOrCreateDeviceId() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = uuidv4();
    await AsyncStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch (e) {
    // Fallback to ephemeral if storage fails
    return uuidv4();
  }
}


