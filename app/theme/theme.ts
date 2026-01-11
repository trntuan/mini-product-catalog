// Types
interface spacingType {
  borderRadius: number;
  layoutPaddingH: number;
  containerPaddingV: number;
  cardMarginB: number;
}

interface typeSizesType {
  FONT_SIZE_SMALL: number;
  FONT_SIZE_MEDIUM: number;
  FONT_SIZE_LARGE: number;
  FONT_WEIGHT_LIGHT: number;
  FONT_WEIGHT_MEDIUM: number;
  FONT_WEIGHT_HEAVY: number;
}

export interface themeType {
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


// Spacing:- Common margins and paddings (Amazon-style)
const spacing: spacingType = {
  borderRadius: 8,
  layoutPaddingH: 16,
  containerPaddingV: 22,
  cardMarginB: 12,
};

// Type Sizes:- Font sizes and weights (Amazon-style)
const typeSizes: typeSizesType = {
  FONT_SIZE_LARGE: 18,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_SMALL: 12,
  FONT_WEIGHT_LIGHT: 300,
  FONT_WEIGHT_MEDIUM: 500,
  FONT_WEIGHT_HEAVY: 700,
};

const typeVariants = {
  titleLarge: {
    fontFamily: 'Poppins-Bold',
    fontSize: typeSizes.FONT_SIZE_LARGE,
  },
  titleSmall: {
    fontFamily: 'Poppins-Bold',
    fontSize: typeSizes.FONT_SIZE_SMALL,
  },
  bodyMedium: {
    fontFamily: 'Poppins-Regular',
    fontSize: typeSizes.FONT_SIZE_MEDIUM,
  },
  bodySmall: {
    fontFamily: 'Poppins-Regular',
    fontSize: typeSizes.FONT_SIZE_SMALL,
  },
};

// Theme:- Amazon-inspired color palette
const theme: themeType = {
  name: 'light',
  color: '#131921', // Amazon dark text
  primary: '#FF9900', // Amazon orange
  primarySoft: '#FFF2D9', // Soft orange wash
  layoutBg: '#F6F3ED', // Warm light background
  cardBg: '#FFFFFF',
  cardBorderColor: '#E6E0D6', // Subtle warm border
  accent: '#007185', // Amazon blue accent
  accentSoft: '#E3F2F4', // Soft blue wash
  textMuted: '#5C6772',
  error: '#C40000', // Amazon red
};

export {spacing, typeSizes, typeVariants, theme};
