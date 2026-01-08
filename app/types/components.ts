import {ViewStyle, StyleProp} from 'react-native';
import {ReactNode} from 'react';

export interface LayoutPropsType {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

export interface CardPropsType {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
