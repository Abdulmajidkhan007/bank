import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { OTPInput } from '@/components/forms/OTPInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { OtpError, useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { config } from '@/config/env';

export default function OtpScreen() {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const phone = useAuthStore((s) => s.phone);
  const devCode = useAuthStore((s) => s.devCode);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const showToast = useUIStore((s) => s.showToast);

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const submit = async (value: string) => {
    if (value.length !== 6) return;
    setError(false);
    setSubmitting(true);
    try {
      const { requiresPinSetup } = await verifyOtp(value);
      if (requiresPinSetup) router.replace('/(auth)/pin-setup');
      else router.replace('/(auth)/pin-unlock');
    } catch (e) {
      setError(true);
      const msg = e instanceof OtpError ? e.message : 'Invalid verification code';
      showToast({ message: msg, variant: 'error' });
      setCode('');
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (!phone || resending) return;
    setResending(true);
    try {
      const res = await requestOtp(phone);
      setSecondsLeft(res.resendInSeconds);
      showToast({ message: 'New code sent', variant: 'success' });
    } catch (e) {
      const msg = e instanceof OtpError ? e.message : 'Could not resend code';
      showToast({ message: msg, variant: 'error' });
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenContainer surface="base">
      <AppHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.body, { paddingHorizontal: spacing.xl, gap: spacing['2xl'] }]}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text variant="displayLg">{t('auth.otp_title')}</Text>
            <Text variant="bodyLg" tone="secondary" style={{ marginTop: spacing.sm }}>
              {t('auth.otp_desc', { phone: phone ?? '' })}
            </Text>
          </Animated.View>

          <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
            <OTPInput value={code} onChange={setCode} onFulfilled={submit} error={error} />
          </View>

          <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
            {secondsLeft > 0 ? (
              <Text variant="bodySm" tone="muted">
                {t('auth.otp_resend_in', { sec: secondsLeft })}
              </Text>
            ) : (
              <Pressable onPress={resend} hitSlop={8} disabled={resending}>
                <Text variant="bodySm" weight="600" style={{ color: colors.brand.accent }}>
                  {resending ? '…' : t('auth.otp_resend')}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={{ flex: 1 }} />

          <PrimaryButton
            label={t('common.continue')}
            onPress={() => submit(code)}
            loading={submitting}
            disabled={code.length !== 6}
          />
          {devCode ? (
            <Text variant="micro" tone="muted" align="center" style={{ marginTop: spacing.xs }}>
              Dev code: {devCode}
            </Text>
          ) : !config.hasBackend ? (
            <Text variant="micro" tone="muted" align="center" style={{ marginTop: spacing.xs }}>
              Demo code: 123456
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
});
