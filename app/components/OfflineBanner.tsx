import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from './Text';
import {useTheme} from '../theme/useTheme';

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
          backgroundColor: theme.warning || '#FFA500',
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
