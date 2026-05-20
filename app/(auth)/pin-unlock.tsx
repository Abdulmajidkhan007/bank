import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { PINInput } from '@/components/forms/PINInput';
import { useAuthStore } from '@/store/auth.store';
import { useSettingsStore } from '@/store/settings.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { biometric } from '@/services/biometric/biometric';

export default function PinUnlockScreen() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const unlockWithPin = useAuthStore((s) => s.unlockWithPin);
  const unlockWithBiometric = useAuthStore((s) => s.unlockWithBiometric);
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const showToast = useUIStore((s) => s.showToast);

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);

  useEffect(() => {
    void biometric.isAvailable().then(setBioAvailable);
  }, []);

  const tryBiometric = async () => {
    const ok = await biometric.authenticate('Unlock UzCard Bank');
    if (ok) {
      await unlockWithBiometric();
      router.replace('/(app)/(tabs)/home');
    } else {
      showToast({ message: 'Authentication failed', variant: 'error' });
    }
  };

  useEffect(() => {
    if (biometricEnabled && bioAvailable) {
      void tryBiometric();
    }
  }, [biometricEnabled, bioAvailable]);

  const onChange = async (v: string) => {
    setPin(v);
    setError(false);
    if (v.length === 6) {
      const ok = await unlockWithPin(v);
      if (ok) {
        router.replace('/(app)/(tabs)/home');
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  return (
    <ScreenContainer surface="base">
      <View style={[styles.body, { paddingHorizontal: spacing.xl }]}>
        <Animated.View entering={FadeIn.duration(280)}>
          <Text variant="displayLg" align="center">
            {t('auth.pin_unlock_title')}{user ? `, ${user.fullName.split(' ')[0]}` : ''}
          </Text>
          <Text variant="bodyLg" tone="secondary" align="center" style={{ marginTop: spacing.sm }}>
            {t('auth.pin_unlock_desc')}
          </Text>
        </Animated.View>

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: spacing['2xl'] }}>
          <PINInput
            value={pin}
            onChange={onChange}
            error={error}
            showBiometric={biometricEnabled && bioAvailable}
            onBiometric={tryBiometric}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: 56 },
});
