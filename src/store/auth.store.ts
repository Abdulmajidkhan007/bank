import { create } from 'zustand';
import { secureStorage } from '@/services/storage/secure';
import { sha256 } from '@/services/crypto/hash';
import { mockUser } from '@/services/api/mock';
import { authApi } from '@/services/api/endpoints/auth';
import { config } from '@/config/env';
import { User } from '@/types/domain';

export type AuthStatus = 'idle' | 'loading' | 'unauthenticated' | 'pin-required' | 'authenticated';

export class OtpError extends Error {
  readonly code: string;
  readonly retryInSeconds?: number;
  constructor(message: string, code: string, retryInSeconds?: number) {
    super(message);
    this.code = code;
    this.retryInSeconds = retryInSeconds;
  }
}

type AuthState = {
  status: AuthStatus;
  user: User | null;
  phone: string | null;
  hasPin: boolean;
  devCode: string | null;
  initialize: () => Promise<void>;
  requestOtp: (phone: string) => Promise<{ resendInSeconds: number; devCode?: string }>;
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
  devCode: null,

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
    set({ phone, devCode: null });

    if (!config.hasBackend) {
      await delay(450);
      return { resendInSeconds: 60 };
    }

    try {
      const res = await authApi.requestOtp(phone);
      set({ devCode: res.devCode ?? null });
      return { resendInSeconds: res.resendInSeconds, devCode: res.devCode };
    } catch (err) {
      const e = err as { code?: string; message?: string; details?: { retryInSeconds?: number } };
      throw new OtpError(e.message ?? 'Could not send code', e.code ?? 'NETWORK', e.details?.retryInSeconds);
    }
  },

  async verifyOtp(code) {
    const phone = get().phone;

    if (!config.hasBackend) {
      await delay(450);
      if (code !== MOCK_OTP) throw new OtpError('Invalid verification code', 'INVALID');
      await secureStorage.setAccessToken('mock.access.token');
      await secureStorage.setRefreshToken('mock.refresh.token');
      const existingPin = await secureStorage.getPinHash();
      if (existingPin) {
        set({ user: mockUser, hasPin: true, status: 'authenticated' });
        return { requiresPinSetup: false };
      }
      set({ user: mockUser, hasPin: false, status: 'pin-required' });
      return { requiresPinSetup: true };
    }

    if (!phone) throw new OtpError('Phone not set', 'NO_PHONE');

    try {
      const res = await authApi.verifyOtp(phone, code);
      await secureStorage.setAccessToken(res.accessToken);
      await secureStorage.setRefreshToken(res.refreshToken);

      const user: User = {
        id: res.user.id,
        fullName: res.user.fullName || mockUser.fullName,
        phone: res.user.phone,
        avatarColor: mockUser.avatarColor,
        initials:
          res.user.fullName
            ? res.user.fullName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')
            : mockUser.initials,
        kycStatus: res.user.kycStatus,
      };

      const existingPin = await secureStorage.getPinHash();
      if (existingPin) {
        set({ user, hasPin: true, status: 'authenticated' });
        return { requiresPinSetup: false };
      }
      set({ user, hasPin: false, status: 'pin-required' });
      return { requiresPinSetup: true };
    } catch (err) {
      const e = err as { code?: string; message?: string };
      throw new OtpError(e.message ?? 'Invalid verification code', e.code ?? 'INVALID');
    }
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
    set({ status: 'unauthenticated', user: null, phone: null, hasPin: false, devCode: null });
  },
}));

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
