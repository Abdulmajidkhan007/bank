import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function KycLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.base },
        animation: 'slide_from_right',
      }}
    />
  );
}
