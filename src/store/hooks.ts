// src/store/hooks.ts
import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { setSpeed, setDensity, setGlitchIntensity, setTheme } from './slices/matrixSlice';
import type { MatrixState } from './slices/matrixSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useMatrixSettings = () => {
  const matrixState = useAppSelector((state) => state.matrix);
  const dispatch = useAppDispatch();

  const updateSpeed = (speed: number) => dispatch(setSpeed(speed));
  const updateDensity = (density: number) => dispatch(setDensity(density));
  const updateGlitchIntensity = (intensity: number) => dispatch(setGlitchIntensity(intensity));
  const updateTheme = (theme: Partial<MatrixState['theme']>) => dispatch(setTheme(theme));

  return {
    ...matrixState,
    updateSpeed,
    updateDensity,
    updateGlitchIntensity,
    updateTheme,
  };
};
