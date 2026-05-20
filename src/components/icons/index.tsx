import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaults = { size: 22, color: '#0B1B2B', strokeWidth: 1.8 };

function Base({ size = defaults.size, children }: { size?: number; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );
}

export const ChevronLeft = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M15 6L9 12L15 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const ChevronRight = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M9 6L15 12L9 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const ChevronDown = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const Eye = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path
      d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Base>
);

export const EyeOff = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path
      d="M3 3L21 21M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4M6.9 6.9C4.2 8.4 2.5 11 2 12C2.5 13.1 5.5 18.5 12 18.5C14 18.5 15.7 18 17.1 17.1M21.5 12C21 11 18 5.5 12 5.5C11 5.5 10.1 5.6 9.3 5.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Base>
);

export const Bell = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path
      d="M6 8C6 4.7 8.7 2 12 2C15.3 2 18 4.7 18 8V11.6C18 12.5 18.3 13.4 19 14L20 15H4L5 14C5.7 13.4 6 12.5 6 11.6V8Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Send = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M3 11L21 3L13 21L11 13L3 11Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const Plus = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const QrCode = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M14 14H17M20 14V17M14 17V20M17 20H20M20 20V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Card = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Rect x="2.5" y="5" width="19" height="14" rx="3" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M2.5 9.5H21.5" stroke={color} strokeWidth={strokeWidth} />
  </Base>
);

export const Home = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M3 11L12 3L21 11V20C21 20.6 20.6 21 20 21H15V14H9V21H4C3.4 21 3 20.6 3 20V11Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const Clock = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 7V12L15 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const User = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M4 21C4 16.5 7.5 13 12 13C16.5 13 20 16.5 20 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Lock = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Rect x="4" y="11" width="16" height="10" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke={color} strokeWidth={strokeWidth} />
  </Base>
);

export const Shield = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M12 2L4 5V11C4 15.5 7 19.5 12 22C17 19.5 20 15.5 20 11V5L12 2Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const Search = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M21 21L16 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Filter = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M3 5H21L14 13V20L10 18V13L3 5Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const Snowflake = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <Path d="M12 2V22" />
      <Path d="M4.5 6L19.5 18" />
      <Path d="M19.5 6L4.5 18" />
      <Path d="M2 12H22" />
    </G>
  </Base>
);

export const ArrowUpRight = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M7 17L17 7M17 7H8M17 7V16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const ArrowDownLeft = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M17 7L7 17M7 17H16M7 17V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const Settings = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M19.4 15C19.3 15.3 19.3 15.6 19.4 15.9L21 17.3L19.1 20.6L17.2 19.9C17 20.1 16.7 20.2 16.5 20.3L16.2 22.4H12.4L12.1 20.3C11.9 20.2 11.6 20.1 11.4 19.9L9.5 20.6L7.6 17.3L9.2 15.9C9.3 15.6 9.3 15.3 9.2 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Base>
);

export const FaceId = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M4 7V5C4 4.4 4.4 4 5 4H7M17 4H19C19.6 4 20 4.4 20 5V7M4 17V19C4 19.6 4.4 20 5 20H7M17 20H19C19.6 20 20 19.6 20 19V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M9 9V11M15 9V11M12 9V13L11 14M9 16C10 17 11 17.5 12 17.5C13 17.5 14 17 15 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Fingerprint = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M5 12C5 8 8 5 12 5C14 5 16 5.7 17.5 7M19 12C19 13.7 18.6 15.3 17.9 16.7M12 9C13.7 9 15 10.3 15 12V14M12 13V18M9 12V13C9 16.3 10 19 11 21M6 17C5.4 16 5 14.5 5 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Logo = ({ size = 40, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path
      d="M20 3L33 9V21C33 28.5 27.3 33.5 20 37C12.7 33.5 7 28.5 7 21V9L20 3Z"
      fill={color}
      opacity={0.12}
    />
    <Path
      d="M20 6L30 10.5V20.5C30 26 26 30 20 33C14 30 10 26 10 20.5V10.5L20 6Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M14 18L18 22L26 14"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Sparkle = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M12 3L13.5 9.5L20 11L13.5 12.5L12 19L10.5 12.5L4 11L10.5 9.5L12 3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const Receipt = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M5 3H19V21L16 19L13 21L10 19L7 21L5 19V3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Path d="M9 8H15M9 12H15M9 16H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Check = ({ size, color = defaults.color, strokeWidth = 2.2 }: IconProps) => (
  <Base size={size}>
    <Path d="M5 12L10 17L19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const Close = ({ size, color = defaults.color, strokeWidth = 2 }: IconProps) => (
  <Base size={size}>
    <Path d="M6 6L18 18M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);

export const Phone = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M5 4H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L20 15V19C20 19.5 19.5 20 19 20C11 20 4 13 4 5C4 4.5 4.5 4 5 4Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const ChatBubble = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M21 12C21 16.4 16.97 20 12 20C10.62 20 9.32 19.74 8.16 19.27L3 20.5L4.4 16.06C3.51 14.85 3 13.46 3 12C3 7.6 7.03 4 12 4C16.97 4 21 7.6 21 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Base>
);

export const Globe = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M3 12H21M12 3C14.5 6 14.5 18 12 21C9.5 18 9.5 6 12 3Z" stroke={color} strokeWidth={strokeWidth} />
  </Base>
);

export const Wallet = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M3 7C3 5.9 3.9 5 5 5H17V8H20C20.6 8 21 8.4 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Circle cx="17" cy="14" r="1.4" fill={color} />
  </Base>
);

export const TrendUp = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M3 17L9 11L13 15L21 7M21 7H15M21 7V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const Backspace = ({ size, color = defaults.color, strokeWidth = 1.8 }: IconProps) => (
  <Base size={size}>
    <Path d="M9 5L3 12L9 19H21V5H9Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Path d="M13 9L17 15M17 9L13 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Base>
);
