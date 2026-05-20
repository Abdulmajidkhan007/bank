export const palette = {
  navy900: '#06101C',
  navy800: '#0B1B2B',
  navy700: '#0E1B2C',
  navy600: '#0B2A4A',
  navy500: '#10355C',
  navy400: '#15263B',
  navy300: '#1B2C42',
  navy200: '#2A3F5C',

  cyan600: '#008C7A',
  cyan500: '#00BFA6',
  cyan400: '#3DD5BD',
  cyan300: '#7CE3D2',
  cyan200: '#B8F0E6',

  gold500: '#D4AF37',
  gold400: '#E5C66B',

  slate900: '#0B1B2B',
  slate700: '#3F4F62',
  slate600: '#5A6A7A',
  slate500: '#8D9AA8',
  slate400: '#9BAABD',
  slate300: '#C7D2E0',
  slate200: '#E5EAF1',
  slate100: '#F0F3F8',
  slate50:  '#F6F8FB',

  white: '#FFFFFF',
  black: '#000000',

  success: '#16A37B',
  successSoft: '#E1F5EE',
  warning: '#E0A800',
  warningSoft: '#FDF3D6',
  danger: '#E04E4E',
  dangerSoft: '#FCE5E5',
  info: '#2D81F7',
  infoSoft: '#E1ECFD',
} as const;

export type Palette = typeof palette;
