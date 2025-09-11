import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_PREFIX = 'transitpay:userId:';
const CARD_FLAG_PREFIX = 'transitpay:userCard:';

export async function getOrCreateUserId(userKey) {
  const key = `${STORAGE_PREFIX}${userKey || 'anonymous'}`;
  try {
    const existing = await AsyncStorage.getItem(key);
    if (existing) return existing;
    const id = uuidv4();
    await AsyncStorage.setItem(key, id);
    return id;
  } catch (e) {
    return uuidv4();
  }
}

export async function hasGeneratedCard(userKey) {
  const key = `${CARD_FLAG_PREFIX}${userKey || 'anonymous'}`;
  return (await AsyncStorage.getItem(key)) === '1';
}

export async function generateUserCard(userKey) {
  const uid = await getOrCreateUserId(userKey);
  const flagKey = `${CARD_FLAG_PREFIX}${userKey || 'anonymous'}`;
  await AsyncStorage.setItem(flagKey, '1');
  return uid;
}


