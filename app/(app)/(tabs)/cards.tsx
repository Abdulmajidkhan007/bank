import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { BankCard } from '@/components/banking/BankCard';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { TransactionRow } from '@/components/banking/TransactionRow';
import { SectionHeader } from '@/components/banking/SectionHeader';
import { Plus, Snowflake, Settings, TrendUp, Receipt } from '@/components/icons';
import { useCardsStore } from '@/store/cards.store';
import { useTxStore } from '@/store/transactions.store';
import { useTheme } from '@/theme/ThemeProvider';
import { useUIStore } from '@/store/ui.store';
import { formatMoney } from '@/utils/format';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_GAP = 16;

export default function CardsTab() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cards = useCardsStore((s) => s.cards);
  const transactions = useTxStore((s) => s.items);
  const toggleFreeze = useCardsStore((s) => s.toggleFreeze);
  const showToast = useUIStore((s) => s.showToast);

  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = cards[activeIndex];

  const cardTransactions = transactions.filter((tx) => tx.cardId === activeCard?.id).slice(0, 6);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    if (i !== activeIndex) setActiveIndex(i);
  };

  return (
    <ScreenContainer surface="base">
      <ScrollView
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing['2xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl }]}>
          <Text variant="h1">{t('cards.title')}</Text>
          <Pressable
            onPress={() => showToast({ message: 'Add card flow coming soon', variant: 'info' })}
            style={({ pressed }) => [
              styles.addBtn,
              {
                backgroundColor: colors.bg.surface,
                borderColor: colors.border.subtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Plus size={20} color={colors.text.primary} />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          horizontal
          data={cards}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: CARD_GAP }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <BankCard
              card={item}
              width={CARD_WIDTH}
              height={210}
              onPress={() => router.push({ pathname: '/(app)/card-detail', params: { id: item.id } })}
            />
          )}
        />

        <View style={[styles.dotsRow]}>
          {cards.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? colors.brand.primary : colors.border.strong,
                  width: i === activeIndex ? 22 : 6,
                },
              ]}
            />
          ))}
        </View>

        {activeCard ? (
          <Animated.View entering={FadeInDown.duration(280)} style={{ paddingHorizontal: spacing.xl, gap: spacing.lg }}>
            <View style={styles.actionsRow}>
              <CardAction
                label={activeCard.frozen ? t('cards.unfreeze') : t('cards.freeze')}
                icon={<Snowflake size={20} color={colors.text.primary} />}
                onPress={() => {
                  toggleFreeze(activeCard.id);
                  showToast({
                    message: activeCard.frozen ? 'Card unfrozen' : 'Card frozen',
                    variant: 'success',
                  });
                }}
              />
              <CardAction
                label={t('cards.limits')}
                icon={<TrendUp size={20} color={colors.text.primary} />}
                onPress={() => showToast({ message: 'Coming soon', variant: 'info' })}
              />
              <CardAction
                label={t('cards.history')}
                icon={<Receipt size={20} color={colors.text.primary} />}
                onPress={() => router.push('/(app)/(tabs)/history')}
              />
              <CardAction
                label={t('cards.settings')}
                icon={<Settings size={20} color={colors.text.primary} />}
                onPress={() => router.push({ pathname: '/(app)/card-detail', params: { id: activeCard.id } })}
              />
            </View>

            <GlassCard>
              <View style={styles.statRow}>
                <View>
                  <Text variant="caption" tone="muted">{t('common.balance')}</Text>
                  <Text variant="h2" style={{ marginTop: 2 }}>
                    {formatMoney(activeCard.balance, activeCard.currency)}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="caption" tone="muted">{t('home.cashback')}</Text>
                  <Text variant="h2" tone="success" style={{ marginTop: 2 }}>
                    {activeCard.cashback ? `+${formatMoney(activeCard.cashback, activeCard.currency)}` : '—'}
                  </Text>
                </View>
              </View>
            </GlassCard>

            <SectionHeader title={t('cards.history')} onAction={() => router.push('/(app)/(tabs)/history')} />

            <GlassCard padded={false}>
              {cardTransactions.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text variant="bodySm" tone="muted">No transactions yet</Text>
                </View>
              ) : (
                cardTransactions.map((tx, i) => (
                  <View key={tx.id}>
                    <View style={{ paddingHorizontal: spacing.lg }}>
                      <TransactionRow
                        tx={tx}
                        compact
                        onPress={() => router.push({ pathname: '/(app)/transaction-detail', params: { id: tx.id } })}
                      />
                    </View>
                    {i !== cardTransactions.length - 1 ? (
                      <View style={[styles.sep, { backgroundColor: colors.border.subtle, marginLeft: spacing['4xl'] + spacing.lg }]} />
                    ) : null}
                  </View>
                ))
              )}
            </GlassCard>
          </Animated.View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function CardAction({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress?: () => void }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          backgroundColor: colors.bg.surface,
          borderColor: colors.border.subtle,
          borderWidth: 1,
          borderRadius: radii.lg,
          paddingVertical: spacing.md,
          alignItems: 'center',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: colors.bg.base,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {icon}
      </View>
      <Text variant="caption" weight="600" numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: {
    width: 44, height: 44, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  dotsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { height: 6, borderRadius: 3 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sep: { height: StyleSheet.hairlineWidth },
});
