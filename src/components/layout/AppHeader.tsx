import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';
import { ChevronLeft } from '@/components/icons';

type Props = {
  title?: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showBack?: boolean;
  transparent?: boolean;
};

export function AppHeader({ title, subtitle, left, right, showBack = true, transparent = false }: Props) {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();

  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          backgroundColor: transparent ? 'transparent' : colors.bg.base,
        },
      ]}
    >
      <View style={styles.side}>
        {left ?? (showBack && canGoBack ? (
          <Pressable
            hitSlop={12}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: colors.bg.surface,
                borderColor: colors.border.subtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ChevronLeft size={20} color={colors.text.primary} />
          </Pressable>
        ) : null)}
      </View>

      <View style={styles.center}>
        {title ? <Text variant="h3" align="center" numberOfLines={1}>{title}</Text> : null}
        {subtitle ? (
          <Text variant="caption" tone="muted" align="center" numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center' },
  side: { width: 80, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
