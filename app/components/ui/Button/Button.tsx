import * as React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { useTheme } from '../../../hooks/useTheme';

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
        {
          backgroundColor: pressed ? `${theme.primary}e6` : theme.primary,
          shadowColor: theme.primary,
        },
        pressed && styles.pressed,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    transform: [{scale: 0.99}],
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
