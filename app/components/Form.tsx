import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typeSizes } from '../theme/theme';

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
    height: 48,
    borderColor: '#D5D9D9',
    borderWidth: 1,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  error: {
    fontSize: typeSizes.FONT_SIZE_SMALL,
    marginTop: 4,
    marginLeft: 4,
  },
});
