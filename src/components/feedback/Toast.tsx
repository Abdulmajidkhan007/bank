import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/primitives/Text';
import { Check, Close } from '@/components/icons';
import { useUIStore } from '@/store/ui.store';
import { useTheme } from '@/theme/ThemeProvider';

export function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);
  const { colors, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((toast) => {
        const palette =
          toast.variant === 'success' ? { bg: colors.status.success, fg: '#fff' }
          : toast.variant === 'error' ? { bg: colors.status.danger, fg: '#fff' }
          : { bg: colors.brand.primary, fg: '#fff' };
        return (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.springify().damping(18)}
            exiting={FadeOutUp.duration(180)}
            layout={LinearTransition.springify()}
            style={[
              styles.toast,
              {
                backgroundColor: palette.bg,
                borderRadius: radii.lg,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              },
            ]}
          >
            <View style={styles.iconWrap}>
              {toast.variant === 'success' ? (
                <Check size={18} color={palette.fg} />
              ) : (
                <Close size={18} color={palette.fg} />
              )}
            </View>
            <Text variant="bodySm" weight="600" style={{ color: palette.fg, flex: 1 }}>
              {toast.message}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
