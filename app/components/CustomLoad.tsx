import { Colors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface CustomLoadProps {
  isLoading: boolean;
  bg?: string;
  opacity?: number;
}

const CustomLoad: React.FC<CustomLoadProps> = ({ 
  isLoading, 
  bg = "#dfe6e9", 
  opacity = 0.6 
}) => {
  if (!isLoading) return null;

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: bg,
          opacity: opacity,
        },
      ]}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
    </View>
  );
};

export default CustomLoad;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
