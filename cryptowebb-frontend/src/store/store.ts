// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import matrixReducer from './slices/matrixSlice';

export const store = configureStore({
  reducer: {
    matrix: matrixReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;