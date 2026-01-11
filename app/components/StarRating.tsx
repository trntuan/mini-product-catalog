/**
 * Custom hook for rendering star ratings
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function useStarRating() {
  const {theme} = useTheme();
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={18}
            color={theme.primary}
            style={styles.star}
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={18}
            color={theme.primary}
            style={styles.star}
          />,
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={18}
            color={theme.cardBorderColor}
            style={styles.star}
          />,
        );
      }
    }
    return stars;
  };

  return { renderStars };
}

const styles = StyleSheet.create({
  star: {
    marginRight: 2,
  },
});
