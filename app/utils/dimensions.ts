/**
 * Screen Dimensions Utility
 * Provides utilities for working with screen dimensions
 */

import { Dimensions } from 'react-native';

/**
 * Get screen width
 */
export const getScreenWidth = (): number => {
  return Dimensions.get('window').width;
};

/**
 * Get screen height
 */
export const getScreenHeight = (): number => {
  return Dimensions.get('window').height;
};

/**
 * Calculate image width with horizontal padding
 * @param horizontalPadding - Total horizontal padding (default: 32)
 * @returns Image width
 */
export const getImageWidth = (horizontalPadding: number = 32): number => {
  return getScreenWidth() - horizontalPadding;
};

/**
 * Get screen dimensions object
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};
