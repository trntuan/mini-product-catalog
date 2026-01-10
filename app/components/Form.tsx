import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { spacing, typeSizes } from '../theme/theme';
import { useTheme } from '../theme/useTheme';

const Input = ({style, error, ...rest}: any) => {
  const {theme} = useTheme();
  return (
    <View style={styles.inputWrp}>
      <TextInput
        {...rest}
        style={[
          styles.input,
          {color: theme.color, borderColor: theme.layoutBg},
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
    height: 45,
    borderColor: '#000000',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: spacing.borderRadius,
  },
  error: {
    fontSize: typeSizes.FONT_SIZE_SMALL,
  },
});
