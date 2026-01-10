import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface LayoutPropsType {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

export interface CardPropsType {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface MenuItemPropsType {
  label?: string;
  onPress?: () => void;
  rightItem?: ReactNode;
}