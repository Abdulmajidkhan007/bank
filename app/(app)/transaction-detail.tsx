import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Check, Clock, Close, Receipt } from '@/components/icons';
import { useTxStore } from '@/store/transactions.store';
import { useCardsStore } from '@/store/cards.store';
import { useTheme } from '@/theme/ThemeProvider';
import { formatSignedAmount, formatRelativeDate, formatTime } from '@/utils/format';
import { useUIStore } from '@/store/ui.store';

export default function TransactionDetail() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tx = useTxStore((s) => s.items.find((i) => i.id === id));
  const card = useCardsStore((s) => s.cards.find((c) => c.id === tx?.cardId));
  const showToast = useUIStore((s) => s.showToast);

  if (!tx) {
    return (
      <ScreenContainer surface="base">
        <AppHeader />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text tone="muted">Transaction not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  const statusColor =
    tx.status === 'success' ? colors.status.success
    : tx.status === 'pending' ? colors.status.warning
    : colors.status.danger;
  const StatusIcon = tx.status === 'success' ? Check : tx.status === 'pending' ? Clock : Close;

  return (
    <ScreenContainer surface="base">
      <AppHeader title="Transaction" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.xl,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(280)} style={{ alignItems: 'center', gap: spacing.md }}>
          <View style={[styles.statusOrb, { backgroundColor: statusColor }]}>
            <StatusIcon size={36} color="#fff" />
          </View>
          <Text variant="h2">{tx.title}</Text>
          <Text variant="displayLg" tone={tx.direction === 'in' ? 'success' : 'primary'}>
            {formatSignedAmount(tx.amount, tx.currency, tx.direction)}
          </Text>
          <Text variant="bodySm" tone="muted">
            {formatRelativeDate(tx.createdAt)} · {formatTime(tx.createdAt)}
          </Text>
        </Animated.View>

        <GlassCard padded={false} style={{ width: '100%' }}>
          <Row label="Category" value={t(`categories.${tx.category}`)} />
          <Sep />
          <Row label="Status" value={tx.status.charAt(0).toUpperCase() + tx.status.slice(1)} valueTone={tx.status === 'success' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'} />
          <Sep />
          <Row label="Card" value={card ? `${card.brand.toUpperCase()} •• ${card.lastFour}` : '—'} />
          <Sep />
          <Row label="Reference" value={`UZB-${tx.id.toUpperCase()}`} />
          {tx.subtitle ? (
            <>
              <Sep />
              <Row label="Note" value={tx.subtitle} />
            </>
          ) : null}
        </GlassCard>

        <PrimaryButton
          label="Download receipt"
          variant="secondary"
          icon={<Receipt size={18} color={colors.text.primary} />}
          onPress={() => showToast({ message: 'Receipt saved to downloads', variant: 'success' })}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ label, value, valueTone }: { label: string; value: string; valueTone?: 'success' | 'warning' | 'danger' | 'primary' }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row' }}>
      <Text variant="bodySm" tone="muted" style={{ width: 120 }}>{label}</Text>
      <Text variant="bodySm" weight="600" tone={valueTone ?? 'primary'} style={{ flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

function Sep() {
  const { colors, spacing } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border.subtle, marginLeft: spacing.lg }} />;
}

const styles = StyleSheet.create({
  statusOrb: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
});
