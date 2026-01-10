import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import Text from './Text';

interface OfflineBannerProps {
  message?: string;
}

export default function OfflineBanner({
  message = "You're viewing offline data",
}: OfflineBannerProps) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: '#FF9900',
        },
      ]}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
