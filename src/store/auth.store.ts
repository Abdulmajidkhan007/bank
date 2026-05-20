import { create } from 'zustand';
import { secureStorage } from '@/services/storage/secure';
import { sha256 } from '@/services/crypto/hash';
import { mockUser } from '@/services/api/mock';
import { User } from '@/types/domain';

export type AuthStatus = 'idle' | 'loading' | 'unauthenticated' | 'pin-required' | 'authenticated';

type AuthState = {
  status: AuthStatus;
  user: User | null;
  phone: string | null;
  hasPin: boolean;
  initialize: () => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<{ requiresPinSetup: boolean }>;
  setupPin: (pin: string) => Promise<void>;
  unlockWithPin: (pin: string) => Promise<boolean>;
  unlockWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
};

const MOCK_OTP = '123456';

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  phone: null,
  hasPin: false,

  async initialize() {
    set({ status: 'loading' });
    const [token, pinHash] = await Promise.all([
      secureStorage.getAccessToken(),
      secureStorage.getPinHash(),
    ]);
    if (token && pinHash) {
      set({ hasPin: true, user: mockUser, status: 'pin-required' });
    } else {
      set({ status: 'unauthenticated', hasPin: !!pinHash });
    }
  },

  async requestOtp(phone) {
    await delay(450);
    set({ phone });
  },

  async verifyOtp(code) {
    await delay(450);
    if (code !== MOCK_OTP) {
      throw new Error('Invalid verification code');
    }
    await secureStorage.setAccessToken('mock.access.token');
    await secureStorage.setRefreshToken('mock.refresh.token');
    const existingPin = await secureStorage.getPinHash();
    if (existingPin) {
      set({ user: mockUser, hasPin: true, status: 'authenticated' });
      return { requiresPinSetup: false };
    }
    set({ user: mockUser, hasPin: false, status: 'pin-required' });
    return { requiresPinSetup: true };
  },

  async setupPin(pin) {
    const salt = await secureStorage.getDeviceSalt();
    const hash = await sha256(`${salt}:${pin}`);
    await secureStorage.setPinHash(hash);
    set({ hasPin: true, status: 'authenticated' });
  },

  async unlockWithPin(pin) {
    const [salt, hash] = await Promise.all([
      secureStorage.getDeviceSalt(),
      secureStorage.getPinHash(),
    ]);
    if (!hash) return false;
    const candidate = await sha256(`${salt}:${pin}`);
    const ok = candidate === hash;
    if (ok) set({ status: 'authenticated' });
    return ok;
  },

  async unlockWithBiometric() {
    set({ status: 'authenticated' });
  },

  async logout() {
    await secureStorage.clear();
    set({ status: 'unauthenticated', user: null, phone: null, hasPin: false });
  },
}));

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
