import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onFulfilled?: (v: string) => void;
  error?: boolean;
};

export function OTPInput({ length = 6, value, onChange, onFulfilled, error }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (value.length === length) onFulfilled?.(value);
  }, [value, length, onFulfilled]);

  const handle = (txt: string) => {
    const digits = txt.replace(/\D/g, '').slice(0, length);
    onChange(digits);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.wrap}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        {Array.from({ length }).map((_, i) => {
          const char = value[i] ?? '';
          const isActive = focused && i === value.length;
          const borderColor = error
            ? colors.status.danger
            : isActive
              ? colors.brand.accent
              : char
                ? colors.brand.primary
                : colors.border.subtle;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  borderRadius: radii.lg,
                  borderColor,
                  backgroundColor: colors.bg.surface,
                },
              ]}
            >
              <Text variant="h1" weight="700">
                {char}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handle}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        style={styles.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    width: 48,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
});
