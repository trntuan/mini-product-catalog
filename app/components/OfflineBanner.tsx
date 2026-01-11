import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { CONTENT_KEYS } from '../types/content';
import Text from './Text';

interface OfflineBannerProps {
  message?: string;
}

export default function OfflineBanner({
  message = CONTENT_KEYS.MESSAGES.VIEWING_OFFLINE_DATA,
}: OfflineBannerProps) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.primary,
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
