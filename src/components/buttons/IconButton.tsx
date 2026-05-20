import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  surface?: 'surface' | 'elevated' | 'soft' | 'transparent';
  style?: ViewStyle;
};

export function IconButton({ children, onPress, size = 44, surface = 'surface', style }: Props) {
  const { colors, radii } = useTheme();
  const bg =
    surface === 'transparent' ? 'transparent'
    : surface === 'elevated' ? colors.bg.elevated
    : surface === 'soft' ? colors.bg.base
    : colors.bg.surface;

  return (
    <Pressable
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: radii.lg,
          backgroundColor: bg,
          borderColor: colors.border.subtle,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
