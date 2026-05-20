import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/services/storage/mmkv';

export type ThemePref = 'system' | 'light' | 'dark';
export type Language = 'uz' | 'ru' | 'en';

type SettingsState = {
  theme: ThemePref;
  language: Language;
  biometricEnabled: boolean;
  notifications: {
    transactions: boolean;
    security: boolean;
    promotions: boolean;
  };
  hideBalance: boolean;
  setTheme: (theme: ThemePref) => void;
  setLanguage: (lang: Language) => void;
  setBiometric: (enabled: boolean) => void;
  toggleHideBalance: () => void;
  setNotification: (key: keyof SettingsState['notifications'], value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'uz',
      biometricEnabled: false,
      hideBalance: false,
      notifications: {
        transactions: true,
        security: true,
        promotions: false,
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setBiometric: (biometricEnabled) => set({ biometricEnabled }),
      toggleHideBalance: () => set((s) => ({ hideBalance: !s.hideBalance })),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
    }),
    {
      name: 'uzcard.settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
