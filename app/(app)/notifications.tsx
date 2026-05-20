import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Bell, Shield, Sparkle } from '@/components/icons';
import { useSettingsStore } from '@/store/settings.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function NotificationsScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const notifs = useSettingsStore((s) => s.notifications);
  const setNotif = useSettingsStore((s) => s.setNotification);

  const items: Array<{ key: keyof typeof notifs; icon: React.ReactNode; title: string; desc: string }> = [
    { key: 'transactions', icon: <Bell size={20} color={colors.text.primary} />, title: 'Transactions', desc: 'Payments, transfers and receipts' },
    { key: 'security',     icon: <Shield size={20} color={colors.text.primary} />, title: 'Security',     desc: 'Logins, devices and account alerts' },
    { key: 'promotions',   icon: <Sparkle size={20} color={colors.text.primary} />, title: 'Promotions',  desc: 'Offers, cashback and news' },
  ];

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('profile.notifications')} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing['4xl'] }}>
        <GlassCard padded={false}>
          {items.map((it, i) => (
            <View key={it.key}>
              <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40, height: 40, borderRadius: radii.lg,
                    backgroundColor: colors.bg.base,
                    alignItems: 'center', justifyContent: 'center', marginRight: 12,
                  }}
                >
                  {it.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLg" weight="500">{it.title}</Text>
                  <Text variant="caption" tone="muted">{it.desc}</Text>
                </View>
                <Switch
                  value={notifs[it.key]}
                  onValueChange={(v) => setNotif(it.key, v)}
                  trackColor={{ true: colors.brand.accent, false: colors.border.strong }}
                  thumbColor="#fff"
                />
              </View>
              {i !== items.length - 1 ? (
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg + 52 }} />
              ) : null}
            </View>
          ))}
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
