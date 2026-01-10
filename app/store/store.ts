import { reduxStorage } from '@/app/store/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
// Slices

import favoritesSlice from './favoritesSlice';
import productsSlice from './productsSlice';
import userSlice from './userSlice';
import { STORAGE_KEYS } from '../types/constants';

const rootReducer = combineReducers({
  user: userSlice,
  products: productsSlice,
  favorites: favoritesSlice,
});

const persistConfig = {
  key: STORAGE_KEYS.REDUX_ROOT,
  storage: reduxStorage,
  blacklist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({immutableCheck: false, serializableCheck: false}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
