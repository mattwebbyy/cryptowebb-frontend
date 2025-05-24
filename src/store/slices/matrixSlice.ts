// src/store/slices/matrixSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MatrixState {
  speed: number;
  density: number;
  glitchIntensity: number;
  theme: {
    primaryColor: string;
    backgroundColor: string;
  };
}

const initialState: MatrixState = {
  speed: 50,
  density: 1,
  glitchIntensity: 1,
  theme: {
    primaryColor: '#33ff33',
    backgroundColor: '#000000',
  },
};

const matrixSlice = createSlice({
  name: 'matrix',
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setDensity: (state, action: PayloadAction<number>) => {
      state.density = action.payload;
    },
    setGlitchIntensity: (state, action: PayloadAction<number>) => {
      state.glitchIntensity = action.payload;
    },
    setTheme: (state, action: PayloadAction<Partial<MatrixState['theme']>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
  },
});

export const { setSpeed, setDensity, setGlitchIntensity, setTheme } = matrixSlice.actions;

export default matrixSlice.reducer;
