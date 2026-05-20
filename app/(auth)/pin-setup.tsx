import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { PINInput } from '@/components/forms/PINInput';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function PinSetupScreen() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const router = useRouter();
  const setupPin = useAuthStore((s) => s.setupPin);
  const showToast = useUIStore((s) => s.showToast);

  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [error, setError] = useState(false);

  const onChange = (v: string) => {
    setError(false);
    if (step === 'create') {
      setFirst(v);
      if (v.length === 6) {
        setTimeout(() => setStep('confirm'), 160);
      }
    } else {
      setSecond(v);
      if (v.length === 6) {
        if (v === first) {
          void setupPin(v).then(() => {
            showToast({ message: 'PIN created', variant: 'success' });
            router.replace('/(app)/(tabs)/home');
          });
        } else {
          setError(true);
          setTimeout(() => {
            setSecond('');
            setStep('create');
            setFirst('');
            setError(false);
          }, 700);
        }
      }
    }
  };

  return (
    <ScreenContainer surface="base">
      <AppHeader />
      <View style={[styles.body, { paddingHorizontal: spacing.xl }]}>
        <Animated.View entering={FadeIn.duration(300)}>
          <Text variant="displayLg" align="center">
            {step === 'create' ? t('auth.pin_setup_title') : t('auth.pin_confirm_title')}
          </Text>
          <Text variant="bodyLg" tone="secondary" align="center" style={{ marginTop: spacing.sm }}>
            {t('auth.pin_setup_desc')}
          </Text>
        </Animated.View>

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: spacing['2xl'] }}>
          <PINInput
            value={step === 'create' ? first : second}
            onChange={onChange}
            error={error}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: 24 },
});
