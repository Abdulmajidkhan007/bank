import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Clock, Home, QrCode, User } from '@/components/icons';
import { Text } from '@/components/primitives/Text';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  home: Home,
  cards: Card,
  payments: QrCode,
  history: Clock,
  profile: User,
};

export default function TabsLayout() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.surface,
          borderTopColor: colors.border.subtle,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View
          style={[
            styles.bar,
            {
              backgroundColor: colors.bg.surface,
              borderTopColor: colors.border.subtle,
              paddingBottom: insets.bottom + 6,
              paddingTop: 10,
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const Icon = ICONS[route.name] ?? Home;
            const label = t(`tabs.${route.name}`);
            const isCenter = route.name === 'payments';

            const onPress = () => {
              void Haptics.selectionAsync();
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            if (isCenter) {
              return (
                <Pressable key={route.key} onPress={onPress} style={styles.centerWrap}>
                  <View
                    style={[
                      styles.centerBtn,
                      {
                        backgroundColor: colors.brand.primary,
                        borderColor: colors.bg.surface,
                      },
                    ]}
                  >
                    <Icon size={24} color="#fff" />
                  </View>
                </Pressable>
              );
            }

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.item}>
                <Icon size={22} color={isFocused ? colors.brand.primary : colors.text.muted} />
                <Text
                  variant="micro"
                  style={{
                    marginTop: 4,
                    color: isFocused ? colors.brand.primary : colors.text.muted,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cards" />
      <Tabs.Screen name="payments" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginTop: -22,
    shadowColor: '#0B1B2B',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
