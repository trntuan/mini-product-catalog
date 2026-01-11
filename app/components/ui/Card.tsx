import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { colors, spacing } from '../../theme';
import { CardPropsType } from '../../types/components';

const Card = ({children, style}: CardPropsType) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.card,
        {backgroundColor: theme.cardBg, borderColor: theme.cardBorderColor},
        style,
      ]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.layoutPaddingH,
    paddingVertical: spacing.layoutPaddingH,
    borderRadius: spacing.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

// IntrinsicAttributes
