import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { colors, spacing, typeSizes } from '../../theme';

const Input = ({style, error, ...rest}: any) => {
  const {theme} = useTheme();
  return (
    <View style={styles.inputWrp}>
      <TextInput
        {...rest}
        style={[
          styles.input,
          {color: theme.color, borderColor: theme.cardBorderColor},
          {...style},
        ]}
      />
      {error ? (
        <Text
          testID={rest.testID + '-error'}
          style={[styles.error, {color: theme.error}]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export { Input };

const styles = StyleSheet.create({
  inputWrp: {
    marginBottom: spacing.cardMarginB,
  },
  input: {
    height: 48,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  error: {
    fontSize: typeSizes.FONT_SIZE_SMALL,
    marginTop: 4,
    marginLeft: 4,
  },
});
