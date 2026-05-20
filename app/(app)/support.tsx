import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ChatBubble, ChevronRight, Phone, Receipt, Sparkle } from '@/components/icons';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { config } from '@/config/env';

const FAQ = [
  { q: 'How do I freeze my card?', a: 'Open the Cards tab, tap the card, then tap Freeze. It can be unfrozen anytime.' },
  { q: 'How do I change my PIN?',  a: 'Profile → Security → Change PIN. You will be asked to enter your current PIN first.' },
  { q: 'How long do transfers take?', a: 'Card-to-card and phone transfers within Uzbekistan are instant.' },
];

export default function SupportScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showToast = useUIStore((s) => s.showToast);

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('support.title')} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard padded={false}>
          <Row
            icon={<ChatBubble size={20} color={colors.text.primary} />}
            title={t('support.chat')}
            subtitle="Avg. response in 2 minutes"
            onPress={() => showToast({ message: 'Chat coming online…', variant: 'info' })}
          />
          <Sep />
          <Row
            icon={<Phone size={20} color={colors.text.primary} />}
            title={t('support.call')}
            subtitle={config.supportPhone}
            onPress={() => showToast({ message: 'Dialing…', variant: 'info' })}
          />
          <Sep />
          <Row
            icon={<Receipt size={20} color={colors.text.primary} />}
            title={t('support.feedback')}
            subtitle="We read every message"
            onPress={() => showToast({ message: 'Thank you for your feedback', variant: 'success' })}
          />
        </GlassCard>

        <View style={{ gap: spacing.md }}>
          <Text variant="h3">{t('support.faq')}</Text>
          {FAQ.map((item, i) => (
            <GlassCard key={i}>
              <Text variant="bodyLg" weight="600">{item.q}</Text>
              <Text variant="bodySm" tone="secondary" style={{ marginTop: 6 }}>{item.a}</Text>
            </GlassCard>
          ))}
        </View>

        <PrimaryButton
          label="Open chat"
          icon={<Sparkle size={18} color="#fff" />}
          onPress={() => showToast({ message: 'Connecting you to support…', variant: 'info' })}
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
