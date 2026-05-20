import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';
import { Backspace, Fingerprint } from '@/components/icons';

type Props = {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onBiometric?: () => void;
  showBiometric?: boolean;
  error?: boolean;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'] as const;

export function PINInput({ length = 6, value, onChange, onBiometric, showBiometric = false, error }: Props) {
  const { colors, spacing } = useTheme();
  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  React.useEffect(() => {
    if (error) {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [error, shake]);

  const press = (key: string) => {
    void Haptics.selectionAsync();
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (key === 'bio') {
      onBiometric?.();
    } else if (value.length < length) {
      onChange(value + key);
    }
  };

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Animated.View style={[styles.dotsRow, { marginBottom: spacing['4xl'] }, shakeStyle]}>
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: filled
                    ? error ? colors.status.danger : colors.brand.accent
                    : 'transparent',
                  borderColor: error
                    ? colors.status.danger
                    : filled
                      ? colors.brand.accent
                      : colors.border.strong,
                },
              ]}
            />
          );
        })}
      </Animated.View>

      <View style={styles.pad}>
        {KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => press(key)}
            style={({ pressed }) => [
              styles.key,
              {
                backgroundColor: pressed ? colors.bg.surface : 'transparent',
              },
            ]}
            disabled={key === 'bio' && !showBiometric}
          >
            {key === 'del' ? (
              <Backspace color={colors.text.primary} size={24} />
            ) : key === 'bio' ? (
              showBiometric ? <Fingerprint color={colors.brand.accent} size={28} /> : null
            ) : (
              <Text variant="displayLg" weight="500">
                {key}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: { flexDirection: 'row', gap: 16 },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  key: {
    width: '32%',
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
});
