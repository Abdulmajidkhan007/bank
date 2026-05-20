import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export function QuickAction({ label, icon, onPress }: Props) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: colors.bg.surface,
          borderColor: colors.border.subtle,
          borderRadius: radii.xl,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.sm,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.brand.accentSoft,
            borderRadius: radii.lg,
          },
        ]}
      >
        {icon}
      </View>
      <Text variant="bodySm" weight="600" align="center" style={{ marginTop: 8 }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
