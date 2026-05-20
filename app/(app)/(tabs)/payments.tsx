import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { InputField } from '@/components/forms/InputField';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Search, ChatBubble, Globe, Receipt, Sparkle, TrendUp, Wallet } from '@/components/icons';
import { mockPaymentServices } from '@/services/api/mock';
import { PaymentService } from '@/types/domain';
import { useTheme } from '@/theme/ThemeProvider';

const CATEGORIES: Array<{ id: PaymentService['category']; iconKey: string }> = [
  { id: 'mobile', iconKey: 'mobile' },
  { id: 'internet', iconKey: 'internet' },
  { id: 'utilities', iconKey: 'utilities' },
  { id: 'taxes', iconKey: 'taxes' },
  { id: 'tv', iconKey: 'tv' },
  { id: 'transport', iconKey: 'transport' },
];

const ICONS: Record<PaymentService['category'], React.ReactNode> = {
  mobile: <ChatBubble size={22} color="#fff" />,
  internet: <Globe size={22} color="#fff" />,
  utilities: <Receipt size={22} color="#fff" />,
  taxes: <TrendUp size={22} color="#fff" />,
  tv: <Sparkle size={22} color="#fff" />,
  transport: <Wallet size={22} color="#fff" />,
};

export default function PaymentsTab() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PaymentService['category']>('mobile');

  const filtered = useMemo(() => {
    const list = mockPaymentServices.filter((s) => s.category === activeCategory);
    if (!query) return list;
    return list.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeCategory, query]);

  return (
    <ScreenContainer surface="base">
      <ScrollView
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing['4xl'],
          paddingHorizontal: spacing.xl,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1">{t('payments.title')}</Text>

        <InputField
          value={query}
          onChangeText={setQuery}
          placeholder={t('payments.search_placeholder')}
          leftIcon={<Search size={20} color={colors.text.muted} />}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 16 }}
        >
          {CATEGORIES.map((c) => {
            const active = c.id === activeCategory;
            return (
              <Pressable
                key={c.id}
                onPress={() => setActiveCategory(c.id)}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: 10,
                  borderRadius: radii.pill,
                  backgroundColor: active ? colors.brand.primary : colors.bg.surface,
                  borderColor: active ? colors.brand.primary : colors.border.subtle,
                  borderWidth: 1,
                }}
              >
                <Text variant="bodySm" weight="600" style={{ color: active ? '#fff' : colors.text.primary }}>
                  {t(`payments.categories.${c.id}`)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Animated.View key={activeCategory} entering={FadeInDown.duration(280)}>
          <GlassCard padded={false}>
            <View style={{ padding: spacing.lg, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              {filtered.map((s) => (
                <ServiceTile
                  key={s.id}
                  service={s}
                  onPress={() =>
                    router.push({ pathname: '/(app)/payment-detail', params: { id: s.id } })
                  }
                />
              ))}
              {filtered.length === 0 ? (
                <View style={{ width: '100%', padding: 24, alignItems: 'center' }}>
                  <Text variant="bodySm" tone="muted">No services found</Text>
                </View>
              ) : null}
            </View>
          </GlassCard>
        </Animated.View>

        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          <Text variant="h3">{t('payments.popular')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {mockPaymentServices.slice(0, 6).map((s) => (
              <PopularChip key={s.id} service={s} onPress={() => router.push({ pathname: '/(app)/payment-detail', params: { id: s.id } })} />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ServiceTile({ service, onPress }: { service: PaymentService; onPress?: () => void }) {
  const { radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: '30%',
        alignItems: 'center',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <LinearGradient
        colors={[service.colorFrom, service.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: radii.xl,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {ICONS[service.category]}
      </LinearGradient>
      <Text variant="caption" weight="600" align="center" numberOfLines={1}>{service.name}</Text>
    </Pressable>
  );
}

function PopularChip({ service, onPress }: { service: PaymentService; onPress?: () => void }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        backgroundColor: colors.bg.surface,
        borderColor: colors.border.subtle,
        borderWidth: 1,
        borderRadius: radii.pill,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <LinearGradient
        colors={[service.colorFrom, service.colorTo]}
        style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text variant="micro" tone="onBrand" weight="700">{service.icon}</Text>
      </LinearGradient>
      <Text variant="bodySm" weight="600">{service.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
