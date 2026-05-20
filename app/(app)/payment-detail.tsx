import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { InputField } from '@/components/forms/InputField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Check } from '@/components/icons';
import { mockPaymentServices } from '@/services/api/mock';
import { useCardsStore } from '@/store/cards.store';
import { useTxStore } from '@/store/transactions.store';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/utils/format';
import { Transaction } from '@/types/domain';

export default function PaymentDetailScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const service = useMemo(() => mockPaymentServices.find((s) => s.id === id), [id]);

  const cards = useCardsStore((s) => s.cards);
  const sourceCard = cards[0];
  const addTx = useTxStore((s) => s.add);
  const showToast = useUIStore((s) => s.showToast);

  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const amountNum = parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
  const valid = account.length >= 4 && amountNum > 0 && sourceCard && amountNum <= sourceCard.balance;

  if (!service) {
    return (
      <ScreenContainer surface="base">
        <AppHeader />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text tone="muted">Service not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  const submit = async () => {
    if (!valid || !sourceCard) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const tx: Transaction = {
      id: `t_${Date.now()}`,
      cardId: sourceCard.id,
      title: service.name,
      subtitle: `${t('payments.title')} • ${account}`,
      amount: amountNum,
      currency: sourceCard.currency,
      direction: 'out',
      status: 'success',
      category:
        service.category === 'mobile' ? 'mobile'
        : service.category === 'utilities' ? 'utilities'
        : service.category === 'internet' ? 'utilities'
        : 'other',
      createdAt: new Date().toISOString(),
    };
    addTx(tx);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      showToast({ message: 'Payment completed', variant: 'success' });
      router.back();
    }, 1200);
  };

  if (done) {
    return (
      <ScreenContainer surface="base" padded>
        <Animated.View entering={FadeInUp.springify().damping(14)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={[styles.orb, { backgroundColor: colors.status.success }]}>
            <Check size={48} color="#fff" />
          </View>
          <Text variant="displayLg" align="center" style={{ marginTop: 24 }}>Payment sent</Text>
          <Text variant="h1" align="center" style={{ marginTop: 16 }}>
            {sourceCard ? formatMoney(amountNum, sourceCard.currency) : '—'}
          </Text>
          <Text variant="bodySm" tone="muted" align="center" style={{ marginTop: 4 }}>{service.name}</Text>
        </Animated.View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer surface="base">
      <AppHeader title={service.name} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing['4xl'],
            gap: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[service.colorFrom, service.colorTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radii.xl, padding: spacing.xl, alignItems: 'center', gap: 8 }}
          >
            <View style={[styles.brandOrb, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text variant="h1" tone="onBrand" weight="700">{service.icon}</Text>
            </View>
            <Text variant="h2" tone="onBrand">{service.name}</Text>
            <Text variant="caption" tone="onBrand" style={{ opacity: 0.7 }}>
              {t(`payments.categories.${service.category}`)}
            </Text>
          </LinearGradient>

          <InputField
            label={service.category === 'mobile' ? 'Phone number' : 'Account number'}
            placeholder={service.category === 'mobile' ? '+998 __ ___-__-__' : '0000 0000 0000 0000'}
            value={account}
            onChangeText={setAccount}
            keyboardType={service.category === 'mobile' ? 'phone-pad' : 'number-pad'}
          />

          <InputField
            label={t('common.amount')}
            placeholder={t('transfers.amount_hint')}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            hint={t('transfers.fee_free')}
          />

          <PrimaryButton
            label="Pay now"
            onPress={submit}
            loading={submitting}
            disabled={!valid}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  orb: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  brandOrb: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
