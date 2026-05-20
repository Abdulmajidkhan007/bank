import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useKycStore } from '@/store/kyc.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function KycReview() {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const passport = useKycStore((s) => s.passportFront);
  const selfie = useKycStore((s) => s.selfie);
  const submit = useKycStore((s) => s.submit);
  const showToast = useUIStore((s) => s.showToast);

  const [submitting, setSubmitting] = useState(false);

  const ready = !!passport && !!selfie;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submit();
      router.replace('/(app)/kyc/pending');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Submission failed';
      showToast({ message: msg, variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer surface="base">
      <AppHeader title="Review" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
      >
        <Animated.View entering={FadeInDown.duration(280)}>
          <Text variant="displayLg">Looks good?</Text>
          <Text variant="bodyLg" tone="secondary" style={{ marginTop: spacing.sm }}>
            Make sure both photos are sharp and well-lit before you submit.
          </Text>
        </Animated.View>

        <GlassCard padded={false} style={{ overflow: 'hidden' }}>
          <View style={{ padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3">Passport</Text>
            <Text
              variant="caption"
              weight="600"
              style={{ color: colors.brand.accent }}
              onPress={() => router.push('/(app)/kyc/passport')}
            >
              Retake
            </Text>
          </View>
          {passport ? (
            <Image
              source={{ uri: passport.uri }}
              style={{ width: '100%', aspectRatio: 3 / 2, backgroundColor: colors.bg.base }}
              resizeMode="cover"
            />
          ) : (
            <Placeholder text="No passport photo yet" />
          )}
        </GlassCard>

        <GlassCard padded={false} style={{ overflow: 'hidden' }}>
          <View style={{ padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3">Selfie</Text>
            <Text
              variant="caption"
              weight="600"
              style={{ color: colors.brand.accent }}
              onPress={() => router.push('/(app)/kyc/selfie')}
            >
              Retake
            </Text>
          </View>
          {selfie ? (
            <Image
              source={{ uri: selfie.uri }}
              style={{ width: '100%', aspectRatio: 1, backgroundColor: colors.bg.base }}
              resizeMode="cover"
            />
          ) : (
            <Placeholder text="No selfie yet" />
          )}
        </GlassCard>

        <PrimaryButton
          label="Submit for verification"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!ready}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

function Placeholder({ text }: { text: string }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ padding: spacing['3xl'], alignItems: 'center' }}>
      <Text tone="muted">{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
