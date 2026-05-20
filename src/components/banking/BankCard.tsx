import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/types/domain';
import { useTheme } from '@/theme/ThemeProvider';
import { Snowflake } from '@/components/icons';
import { palette } from '@/theme/colors';

type Props = {
  card: Card;
  onPress?: () => void;
  width?: number;
  height?: number;
  showBalance?: boolean;
};

const GRADIENTS: Record<Card['style'], [string, string, string]> = {
  navy:      [palette.navy600, palette.navy500, palette.navy700],
  midnight:  ['#1F2A44', '#0E1B2C', '#06101C'],
  emerald:   ['#0F7C5E', palette.cyan600, '#053D2D'],
  platinum:  ['#3F4F62', '#5A6A7A', '#1F2A44'],
  gold:      ['#D4AF37', '#A9882A', '#5F4D11'],
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BankCard({ card, onPress, width = 320, height = 200, showBalance = true }: Props) {
  const { radii } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const gradient = GRADIENTS[card.style];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 220 });
      }}
      style={[{ width, height, borderRadius: radii['2xl'] }, animatedStyle]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radii['2xl'],
            padding: 22,
            justifyContent: 'space-between',
            overflow: 'hidden',
          },
        ]}
      >
        <View
          style={[
            styles.glow,
            { backgroundColor: gradient[2], opacity: 0.5 },
          ]}
        />
        <View style={styles.row}>
          <View>
            <Text variant="micro" tone="onBrand" style={{ opacity: 0.7 }}>
              {card.brand.toUpperCase()}
            </Text>
            <Text variant="h3" tone="onBrand" style={{ marginTop: 2 }}>
              {showBalance
                ? new Intl.NumberFormat('ru-RU').format(card.balance) + (card.currency === 'UZS' ? ' so‘m' : ` ${card.currency}`)
                : '••• ••• •••'}
            </Text>
          </View>
          {card.frozen ? (
            <View style={styles.badge}>
              <Snowflake size={14} color="#fff" />
              <Text variant="caption" tone="onBrand">Frozen</Text>
            </View>
          ) : (
            <Text variant="micro" tone="onBrand" style={{ opacity: 0.7 }}>
              {card.brand === 'visa' ? 'VISA' : card.brand === 'mastercard' ? 'MC' : card.brand === 'humo' ? 'HUMO' : 'UZCARD'}
            </Text>
          )}
        </View>

        <View>
          <Text variant="h2" tone="onBrand" style={{ letterSpacing: 4, opacity: 0.92 }}>
            {card.numberMasked}
          </Text>
          <View style={[styles.row, { marginTop: 14 }]}>
            <View>
              <Text variant="micro" tone="onBrand" style={{ opacity: 0.55 }}>
                Holder
              </Text>
              <Text variant="bodySm" tone="onBrand" weight="500">
                {card.holder}
              </Text>
            </View>
            <View>
              <Text variant="micro" tone="onBrand" style={{ opacity: 0.55 }}>
                Valid thru
              </Text>
              <Text variant="bodySm" tone="onBrand" weight="500">
                {card.expiry}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 280,
    top: -140,
    right: -120,
  },
});
