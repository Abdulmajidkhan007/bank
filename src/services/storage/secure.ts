import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'uzcard.token.access',
  refreshToken: 'uzcard.token.refresh',
  pinHash: 'uzcard.security.pinHash',
  deviceSalt: 'uzcard.security.salt',
} as const;

export const secureStorage = {
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(KEYS.accessToken, token);
  },
  async getAccessToken() {
    return SecureStore.getItemAsync(KEYS.accessToken);
  },
  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync(KEYS.refreshToken, token);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(KEYS.refreshToken);
  },
  async setPinHash(hash: string) {
    await SecureStore.setItemAsync(KEYS.pinHash, hash);
  },
  async getPinHash() {
    return SecureStore.getItemAsync(KEYS.pinHash);
  },
  async getDeviceSalt() {
    let salt = await SecureStore.getItemAsync(KEYS.deviceSalt);
    if (!salt) {
      salt = generateSalt();
      await SecureStore.setItemAsync(KEYS.deviceSalt, salt);
    }
    return salt;
  },
  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
      SecureStore.deleteItemAsync(KEYS.pinHash),
    ]);
  },
};

function generateSalt(): string {
  const chars = 'abcdef0123456789';
  let out = '';
  for (let i = 0; i < 32; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
