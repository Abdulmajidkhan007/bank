import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { BankCard } from '@/components/banking/BankCard';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Eye, EyeOff, Snowflake } from '@/components/icons';
import { useCardsStore } from '@/store/cards.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/utils/format';

export default function CardDetailScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const card = useCardsStore((s) => s.cards.find((c) => c.id === id));
  const toggleFreeze = useCardsStore((s) => s.toggleFreeze);
  const setPrimary = useCardsStore((s) => s.setPrimary);
  const showToast = useUIStore((s) => s.showToast);

  const [revealed, setRevealed] = useState(false);

  if (!card) {
    return (
      <ScreenContainer surface="base">
        <AppHeader />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text tone="muted">Card not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('cards.card_details')} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(280)}>
          <BankCard card={card} width={320} height={210} />
        </Animated.View>

        <GlassCard padded={false} style={{ width: '100%' }}>
          <Row label={t('common.balance')} value={formatMoney(card.balance, card.currency)} />
          <Sep />
          <Row label="Card number" value={revealed ? card.numberMasked.replace(/•/g, '0') : card.numberMasked} action={
            <Pressable onPress={() => setRevealed((v) => !v)} hitSlop={6}>
              {revealed ? <EyeOff size={18} color={colors.text.muted} /> : <Eye size={18} color={colors.text.muted} />}
            </Pressable>
          } />
          <Sep />
          <Row label="Expiry" value={card.expiry} />
          <Sep />
          <Row label="Holder" value={card.holder} />
          <Sep />
          <Row label="Status" value={card.frozen ? t('cards.frozen') : t('cards.active')} valueTone={card.frozen ? 'warning' : 'success'} />
        </GlassCard>

        <View style={[styles.actionRow, { width: '100%' }]}>
          <ActionTile
            label={card.frozen ? t('cards.unfreeze') : t('cards.freeze')}
            icon={<Snowflake size={20} color={card.frozen ? colors.brand.accent : colors.status.info} />}
            onPress={() => {
              toggleFreeze(card.id);
              showToast({
                message: card.frozen ? 'Card unfrozen' : 'Card frozen',
                variant: 'success',
              });
            }}
          />
          <ActionTile
            label={t('cards.make_primary')}
            icon={<Text variant="bodyLg" weight="700" style={{ color: colors.brand.gold }}>★</Text>}
            onPress={() => {
              setPrimary(card.id);
              showToast({ message: 'Set as primary card', variant: 'success' });
            }}
            disabled={card.primary}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value, action, valueTone }: { label: string; value: string; action?: React.ReactNode; valueTone?: 'success' | 'warning' | 'primary' }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text variant="caption" tone="muted">{label}</Text>
        <Text variant="bodyLg" weight="600" tone={valueTone ?? 'primary'} style={{ marginTop: 2 }}>{value}</Text>
      </View>
      {action}
    </View>
  );
}

function Sep() {
  const { colors, spacing } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg }} />;
}

function ActionTile({ label, icon, onPress, disabled }: { label: string; icon: React.ReactNode; onPress?: () => void; disabled?: boolean }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.bg.surface,
        borderColor: colors.border.subtle,
        borderWidth: 1,
        borderRadius: radii.xl,
        padding: spacing.lg,
        alignItems: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: colors.bg.base,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {icon}
      </View>
      <Text variant="bodySm" weight="600" align="center">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionRow: { flexDirection: 'row', gap: 12 },
});
