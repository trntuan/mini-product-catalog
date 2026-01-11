import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../theme';
import { CONTENT_KEYS } from '@/constants/content';
import Text from '../ui/Text';

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
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});
