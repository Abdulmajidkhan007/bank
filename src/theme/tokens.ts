import { palette } from './colors';

export type ColorTokens = {
  bg: {
    base: string;
    surface: string;
    elevated: string;
    inverse: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onBrand: string;
    onAccent: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
  brand: {
    primary: string;
    primaryAlt: string;
    accent: string;
    accentSoft: string;
    gold: string;
  };
  status: {
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    info: string;
    infoSoft: string;
  };
  card: {
    gradientFrom: string;
    gradientTo: string;
    gradientAccent: string;
  };
};

export const lightTokens: ColorTokens = {
  bg: {
    base: palette.slate50,
    surface: palette.white,
    elevated: palette.white,
    inverse: palette.navy800,
    overlay: 'rgba(11, 27, 43, 0.45)',
  },
  text: {
    primary: palette.slate900,
    secondary: palette.slate600,
    muted: palette.slate500,
    onBrand: palette.white,
    onAccent: palette.navy800,
  },
  border: {
    subtle: palette.slate200,
    strong: palette.slate300,
  },
  brand: {
    primary: palette.navy600,
    primaryAlt: palette.navy500,
    accent: palette.cyan500,
    accentSoft: palette.cyan200,
    gold: palette.gold500,
  },
  status: {
    success: palette.success,
    successSoft: palette.successSoft,
    warning: palette.warning,
    warningSoft: palette.warningSoft,
    danger: palette.danger,
    dangerSoft: palette.dangerSoft,
    info: palette.info,
    infoSoft: palette.infoSoft,
  },
  card: {
    gradientFrom: palette.navy600,
    gradientTo: palette.navy500,
    gradientAccent: palette.cyan500,
  },
};

export const darkTokens: ColorTokens = {
  bg: {
    base: palette.navy900,
    surface: palette.navy700,
    elevated: palette.navy400,
    inverse: palette.white,
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    primary: '#E8EEF6',
    secondary: palette.slate400,
    muted: '#6C7E93',
    onBrand: palette.white,
    onAccent: palette.navy900,
  },
  border: {
    subtle: palette.navy300,
    strong: palette.navy200,
  },
  brand: {
    primary: palette.navy500,
    primaryAlt: palette.navy600,
    accent: palette.cyan400,
    accentSoft: palette.cyan600,
    gold: palette.gold400,
  },
  status: {
    success: palette.success,
    successSoft: 'rgba(22, 163, 123, 0.15)',
    warning: palette.warning,
    warningSoft: 'rgba(224, 168, 0, 0.15)',
    danger: palette.danger,
    dangerSoft: 'rgba(224, 78, 78, 0.18)',
    info: palette.info,
    infoSoft: 'rgba(45, 129, 247, 0.15)',
  },
  card: {
    gradientFrom: palette.navy500,
    gradientTo: palette.navy600,
    gradientAccent: palette.cyan400,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
  '6xl': 72,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#0B1B2B',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardElevated: {
    shadowColor: '#0B1B2B',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  floating: {
    shadowColor: '#0B1B2B',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
} as const;

export const motion = {
  duration: { xs: 120, sm: 200, md: 320, lg: 500 },
  easing: [0.22, 1, 0.36, 1] as const,
} as const;

export const typography = {
  displayXl: { fontSize: 40, lineHeight: 48, fontWeight: '700' as const, letterSpacing: -0.5 },
  displayLg: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -0.4 },
  h1: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.2 },
  h2: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  h3: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const, letterSpacing: 0.4 },
  balance: { fontSize: 36, lineHeight: 44, fontWeight: '700' as const, letterSpacing: -0.6 },
} as const;

export type TypographyVariant = keyof typeof typography;
