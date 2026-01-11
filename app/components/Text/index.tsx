import * as React from 'react';
import { Text as RNText, StyleProp, StyleSheet, TextStyle } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { typeVariants } from '../../theme/theme';

type TextVariantTypes = typeof typeVariants;

export type TextProps = {
  variant?: keyof TextVariantTypes;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
};

const Text = ({
  variant = 'bodyMedium',
  children,
  style,
  numberOfLines,
  ellipsizeMode,
}: TextProps) => {
  const {theme} = useTheme();

  // Check if "variant" is valid
  // If yes, add required styles to Text Component
  let variantStyles = {};
  if (variant in typeVariants) {
    variantStyles = typeVariants[variant];
  }

  let flattenedStyle = StyleSheet.flatten([
    variantStyles,
    {color: theme.color},
    style,
  ]);

  return (
    <RNText
      style={flattenedStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}>
      {children}
    </RNText>
  );
};

export default Text;
