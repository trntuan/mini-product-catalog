import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { MenuItemPropsType } from '../types/components';

import Text from './Text';

const MenuItem = ({
  label = 'Menu Item',
  onPress,
  rightItem,
}: MenuItemPropsType) => {
  const {theme} = useTheme();
  const isLogout = label === 'Logout';
  return (
    <Pressable
      style={({pressed}) => [
        styles.menuItem,
        {borderTopColor: theme.cardBorderColor},
        pressed && styles.pressedItem,
      ]}
      onPress={onPress}>
      <View>
        <Text style={isLogout ? {color: theme.error} : {color: theme.color}}>
          {label}
        </Text>
      </View>
      <View>{rightItem}</View>
    </Pressable>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    paddingVertical: 8,
  },
  pressedItem: {
    opacity: 0.6,
  },
});
