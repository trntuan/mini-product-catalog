import * as React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export type ButtonProps = {
  onPress: () => void;
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Button = ({onPress, text, children, style}: ButtonProps) => {
  const {theme} = useTheme();
  return (
    <Pressable
      style={({pressed}) => [
        styles.container,
        {backgroundColor: pressed ? `${theme.primary}ee` : theme.primary},
        style,
      ]}
      onPress={onPress}>
      {children ? children : <></>}
      {text ? <Text style={styles.text}>{text}</Text> : <></>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
