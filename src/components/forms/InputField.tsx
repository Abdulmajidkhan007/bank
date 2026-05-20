import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
};

export function InputField({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.status.danger : focused ? colors.brand.accent : colors.border.subtle;

  return (
    <View>
      {label ? (
        <Text variant="caption" tone="secondary" style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.bg.surface,
            borderColor,
            borderRadius: radii.lg,
            paddingHorizontal: spacing.lg,
            minHeight: 56,
          },
        ]}
      >
        {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.text.muted}
          style={[
            styles.input,
            typography.bodyLg,
            { color: colors.text.primary },
            style,
          ]}
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={8} style={{ marginLeft: spacing.sm }}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted" style={{ marginTop: spacing.xs }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
