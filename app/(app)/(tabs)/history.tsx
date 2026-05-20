import React, { useMemo } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { InputField } from '@/components/forms/InputField';
import { TransactionRow } from '@/components/banking/TransactionRow';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Search, ArrowDownLeft, ArrowUpRight } from '@/components/icons';
import { useTxStore } from '@/store/transactions.store';
import { useTheme } from '@/theme/ThemeProvider';
import { Transaction } from '@/types/domain';
import { formatRelativeDate } from '@/utils/format';
import { useSettingsStore } from '@/store/settings.store';

export default function HistoryTab() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const items = useTxStore((s) => s.items);
  const filter = useTxStore((s) => s.filter);
  const setQuery = useTxStore((s) => s.setQuery);
  const setDirection = useTxStore((s) => s.setDirection);
  const lang = useSettingsStore((s) => s.language);

  const sections = useMemo(() => {
    const filtered = items.filter((tx) => {
      if (filter.direction !== 'all' && tx.direction !== filter.direction) return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        if (!tx.title.toLowerCase().includes(q) && !(tx.subtitle?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    const groups = new Map<string, Transaction[]>();
    filtered.forEach((tx) => {
      const key = tx.createdAt.slice(0, 10);
      const arr = groups.get(key) ?? [];
      arr.push(tx);
      groups.set(key, arr);
    });
    return Array.from(groups.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([date, data]) => ({ title: formatRelativeDate(`${date}T12:00:00.000Z`, lang), data }));
  }, [items, filter, lang]);

  const filters: Array<{ id: 'all' | 'in' | 'out'; label: string; icon?: React.ReactNode }> = [
    { id: 'all', label: t('history.filter_all') },
    { id: 'in',  label: t('history.filter_in'),  icon: <ArrowDownLeft size={14} color={colors.status.success} /> },
    { id: 'out', label: t('history.filter_out'), icon: <ArrowUpRight size={14} color={colors.status.danger} /> },
  ];

  return (
    <ScreenContainer surface="base">
      <View style={{ paddingTop: spacing.lg, paddingHorizontal: spacing.xl, gap: spacing.lg }}>
        <Text variant="h1">{t('history.title')}</Text>
        <InputField
          value={filter.query}
          onChangeText={setQuery}
          placeholder={t('history.search_placeholder')}
          leftIcon={<Search size={20} color={colors.text.muted} />}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((f) => {
            const active = filter.direction === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setDirection(f.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: 8,
                  borderRadius: radii.pill,
                  backgroundColor: active ? colors.brand.primary : colors.bg.surface,
                  borderColor: active ? colors.brand.primary : colors.border.subtle,
                  borderWidth: 1,
                }}
              >
                {f.icon ?? null}
                <Text variant="bodySm" weight="600" style={{ color: active ? '#fff' : colors.text.primary }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing['4xl'],
          gap: spacing.md,
        }}
        ListEmptyComponent={
          <GlassCard>
            <Text align="center" tone="muted">{t('history.empty')}</Text>
          </GlassCard>
        }
        renderSectionHeader={({ section }) => (
          <Text variant="caption" tone="muted" weight="600" style={{ marginTop: spacing.md, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {section.title}
          </Text>
        )}
        renderItem={({ item, index, section }) => (
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderColor: colors.border.subtle,
              borderTopWidth: index === 0 ? 1 : 0,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopLeftRadius: index === 0 ? 18 : 0,
              borderTopRightRadius: index === 0 ? 18 : 0,
              borderBottomLeftRadius: index === section.data.length - 1 ? 18 : 0,
              borderBottomRightRadius: index === section.data.length - 1 ? 18 : 0,
              paddingHorizontal: spacing.lg,
            }}
          >
            <TransactionRow
              tx={item}
              compact
              onPress={() => router.push({ pathname: '/(app)/transaction-detail', params: { id: item.id } })}
            />
            {index !== section.data.length - 1 ? (
              <View style={[styles.sep, { backgroundColor: colors.border.subtle, marginLeft: spacing['4xl'] + spacing.sm }]} />
            ) : null}
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sep: { height: StyleSheet.hairlineWidth },
});
