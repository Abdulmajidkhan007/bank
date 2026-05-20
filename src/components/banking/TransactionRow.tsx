import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/primitives/Text';
import { Transaction, TxCategory } from '@/types/domain';
import { useTheme } from '@/theme/ThemeProvider';
import { formatSignedAmount, formatTime } from '@/utils/format';
import { ArrowDownLeft, ArrowUpRight, Card, ChatBubble, Clock, Globe, Receipt, Send, Sparkle, TrendUp, Wallet } from '@/components/icons';

const CATEGORY_META: Record<TxCategory, { color: string; bg: string }> = {
  transfer:      { color: '#2D81F7', bg: 'rgba(45,129,247,0.12)' },
  mobile:        { color: '#7B61FF', bg: 'rgba(123,97,255,0.12)' },
  utilities:     { color: '#F76B1C', bg: 'rgba(247,107,28,0.12)' },
  shopping:      { color: '#E91E63', bg: 'rgba(233,30,99,0.12)' },
  food:          { color: '#16A37B', bg: 'rgba(22,163,123,0.12)' },
  transport:     { color: '#00BFA6', bg: 'rgba(0,191,166,0.12)' },
  entertainment: { color: '#D4AF37', bg: 'rgba(212,175,55,0.14)' },
  salary:        { color: '#16A37B', bg: 'rgba(22,163,123,0.14)' },
  cashback:      { color: '#00BFA6', bg: 'rgba(0,191,166,0.14)' },
  other:         { color: '#8D9AA8', bg: 'rgba(141,154,168,0.16)' },
};

function CategoryIcon({ category, color }: { category: TxCategory; color: string }) {
  const size = 20;
  switch (category) {
    case 'transfer':      return <Send size={size} color={color} />;
    case 'mobile':        return <ChatBubble size={size} color={color} />;
    case 'utilities':     return <Receipt size={size} color={color} />;
    case 'shopping':      return <Card size={size} color={color} />;
    case 'food':          return <Wallet size={size} color={color} />;
    case 'transport':     return <Globe size={size} color={color} />;
    case 'entertainment': return <Sparkle size={size} color={color} />;
    case 'salary':        return <TrendUp size={size} color={color} />;
    case 'cashback':      return <Sparkle size={size} color={color} />;
    default:              return <Receipt size={size} color={color} />;
  }
}

type Props = {
  tx: Transaction;
  onPress?: () => void;
  compact?: boolean;
};

export function TransactionRow({ tx, onPress, compact = false }: Props) {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const meta = CATEGORY_META[tx.category];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          paddingVertical: compact ? spacing.md : spacing.lg,
          paddingHorizontal: compact ? 0 : spacing.lg,
          backgroundColor: pressed ? colors.bg.base : 'transparent',
          borderRadius: radii.lg,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: meta.bg, borderRadius: radii.lg }]}>
        <CategoryIcon category={tx.category} color={meta.color} />
      </View>

      <View style={styles.middle}>
        <Text variant="bodyLg" weight="600" numberOfLines={1}>{tx.title}</Text>
        <View style={styles.subRow}>
          {tx.status === 'pending' ? <Clock size={12} color={colors.status.warning} /> : null}
          <Text
            variant="caption"
            tone={tx.status === 'pending' ? 'warning' : tx.status === 'failed' ? 'danger' : 'muted'}
            numberOfLines={1}
          >
            {tx.status === 'pending' ? 'Pending · ' : tx.status === 'failed' ? 'Failed · ' : ''}
            {tx.subtitle ?? t(`categories.${tx.category}`)} · {formatTime(tx.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.amountWrap}>
        <Text
          variant="bodyLg"
          weight="700"
          tone={tx.direction === 'in' ? 'success' : 'primary'}
          numberOfLines={1}
        >
          {formatSignedAmount(tx.amount, tx.currency, tx.direction)}
        </Text>
        <View style={[styles.dirRow, { marginTop: 2 }]}>
          {tx.direction === 'in' ? (
            <ArrowDownLeft size={12} color={colors.status.success} />
          ) : (
            <ArrowUpRight size={12} color={colors.text.muted} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  middle: { flex: 1 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  amountWrap: { alignItems: 'flex-end' },
  dirRow: { flexDirection: 'row', alignItems: 'center' },
});
