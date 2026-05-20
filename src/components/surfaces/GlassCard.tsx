import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'flat' | 'card' | 'high';
  padded?: boolean;
};

export function GlassCard({ children, style, elevation = 'card', padded = true }: Props) {
  const { colors, radii, shadows, spacing } = useTheme();

  const shadowStyle =
    elevation === 'flat' ? undefined : elevation === 'high' ? shadows.cardElevated : shadows.card;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.bg.surface,
          borderRadius: radii.xl,
          borderColor: colors.border.subtle,
          padding: padded ? spacing.xl : 0,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
