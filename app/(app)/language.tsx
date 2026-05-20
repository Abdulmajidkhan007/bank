import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Check } from '@/components/icons';
import { useSettingsStore, Language } from '@/store/settings.store';
import { useTheme } from '@/theme/ThemeProvider';
import i18n from '@/localization/i18n';

const LANGUAGES: Array<{ id: Language; name: string; native: string; flag: string }> = [
  { id: 'uz', name: 'Uzbek',   native: "O‘zbek",   flag: 'UZ' },
  { id: 'ru', name: 'Russian', native: 'Русский', flag: 'RU' },
  { id: 'en', name: 'English', native: 'English', flag: 'EN' },
];

export default function LanguageScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const lang = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('profile.language')} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing['4xl'] }}>
        <GlassCard padded={false}>
          {LANGUAGES.map((l, i) => {
            const active = lang === l.id;
            return (
              <View key={l.id}>
                <Pressable
                  onPress={() => {
                    setLanguage(l.id);
                    void i18n.changeLanguage(l.id);
                  }}
                  style={({ pressed }) => ({
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.lg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 40, height: 40, borderRadius: radii.lg,
                      backgroundColor: colors.bg.base,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12,
                    }}
                  >
                    <Text variant="caption" weight="700">{l.flag}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyLg" weight="600">{l.native}</Text>
                    <Text variant="caption" tone="muted">{l.name}</Text>
                  </View>
                  {active ? <Check size={20} color={colors.brand.accent} /> : null}
                </Pressable>
                {i !== LANGUAGES.length - 1 ? (
                  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg + 52 }} />
                ) : null}
              </View>
            );
          })}
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
