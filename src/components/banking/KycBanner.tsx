import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/primitives/Text';
import { Check, ChevronRight, Clock, Shield } from '@/components/icons';
import { useTheme } from '@/theme/ThemeProvider';
import { KycStatus } from '@/types/domain';

type Props = {
  status: KycStatus;
};

export function KycBanner({ status }: Props) {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();

  if (status === 'verified') return null;

  const config =
    status === 'submitted'
      ? { gradient: ['#1F2A44', '#0E1B2C'], icon: Clock, title: 'Verification in progress', desc: 'We are reviewing your documents.' }
      : status === 'rejected'
        ? { gradient: [colors.status.danger, '#A33333'], icon: Shield, title: 'Verification failed', desc: 'Please re-submit your documents.' }
        : { gradient: [colors.brand.primary, colors.brand.accent], icon: Shield, title: 'Verify your identity', desc: 'Unlock transfers and higher limits.' };

  const Icon = config.icon;
  const target = status === 'submitted' ? '/(app)/kyc/pending' : '/(app)/kyc/intro';

  return (
    <Pressable onPress={() => router.push(target)}>
      <LinearGradient
        colors={config.gradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.xl, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 12 }}
      >
        <View style={[styles.icon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          {status === 'verified' ? <Check size={22} color="#fff" /> : <Icon size={22} color="#fff" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodyLg" weight="600" tone="onBrand">{config.title}</Text>
          <Text variant="caption" tone="onBrand" style={{ opacity: 0.75 }}>{config.desc}</Text>
        </View>
        <ChevronRight size={18} color="#fff" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
