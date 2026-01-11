/**
 * Custom hook for managing image carousel state
 */

import { useCallback, useState } from 'react';

export function useImageCarousel(imageWidth: number) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / imageWidth);
    setCurrentImageIndex(index);
  }, [imageWidth]);

  return {
    currentImageIndex,
    handleImageScroll,
  };
}
