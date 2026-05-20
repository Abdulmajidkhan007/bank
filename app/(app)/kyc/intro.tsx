import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Card as CardIcon, Check, Shield, User } from '@/components/icons';
import { useTheme } from '@/theme/ThemeProvider';
import { palette } from '@/theme/colors';
import { useKycStore } from '@/store/kyc.store';

export default function KycIntro() {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reset = useKycStore((s) => s.reset);

  return (
    <ScreenContainer surface="base">
      <AppHeader title="Identity verification" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <LinearGradient
            colors={[palette.navy600, palette.cyan600]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radii['2xl'], padding: spacing['2xl'], alignItems: 'center', gap: 12 }}
          >
            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Shield size={40} color="#fff" />
            </View>
            <Text variant="h1" tone="onBrand" align="center">Verify your identity</Text>
            <Text variant="bodyLg" tone="onBrand" align="center" style={{ opacity: 0.85 }}>
              A short check unlocks transfers, top-ups and limits.
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={{ gap: spacing.md }}>
          <Step n={1} icon={<CardIcon size={20} color={colors.brand.primary} />} title="Scan your passport" desc="The bio page with your photo and number." />
          <Step n={2} icon={<User size={20} color={colors.brand.primary} />} title="Take a selfie" desc="Look at the camera in good light." />
          <Step n={3} icon={<Check size={20} color={colors.brand.primary} />} title="Submit for review" desc="We check it instantly and unlock your account." />
        </View>

        <GlassCard>
          <Text variant="bodySm" tone="secondary">
            Your data is encrypted and only used to verify your identity. We never share it with third parties.
          </Text>
        </GlassCard>

        <PrimaryButton
          label="Start verification"
          onPress={() => {
            reset();
            router.push('/(app)/kyc/passport');
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.bg.surface,
        borderColor: colors.border.subtle,
        borderWidth: 1,
        borderRadius: radii.xl,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radii.lg,
          backgroundColor: colors.brand.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLg" weight="600">{title}</Text>
        <Text variant="caption" tone="muted">{desc}</Text>
      </View>
      <Text variant="h3" tone="muted">{n}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
