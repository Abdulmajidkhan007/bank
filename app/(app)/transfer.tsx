import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/primitives/Text';
import { InputField } from '@/components/forms/InputField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { GlassCard } from '@/components/surfaces/GlassCard';
import { Card, Phone, QrCode, Send, Check } from '@/components/icons';
import { useCardsStore } from '@/store/cards.store';
import { useTxStore } from '@/store/transactions.store';
import { mockRecipients } from '@/services/api/mock';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';
import { formatMoney } from '@/utils/format';
import { Transaction } from '@/types/domain';

type Method = 'card' | 'phone' | 'qr' | 'bank';

export default function TransferModal() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cards = useCardsStore((s) => s.cards);
  const selectedId = useCardsStore((s) => s.selectedId);
  const addTx = useTxStore((s) => s.add);
  const showToast = useUIStore((s) => s.showToast);

  const [method, setMethod] = useState<Method>('card');
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const sourceCard = useMemo(() => cards.find((c) => c.id === selectedId) ?? cards[0], [cards, selectedId]);
  const amountNum = parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
  const valid = target.length > 4 && amountNum > 0 && amountNum <= (sourceCard?.balance ?? 0);

  const methods: Array<{ id: Method; label: string; icon: React.ReactNode }> = [
    { id: 'card',  label: t('transfers.to_card'),  icon: <Card size={20} color={colors.brand.primary} /> },
    { id: 'phone', label: t('transfers.to_phone'), icon: <Phone size={20} color={colors.brand.primary} /> },
    { id: 'qr',    label: t('transfers.via_qr'),   icon: <QrCode size={20} color={colors.brand.primary} /> },
    { id: 'bank',  label: t('transfers.to_bank'),  icon: <Send size={20} color={colors.brand.primary} /> },
  ];

  const submit = async () => {
    if (!sourceCard || !valid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const tx: Transaction = {
      id: `t_${Date.now()}`,
      cardId: sourceCard.id,
      title: method === 'phone' ? `Transfer to ${target}` : `Transfer • ${target.slice(-4)}`,
      subtitle: t('transfers.title'),
      amount: amountNum,
      currency: sourceCard.currency,
      direction: 'out',
      status: 'success',
      category: 'transfer',
      createdAt: new Date().toISOString(),
    };
    addTx(tx);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      showToast({ message: t('transfers.success_title'), variant: 'success' });
      router.back();
    }, 1400);
  };

  if (success) {
    return (
      <ScreenContainer surface="base" padded>
        <Animated.View entering={FadeInUp.springify().damping(14)} style={styles.successWrap}>
          <View style={[styles.successOrb, { backgroundColor: colors.status.success }]}>
            <Check size={48} color="#fff" />
          </View>
          <Text variant="displayLg" align="center" style={{ marginTop: 24 }}>{t('transfers.success_title')}</Text>
          <Text variant="bodyLg" tone="secondary" align="center" style={{ marginTop: 8 }}>{t('transfers.success_desc')}</Text>
          <Text variant="h1" align="center" style={{ marginTop: 28 }}>
            {sourceCard ? formatMoney(amountNum, sourceCard.currency) : '—'}
          </Text>
        </Animated.View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer surface="base">
      <AppHeader title={t('transfers.title')} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing['4xl'],
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {methods.map((m) => {
              const active = m.id === method;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMethod(m.id)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 14,
                      borderRadius: radii.lg,
                      backgroundColor: active ? colors.brand.accentSoft : colors.bg.surface,
                      borderColor: active ? colors.brand.accent : colors.border.subtle,
                      borderWidth: 1,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  {m.icon}
                  <Text variant="caption" weight="600" style={{ marginTop: 6 }} numberOfLines={1}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {sourceCard ? (
            <GlassCard padded>
              <Text variant="caption" tone="muted">{t('common.from')}</Text>
              <View style={styles.fromRow}>
                <LinearGradient
                  colors={[colors.brand.primary, colors.brand.primaryAlt]}
                  style={{ width: 40, height: 28, borderRadius: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLg" weight="600">{sourceCard.brand.toUpperCase()} •• {sourceCard.lastFour}</Text>
                  <Text variant="caption" tone="muted">{formatMoney(sourceCard.balance, sourceCard.currency)}</Text>
                </View>
              </View>
            </GlassCard>
          ) : null}

          <InputField
            label={method === 'phone' ? t('transfers.recipient_name') : t('transfers.card_number')}
            placeholder={method === 'phone' ? '+998 __ ___-__-__' : '0000 0000 0000 0000'}
            keyboardType={method === 'phone' ? 'phone-pad' : 'number-pad'}
            value={target}
            onChangeText={setTarget}
            leftIcon={method === 'phone' ? <Phone size={20} color={colors.text.muted} /> : <Card size={20} color={colors.text.muted} />}
          />

          <InputField
            label={t('common.amount')}
            placeholder={t('transfers.amount_hint')}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            hint={t('transfers.fee_free')}
          />

          <View style={{ gap: spacing.sm }}>
            <Text variant="caption" tone="muted" weight="600" style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {t('transfers.recipients')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {mockRecipients.map((r, i) => (
                <Animated.View key={r.id} entering={FadeInDown.delay(i * 40).duration(280)}>
                  <Pressable
                    onPress={() => {
                      setTarget(r.phone ?? '');
                    }}
                    style={{ alignItems: 'center', width: 72 }}
                  >
                    <View style={[styles.recipAvatar, { backgroundColor: r.avatarColor }]}>
                      <Text variant="bodyLg" weight="700" tone="onBrand">{r.initials}</Text>
                    </View>
                    <Text variant="caption" weight="600" align="center" numberOfLines={1} style={{ marginTop: 6 }}>{r.name}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          </View>

          <PrimaryButton
            label={t('transfers.send')}
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
  fromRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  recipAvatar: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successOrb: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
});
