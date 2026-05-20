import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/icons';
import { Text } from '@/components/primitives/Text';
import { palette } from '@/theme/colors';

export default function Splash() {
  const { t } = useTranslation();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(120, withSpring(1, { damping: 14, stiffness: 140 }));
    opacity.value = withDelay(220, withSpring(1));
  }, [scale, opacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={[palette.navy600, palette.navy500, palette.navy900]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.center}>
        <Animated.View style={logoStyle}>
          <Logo size={96} color="#fff" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(420).springify().damping(18)}>
          <Text variant="h1" tone="onBrand" style={{ marginTop: 28, letterSpacing: -0.2 }}>
            UzCard Bank
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(600).duration(400)}>
          <Text variant="bodySm" tone="onBrand" style={{ opacity: 0.7, marginTop: 6 }}>
            {t('splash.tagline')}
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
