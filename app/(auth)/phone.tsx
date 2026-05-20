import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { InputField } from '@/components/forms/InputField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Phone } from '@/components/icons';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { phoneSchema } from '@/utils/validation';
import { formatPhoneUz } from '@/utils/format';

export default function PhoneScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const showToast = useUIStore((s) => s.showToast);

  const [raw, setRaw] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const digits = raw.replace(/\D/g, '');
  const fullDigits = digits.startsWith('998') ? digits : `998${digits}`;
  const display = raw ? formatPhoneUz(digits) : '';
  const valid = phoneSchema.safeParse(fullDigits).success;

  const submit = async () => {
    setError(undefined);
    const parsed = phoneSchema.safeParse(fullDigits);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setSubmitting(true);
    try {
      await requestOtp(`+${parsed.data}`);
      router.push('/(auth)/otp');
    } catch (e) {
      showToast({ message: 'Something went wrong', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer surface="base">
      <AppHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.body, { paddingHorizontal: spacing.xl, gap: spacing['2xl'] }]}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text variant="displayLg">{t('auth.phone_title')}</Text>
            <Text variant="bodyLg" tone="secondary" style={{ marginTop: spacing.sm }}>
              {t('auth.phone_desc')}
            </Text>
          </Animated.View>

          <InputField
            label="Phone number"
            placeholder={t('auth.phone_placeholder')}
            value={display}
            onChangeText={(v) => setRaw(v)}
            keyboardType="phone-pad"
            error={error}
            leftIcon={<Phone size={20} color={colors.text.muted} />}
            autoFocus
          />

          <View style={{ flex: 1 }} />

          <View>
            <Text variant="caption" tone="muted" align="center" style={{ marginBottom: spacing.lg }}>
              {t('auth.agree', { terms: t('auth.terms'), privacy: t('auth.privacy') })}
            </Text>
            <PrimaryButton
              label={t('common.continue')}
              onPress={submit}
              loading={submitting}
              disabled={!valid}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
});
