import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { BalanceCard } from '@/components/banking/BalanceCard';
import { QuickAction } from '@/components/banking/QuickAction';
import { TransactionRow } from '@/components/banking/TransactionRow';
import { SectionHeader } from '@/components/banking/SectionHeader';
import { KycBanner } from '@/components/banking/KycBanner';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { IconButton } from '@/components/buttons/IconButton';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Plus,
  QrCode,
  Send,
  Sparkle,
  TrendUp,
  Wallet,
} from '@/components/icons';
import { useCardsStore } from '@/store/cards.store';
import { useTxStore } from '@/store/transactions.store';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/utils/format';

export default function HomeTab() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const totalUZS = useCardsStore((s) => s.totalBalanceUZS());
  const transactions = useTxStore((s) => s.items);
  const recent = useMemo(() => transactions.slice(0, 4), [transactions]);

  const { income, expense } = useMemo(() => {
    const now = new Date();
    const month = transactions.filter((t) => new Date(t.createdAt).getMonth() === now.getMonth());
    return month.reduce(
      (acc, tx) => {
        const fx = tx.currency === 'USD' ? 12_650 : tx.currency === 'EUR' ? 13_780 : tx.currency === 'RUB' ? 135 : 1;
        if (tx.direction === 'in') acc.income += tx.amount * fx;
        else acc.expense += tx.amount * fx;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  return (
    <ScreenContainer surface="base">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing['2xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(380)} style={styles.headerRow}>
          <View style={styles.userBlock}>
            <View style={[styles.avatar, { backgroundColor: user?.avatarColor ?? colors.brand.accent }]}>
              <Text variant="body" weight="700" tone="onBrand">{user?.initials ?? 'SY'}</Text>
            </View>
            <View>
              <Text variant="caption" tone="muted">{t('home.hello')}</Text>
              <Text variant="h3">{user?.fullName.split(' ')[0] ?? 'Sardor'}</Text>
            </View>
          </View>
          <IconButton onPress={() => router.push('/(app)/notifications')}>
            <Bell size={20} color={colors.text.primary} />
            <View style={[styles.notifDot, { backgroundColor: colors.status.danger }]} />
          </IconButton>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(380)}>
          <BalanceCard amountUZS={totalUZS} />
        </Animated.View>

        {user && user.kycStatus !== 'verified' ? (
          <Animated.View entering={FadeInDown.delay(90).duration(380)}>
            <KycBanner status={user.kycStatus} />
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(120).duration(380)} style={{ gap: spacing.md }}>
          <Text variant="h3">{t('home.quick_actions')}</Text>
          <View style={styles.quickRow}>
            <QuickAction
              label={t('home.transfer')}
              icon={<Send color={colors.brand.primary} size={22} />}
              onPress={() => router.push('/(app)/transfer')}
            />
            <QuickAction
              label={t('home.pay')}
              icon={<Wallet color={colors.brand.primary} size={22} />}
              onPress={() => router.push('/(app)/(tabs)/payments')}
            />
            <QuickAction
              label={t('home.qr')}
              icon={<QrCode color={colors.brand.primary} size={22} />}
              onPress={() => router.push('/(app)/transfer')}
            />
            <QuickAction
              label={t('home.topup')}
              icon={<Plus color={colors.brand.primary} size={22} />}
              onPress={() => router.push('/(app)/transfer')}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(380)}>
          <RewardsBanner />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(380)} style={{ gap: spacing.md }}>
          <Text variant="h3">{t('home.insights')}</Text>
          <View style={styles.insightsRow}>
            <InsightTile
              icon={<ArrowDownLeft size={18} color={colors.status.success} />}
              label={t('home.income_this_month')}
              value={formatMoney(income, 'UZS', { compact: true })}
              positive
            />
            <InsightTile
              icon={<ArrowUpRight size={18} color={colors.status.danger} />}
              label={t('home.spend_this_month')}
              value={formatMoney(expense, 'UZS', { compact: true })}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).duration(380)} style={{ gap: spacing.md }}>
          <SectionHeader title={t('home.recent')} onAction={() => router.push('/(app)/(tabs)/history')} />
          <GlassCard padded={false}>
            {recent.map((tx, i) => (
              <View key={tx.id}>
                <View style={{ paddingHorizontal: spacing.lg }}>
                  <TransactionRow
                    tx={tx}
                    compact
                    onPress={() => router.push({ pathname: '/(app)/transaction-detail', params: { id: tx.id } })}
                  />
                </View>
                {i !== recent.length - 1 ? (
                  <View style={[styles.sep, { backgroundColor: colors.border.subtle, marginLeft: spacing['4xl'] + spacing.lg }]} />
                ) : null}
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(380)}>
          <PromotionBanner />
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

function InsightTile({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive?: boolean }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg.surface,
        borderColor: colors.border.subtle,
        borderWidth: 1,
        borderRadius: radii.xl,
        padding: spacing.lg,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text variant="caption" tone="muted">{label}</Text>
      </View>
      <Text variant="h2" weight="700" tone={positive ? 'success' : 'primary'} style={{ marginTop: 4 }}>
        {value}
      </Text>
    </View>
  );
}

function RewardsBanner() {
  const { t } = useTranslation();
  const { colors, radii, spacing } = useTheme();
  return (
    <LinearGradient
      colors={[colors.brand.accent, colors.brand.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: radii.xl, padding: spacing.lg, overflow: 'hidden' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.rewardIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          <Sparkle size={22} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="h3" tone="onBrand">{t('home.rewards_title')}</Text>
          <Text variant="caption" tone="onBrand" style={{ opacity: 0.75 }}>
            {t('home.rewards_desc')}
          </Text>
        </View>
        <Text variant="h2" tone="onBrand">+107 700</Text>
      </View>
    </LinearGradient>
  );
}

function PromotionBanner() {
  const { t } = useTranslation();
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable>
      <LinearGradient
        colors={['#1F2A44', '#0B2A4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.xl, padding: spacing.lg, overflow: 'hidden' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <View style={[styles.premiumPill, { borderColor: colors.brand.gold }]}>
              <Text variant="micro" style={{ color: colors.brand.gold, letterSpacing: 1.2 }}>PREMIUM</Text>
            </View>
            <Text variant="h2" tone="onBrand" style={{ marginTop: 10 }}>
              {t('home.promotion_title')}
            </Text>
            <Text variant="caption" tone="onBrand" style={{ opacity: 0.7, marginTop: 4 }}>
              {t('home.promotion_desc')}
            </Text>
          </View>
          <View style={[styles.goldOrb, { backgroundColor: colors.brand.gold }]}>
            <TrendUp size={26} color="#1F2A44" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4,
  },
  quickRow: { flexDirection: 'row', gap: 12 },
  insightsRow: { flexDirection: 'row', gap: 12 },
  sep: { height: StyleSheet.hairlineWidth },
  rewardIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  premiumPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1,
  },
  goldOrb: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
});
