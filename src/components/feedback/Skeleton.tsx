import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width = '100%', height = 14, radius = 8, style }: Props) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 850, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
      -1,
      true,
    );
  }, [opacity]);

  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as ViewStyle['width'],
          height,
          borderRadius: radius,
          backgroundColor: colors.border.subtle,
        },
        aStyle,
        style,
      ]}
    />
  );
}

export function SkeletonRow() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
      <Skeleton width={44} height={44} radius={14} style={{ marginRight: 12 }} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={10} />
      </View>
      <Skeleton width={80} height={14} />
    </View>
  );
}
