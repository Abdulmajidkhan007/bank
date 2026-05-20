import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function AppLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.base },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="transfer"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="payment-detail" options={{ presentation: 'card' }} />
      <Stack.Screen name="card-detail" options={{ presentation: 'card' }} />
      <Stack.Screen name="transaction-detail" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      <Stack.Screen name="security" options={{ presentation: 'card' }} />
      <Stack.Screen name="language" options={{ presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
      <Stack.Screen name="support" options={{ presentation: 'card' }} />
    </Stack>
  );
}
