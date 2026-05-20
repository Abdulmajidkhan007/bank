import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const storage = new MMKV({ id: 'uzcard.app' });

export const mmkvStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};
