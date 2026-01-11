import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CustomLoadProps {
  isLoading: boolean;
  bg?: string;
  opacity?: number;
}

const CustomLoad: React.FC<CustomLoadProps> = ({
  isLoading,
  bg,
  opacity = 0.6,
}) => {
  const {theme} = useTheme();
  if (!isLoading) return null;

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: bg ?? theme.layoutBg,
          opacity: opacity,
        },
      ]}>
      <ActivityIndicator size="large" color={theme.primary} />
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
