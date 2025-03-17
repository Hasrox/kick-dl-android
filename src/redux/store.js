import { configureStore } from '@reduxjs/toolkit';
import clipsReducer from './clipsSlice';
import downloadsReducer from './downloadsSlice';

export const store = configureStore({
  reducer: {
    clips: clipsReducer,
    downloads: downloadsReducer,
  },
});