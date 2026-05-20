import React from 'react';
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  surface?: 'base' | 'surface' | 'elevated' | 'inverse';
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenContainer({
  children,
  edges = ['top'],
  surface = 'base',
  padded = false,
  style,
}: Props) {
  const { colors, scheme, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const bg =
    surface === 'inverse' ? colors.bg.inverse
    : surface === 'surface' ? colors.bg.surface
    : surface === 'elevated' ? colors.bg.elevated
    : colors.bg.base;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={surface === 'inverse' || scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView
        edges={edges}
        style={[
          styles.flex,
          padded && { paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg },
          style,
        ]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
});
