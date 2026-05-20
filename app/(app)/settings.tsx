import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Check } from '@/components/icons';
import { useSettingsStore, ThemePref } from '@/store/settings.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function ThemeScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const options: Array<{ id: ThemePref; label: string }> = [
    { id: 'system', label: t('profile.theme_system') },
    { id: 'light',  label: t('profile.theme_light') },
    { id: 'dark',   label: t('profile.theme_dark') },
  ];

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('profile.theme')} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
      >
        <GlassCard padded={false}>
          {options.map((opt, i) => {
            const active = theme === opt.id;
            return (
              <View key={opt.id}>
                <Pressable
                  onPress={() => setTheme(opt.id)}
                  style={({ pressed }) => ({
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.lg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text variant="bodyLg" weight="500" style={{ flex: 1 }}>{opt.label}</Text>
                  {active ? <Check size={20} color={colors.brand.accent} /> : null}
                </Pressable>
                {i !== options.length - 1 ? (
                  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg }} />
                ) : null}
              </View>
            );
          })}
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
