import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import '@/localization/i18n';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { ToastHost } from '@/components/feedback/Toast';
import { useAuthStore } from '@/store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Root />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Root() {
  const { scheme, colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((s) => s.status);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (status === 'authenticated' && !inAppGroup) {
      router.replace('/(app)/(tabs)/home');
    } else if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/onboarding');
    } else if (status === 'pin-required' && segments[1] !== 'pin-unlock') {
      router.replace('/(auth)/pin-unlock');
    }
  }, [status, segments, router]);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.base },
          animation: 'fade',
        }}
      />
      <ToastHost />
    </>
  );
}
