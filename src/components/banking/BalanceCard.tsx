import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/primitives/Text';
import { Eye, EyeOff, TrendUp } from '@/components/icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettingsStore } from '@/store/settings.store';
import { formatMoney } from '@/utils/format';

type Props = {
  amountUZS: number;
  trendPct?: number;
};

export function BalanceCard({ amountUZS, trendPct = 12.4 }: Props) {
  const { colors, radii, spacing } = useTheme();
  const { t } = useTranslation();
  const hidden = useSettingsStore((s) => s.hideBalance);
  const toggle = useSettingsStore((s) => s.toggleHideBalance);

  return (
    <LinearGradient
      colors={[colors.card.gradientFrom, colors.card.gradientTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: radii['2xl'], padding: spacing['2xl'] }]}
    >
      <View
        style={[
          styles.accentGlow,
          { backgroundColor: colors.card.gradientAccent, opacity: 0.18 },
        ]}
      />
      <View style={styles.headerRow}>
        <Text variant="caption" tone="onBrand" style={{ opacity: 0.7 }}>
          {t('home.total_balance')}
        </Text>
        <Pressable onPress={toggle} hitSlop={10} style={styles.eyeBtn}>
          {hidden ? <EyeOff color="#fff" size={20} /> : <Eye color="#fff" size={20} />}
        </Pressable>
      </View>

      <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(160)} key={hidden ? 'h' : 'v'}>
        <Text variant="balance" tone="onBrand" style={{ marginTop: 8 }}>
          {hidden ? '••• ••• ••• so‘m' : formatMoney(amountUZS, 'UZS')}
        </Text>
      </Animated.View>

      <View style={[styles.row, { marginTop: spacing.lg }]}>
        <View style={styles.trendChip}>
          <TrendUp size={14} color="#fff" />
          <Text variant="caption" tone="onBrand" weight="600">
            +{trendPct}%
          </Text>
        </View>
        <Text variant="caption" tone="onBrand" style={{ opacity: 0.7 }}>
          vs. last month
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
  },
  accentGlow: {
    position: 'absolute',
    width: 280, height: 280, borderRadius: 280,
    top: -80, right: -120,
  },
});
