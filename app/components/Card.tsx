import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/theme';
import { CardPropsType } from '../types/components';

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
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.layoutPaddingH,
    paddingVertical: spacing.layoutPaddingH,
    borderRadius: spacing.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

// IntrinsicAttributes
