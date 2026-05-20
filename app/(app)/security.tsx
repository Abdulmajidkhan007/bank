import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { ChevronRight, FaceId, Fingerprint, Lock, Shield } from '@/components/icons';
import { useSettingsStore } from '@/store/settings.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { biometric } from '@/services/biometric/biometric';

export default function SecurityScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const setBiometric = useSettingsStore((s) => s.setBiometric);
  const showToast = useUIStore((s) => s.showToast);

  const [available, setAvailable] = useState(false);
  const [bioType, setBioType] = useState<'face' | 'fingerprint' | 'iris' | 'none'>('none');

  useEffect(() => {
    void biometric.isAvailable().then(setAvailable);
    void biometric.getType().then(setBioType);
  }, []);

  const toggleBio = async (val: boolean) => {
    if (val) {
      const ok = await biometric.authenticate('Confirm biometric enrollment');
      if (!ok) {
        showToast({ message: 'Biometric setup cancelled', variant: 'error' });
        return;
      }
    }
    setBiometric(val);
    showToast({ message: val ? 'Biometric enabled' : 'Biometric disabled', variant: 'success' });
  };

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('profile.security')} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
      >
        <GlassCard padded={false}>
          <Row
            icon={bioType === 'face' ? <FaceId size={20} color={colors.text.primary} /> : <Fingerprint size={20} color={colors.text.primary} />}
            title={t('auth.use_biometric')}
            subtitle={available ? `${bioType === 'face' ? 'Face ID' : 'Touch ID'} available` : 'Not available on this device'}
            right={
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBio}
                disabled={!available}
                trackColor={{ true: colors.brand.accent, false: colors.border.strong }}
                thumbColor="#fff"
              />
            }
          />
          <Sep />
          <Row
            icon={<Lock size={20} color={colors.text.primary} />}
            title="Change PIN"
            subtitle="Update your 6-digit PIN"
            onPress={() => showToast({ message: 'Re-enter current PIN to change', variant: 'info' })}
            right={<ChevronRight size={18} color={colors.text.muted} />}
          />
          <Sep />
          <Row
            icon={<Shield size={20} color={colors.text.primary} />}
            title="Trusted devices"
            subtitle="1 active session"
            onPress={() => {}}
            right={<ChevronRight size={18} color={colors.text.muted} />}
          />
        </GlassCard>

        <View
          style={{
            backgroundColor: colors.status.infoSoft,
            borderRadius: radii.lg,
            padding: spacing.lg,
            borderColor: colors.status.info,
            borderWidth: 1,
          }}
        >
          <Text variant="bodySm" weight="600" tone="info" style={{ marginBottom: 4 }}>Tip</Text>
          <Text variant="bodySm" tone="secondary">
            For maximum security, enable biometric login and never share your PIN with anyone — not even bank staff.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ icon, title, subtitle, right, onPress }: { icon: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode; onPress?: () => void }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: onPress && pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 40, height: 40, borderRadius: radii.lg,
          backgroundColor: colors.bg.base,
          alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLg" weight="500">{title}</Text>
        {subtitle ? <Text variant="caption" tone="muted">{subtitle}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
}

function Sep() {
  const { colors, spacing } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg + 52 }} />;
}
