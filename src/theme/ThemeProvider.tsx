import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settings.store';
import { ColorTokens, darkTokens, lightTokens, radii, shadows, spacing, typography } from './tokens';

type ThemeContextValue = {
  scheme: 'light' | 'dark';
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  typography: typeof typography;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themePref = useSettingsStore((s) => s.theme);

  const scheme: 'light' | 'dark' = useMemo(() => {
    if (themePref === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return themePref;
  }, [themePref, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors: scheme === 'dark' ? darkTokens : lightTokens,
      spacing,
      radii,
      shadows,
      typography,
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useColors(): ColorTokens {
  return useTheme().colors;
}
