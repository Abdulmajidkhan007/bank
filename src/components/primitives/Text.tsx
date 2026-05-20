import React from 'react';
import { StyleProp, Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { TypographyVariant } from '@/theme/tokens';

type Tone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'onBrand'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'accent';

type Props = TextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

export function Text({
  variant = 'body',
  tone = 'primary',
  align,
  weight,
  style,
  children,
  ...rest
}: Props) {
  const { colors, typography } = useTheme();
  const t = typography[variant];

  const color =
    tone === 'primary' ? colors.text.primary
    : tone === 'secondary' ? colors.text.secondary
    : tone === 'muted' ? colors.text.muted
    : tone === 'onBrand' ? colors.text.onBrand
    : tone === 'success' ? colors.status.success
    : tone === 'danger' ? colors.status.danger
    : tone === 'warning' ? colors.status.warning
    : tone === 'info' ? colors.status.info
    : colors.brand.accent;

  return (
    <RNText
      {...rest}
      allowFontScaling
      style={[t, { color, textAlign: align, fontWeight: weight ?? t.fontWeight }, style]}
    >
      {children}
    </RNText>
  );
}
