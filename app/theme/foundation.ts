// Theme Tokens

export interface SpacingType {
  borderRadius: number;
  layoutPaddingH: number;
  containerPaddingV: number;
  cardMarginB: number;
}

export interface TypeSizesType {
  FONT_SIZE_SMALL: number;
  FONT_SIZE_MEDIUM: number;
  FONT_SIZE_LARGE: number;
  FONT_WEIGHT_LIGHT: number;
  FONT_WEIGHT_MEDIUM: number;
  FONT_WEIGHT_HEAVY: number;
}

export interface ThemeType {
  name: string;
  color: string;
  primary: string;
  primarySoft: string;
  layoutBg: string;
  cardBg: string;
  cardBorderColor: string;
  accent: string;
  accentSoft: string;
  textMuted: string;
  error: string;
}

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  borderLight: '#E0E0E0',
  borderMuted: '#D5D9D9',
  borderMid: '#CCCCCC',
  surfaceMuted: '#F0F0F0',
  googleBlue: '#4285F4',
  heartActive: '#FF6B6B',
} as const;

export const radii = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

// Spacing:- Common margins and paddings (inspired style)
export const spacing: SpacingType = {
  borderRadius: 8,
  layoutPaddingH: 16,
  containerPaddingV: 22,
  cardMarginB: 12,
};

// Type Sizes:- Font sizes and weights (inspired style)
export const typeSizes: TypeSizesType = {
  FONT_SIZE_LARGE: 18,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_SMALL: 12,
  FONT_WEIGHT_LIGHT: 300,
  FONT_WEIGHT_MEDIUM: 500,
  FONT_WEIGHT_HEAVY: 700,
};

// Theme:- inspired color palette
export const theme: ThemeType = {
  name: 'light',
  color: '#131921', // text
  primary: '#FF9900', //  orange
  primarySoft: '#FFF2D9', // Soft orange wash
  layoutBg: '#F6F3ED', // light background
  cardBg: colors.white,
  cardBorderColor: '#E6E0D6', // border
  accent: '#007185', //  blue accent
  accentSoft: '#E3F2F4', // Soft blue wash
  textMuted: '#5C6772',
  error: '#C40000', // red
};
