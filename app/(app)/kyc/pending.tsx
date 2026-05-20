import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Check, Clock, Close, Shield } from '@/components/icons';
import { useKycStore } from '@/store/kyc.store';
import { useTheme } from '@/theme/ThemeProvider';

export default function KycPending() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const status = useKycStore((s) => s.status);
  const refreshStatus = useKycStore((s) => s.refreshStatus);
  const rejectionReason = useKycStore((s) => s.rejectionReason);

  const rotate = useSharedValue(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.linear }), -1, false);
    pollRef.current = setInterval(() => {
      void refreshStatus();
    }, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshStatus, rotate]);

  useEffect(() => {
    if (status === 'verified' || status === 'rejected') {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [status]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }],
  }));

  const palette =
    status === 'verified' ? { bg: colors.status.success, icon: Check, title: "You're verified", desc: 'Your account is now fully unlocked.' }
    : status === 'rejected' ? { bg: colors.status.danger, icon: Close, title: 'Verification failed', desc: rejectionReason ?? 'Please try again with clearer photos.' }
    : { bg: colors.brand.primary, icon: Shield, title: 'Reviewing your details', desc: 'This usually takes less than a minute.' };

  const Icon = palette.icon;

  return (
    <ScreenContainer surface="base">
      <View style={{ flex: 1, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
        <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center' }}>
          {status === 'submitted' ? (
            <Animated.View
              style={[
                {
                  width: 140, height: 140, borderRadius: 70,
                  borderWidth: 3, borderColor: colors.border.subtle,
                  borderTopColor: colors.brand.accent,
                  position: 'absolute',
                },
                ringStyle,
              ]}
            />
          ) : null}
          <Animated.View
            entering={FadeIn.duration(280)}
            style={{
              width: 96, height: 96, borderRadius: 48,
              backgroundColor: palette.bg,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {status === 'submitted' ? <Clock size={42} color="#fff" /> : <Icon size={42} color="#fff" />}
          </Animated.View>
        </View>

        <Text variant="displayLg" align="center">{palette.title}</Text>
        <Text variant="bodyLg" tone="secondary" align="center" style={{ paddingHorizontal: spacing.lg }}>
          {palette.desc}
        </Text>
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg, gap: spacing.sm }}>
        {status === 'verified' ? (
          <PrimaryButton label="Continue to app" onPress={() => router.replace('/(app)/(tabs)/home')} />
        ) : status === 'rejected' ? (
          <PrimaryButton label="Try again" onPress={() => router.replace('/(app)/kyc/passport')} />
        ) : (
          <PrimaryButton label="Continue in background" variant="secondary" onPress={() => router.replace('/(app)/(tabs)/home')} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
