import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  fullWidth = true,
  icon,
  iconRight,
}: Props) {
  const { colors, radii, spacing } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const palette = (() => {
    switch (variant) {
      case 'primary':
        return { bg: colors.brand.primary, fg: colors.text.onBrand, border: 'transparent' };
      case 'secondary':
        return { bg: colors.bg.surface, fg: colors.text.primary, border: colors.border.subtle };
      case 'danger':
        return { bg: colors.status.danger, fg: colors.text.onBrand, border: 'transparent' };
      case 'ghost':
      default:
        return { bg: 'transparent', fg: colors.brand.accent, border: 'transparent' };
    }
  })();

  return (
    <AnimatedPressable
      onPress={() => {
        if (disabled || loading) return;
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.97, { mass: 0.5, damping: 14, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { mass: 0.5, damping: 14, stiffness: 200 });
      }}
      disabled={disabled || loading}
      style={[
        styles.btn,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: radii.lg,
          paddingHorizontal: spacing.xl,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
          <Text variant="bodyLg" weight="600" style={{ color: palette.fg }}>
            {label}
          </Text>
          {iconRight ? <View style={{ marginLeft: spacing.sm }}>{iconRight}</View> : null}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
