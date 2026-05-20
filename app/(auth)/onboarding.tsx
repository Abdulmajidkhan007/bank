import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useTheme } from '@/theme/ThemeProvider';
import { palette } from '@/theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 's1',
    titleKey: 'onboarding.slide1_title',
    descKey: 'onboarding.slide1_desc',
    gradient: [palette.navy600, palette.navy500] as const,
    accent: palette.cyan400,
    art: 'wallet',
  },
  {
    id: 's2',
    titleKey: 'onboarding.slide2_title',
    descKey: 'onboarding.slide2_desc',
    gradient: ['#0F7C5E', palette.cyan600] as const,
    accent: palette.cyan300,
    art: 'pay',
  },
  {
    id: 's3',
    titleKey: 'onboarding.slide3_title',
    descKey: 'onboarding.slide3_desc',
    gradient: ['#1F2A44', palette.navy500] as const,
    accent: palette.gold500,
    art: 'shield',
  },
] as const;

export default function Onboarding() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const handleMomentum = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      router.replace('/(auth)/phone');
    }
  };

  return (
    <ScreenContainer surface="base">
      <View style={[styles.skipRow, { paddingTop: 8 }]}>
        <Pressable hitSlop={10} onPress={() => router.replace('/(auth)/phone')}>
          <Text variant="bodySm" weight="600" tone="muted">
            {t('common.skip')}
          </Text>
        </Pressable>
      </View>

      <Animated.FlatList
        ref={listRef as never}
        data={SLIDES as unknown as Array<(typeof SLIDES)[number]>}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        onMomentumScrollEnd={handleMomentum}
        scrollEventThrottle={16}
        renderItem={({ item, index: i }) => <Slide item={item} i={i} scrollX={scrollX} />}
      />

      <View style={[styles.bottom, { paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <Dot key={i} i={i} scrollX={scrollX} color={colors.brand.primary} />
          ))}
        </View>
        <PrimaryButton
          label={index === SLIDES.length - 1 ? t('onboarding.get_started') : t('common.next')}
          onPress={handleNext}
        />
      </View>
    </ScreenContainer>
  );
}

function Slide({ item, i, scrollX }: { item: (typeof SLIDES)[number]; i: number; scrollX: Animated.SharedValue<number> }) {
  const { t } = useTranslation();
  const { radii, spacing } = useTheme();

  const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
  const aStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92], Extrapolation.CLAMP);
    const op = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);
    return { transform: [{ scale }], opacity: op };
  });

  return (
    <View style={{ width, paddingHorizontal: spacing.xl, paddingTop: spacing['2xl'] }}>
      <Animated.View
        style={[
          aStyle,
          {
            aspectRatio: 1,
            borderRadius: radii['2xl'],
            overflow: 'hidden',
            marginBottom: spacing['3xl'],
          },
        ]}
      >
        <LinearGradient colors={[item.gradient[0], item.gradient[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill}>
          <View style={styles.artWrap}>
            <Art kind={item.art} color={item.accent} />
          </View>
        </LinearGradient>
      </Animated.View>
      <Text variant="displayLg" align="center" style={{ marginBottom: spacing.md }}>
        {t(item.titleKey)}
      </Text>
      <Text variant="bodyLg" tone="secondary" align="center">
        {t(item.descKey)}
      </Text>
    </View>
  );
}

function Dot({ i, scrollX, color }: { i: number; scrollX: Animated.SharedValue<number>; color: string }) {
  const aStyle = useAnimatedStyle(() => {
    const w = interpolate(scrollX.value, [(i - 1) * width, i * width, (i + 1) * width], [8, 28, 8], Extrapolation.CLAMP);
    const op = interpolate(scrollX.value, [(i - 1) * width, i * width, (i + 1) * width], [0.3, 1, 0.3], Extrapolation.CLAMP);
    return { width: w, opacity: op };
  });
  return <Animated.View style={[styles.dot, { backgroundColor: color }, aStyle]} />;
}

function Art({ kind, color }: { kind: 'wallet' | 'pay' | 'shield'; color: string }) {
  if (kind === 'wallet') {
    return (
      <Svg width="60%" height="60%" viewBox="0 0 200 200" fill="none">
        <Rect x="20" y="40" width="160" height="110" rx="20" fill="rgba(255,255,255,0.12)" />
        <Rect x="35" y="60" width="130" height="80" rx="14" fill="rgba(255,255,255,0.22)" />
        <Rect x="35" y="70" width="50" height="8" rx="4" fill="#fff" opacity={0.85} />
        <Rect x="35" y="86" width="90" height="8" rx="4" fill={color} />
        <Circle cx="148" cy="118" r="14" fill={color} />
      </Svg>
    );
  }
  if (kind === 'pay') {
    return (
      <Svg width="60%" height="60%" viewBox="0 0 200 200" fill="none">
        <Circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.10)" />
        <Path d="M60 100 L92 132 L140 70" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <G opacity={0.6}>
          <Circle cx="60" cy="50" r="4" fill={color} />
          <Circle cx="150" cy="150" r="5" fill={color} />
          <Circle cx="160" cy="60" r="3" fill="#fff" />
        </G>
      </Svg>
    );
  }
  return (
    <Svg width="60%" height="60%" viewBox="0 0 200 200" fill="none">
      <Path
        d="M100 20 L160 45 V100 C160 145 130 175 100 185 C70 175 40 145 40 100 V45 L100 20 Z"
        fill="rgba(255,255,255,0.18)"
      />
      <Path
        d="M100 35 L148 55 V100 C148 138 124 162 100 170 C76 162 52 138 52 100 V55 L100 35 Z"
        stroke="#fff"
        strokeWidth={3}
      />
      <Path d="M76 100 L94 118 L128 84" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  skipRow: { paddingHorizontal: 24, alignItems: 'flex-end' },
  bottom: { gap: 24 },
  dotsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { height: 8, borderRadius: 4 },
  artWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
