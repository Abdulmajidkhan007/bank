import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Bell, ChevronRight, Globe, Lock, Shield, Sparkle, User, ChatBubble, Settings } from '@/components/icons';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProfileTab() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <ScreenContainer surface="base">
      <ScrollView
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1">{t('profile.title')}</Text>

        <GlassCard>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? colors.brand.accent }]}>
              <Text variant="h3" tone="onBrand">{user?.initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text variant="h3">{user?.fullName}</Text>
              <Text variant="bodySm" tone="muted">{user?.phone}</Text>
            </View>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.editBtn,
                { backgroundColor: colors.bg.base, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <User size={18} color={colors.text.primary} />
            </Pressable>
          </View>
        </GlassCard>

        <GlassCard padded={false}>
          <Row icon={<Shield size={20} color={colors.text.primary} />} title={t('profile.security')} onPress={() => router.push('/(app)/security')} />
          <Sep />
          <Row icon={<Bell size={20} color={colors.text.primary} />} title={t('profile.notifications')} onPress={() => router.push('/(app)/notifications')} />
          <Sep />
          <Row icon={<Globe size={20} color={colors.text.primary} />} title={t('profile.language')} onPress={() => router.push('/(app)/language')} />
          <Sep />
          <Row icon={<Settings size={20} color={colors.text.primary} />} title={t('profile.theme')} onPress={() => router.push('/(app)/settings')} />
        </GlassCard>

        <GlassCard padded={false}>
          <Row icon={<ChatBubble size={20} color={colors.text.primary} />} title={t('profile.support')} onPress={() => router.push('/(app)/support')} />
          <Sep />
          <Row icon={<Sparkle size={20} color={colors.text.primary} />} title={t('profile.about')} />
        </GlassCard>

        <PrimaryButton
          label={t('profile.logout')}
          variant="secondary"
          icon={<Lock size={18} color={colors.status.danger} />}
          onPress={() => {
            void logout();
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle?: string; onPress?: () => void }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 40, height: 40, borderRadius: radii.lg,
          backgroundColor: colors.bg.base,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLg" weight="500">{title}</Text>
        {subtitle ? <Text variant="caption" tone="muted">{subtitle}</Text> : null}
      </View>
      <ChevronRight size={18} color={colors.text.muted} />
    </Pressable>
  );
}

function Sep() {
  const { colors, spacing } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg + 52 }} />;
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  editBtn: {
    width: 40, height: 40, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
});
