import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FavoritesState = {
  favoriteIds: number[];
};

const initialState: FavoritesState = {
  favoriteIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const index = state.favoriteIds.indexOf(productId);
      if (index > -1) {
        // Remove from favorites
        state.favoriteIds.splice(index, 1);
      } else {
        // Add to favorites
        state.favoriteIds.push(productId);
      }
    },
    addFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (!state.favoriteIds.includes(productId)) {
        state.favoriteIds.push(productId);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const index = state.favoriteIds.indexOf(productId);
      if (index > -1) {
        state.favoriteIds.splice(index, 1);
      }
    },
    clearFavorites: state => {
      state.favoriteIds = [];
    },
  },
});

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
