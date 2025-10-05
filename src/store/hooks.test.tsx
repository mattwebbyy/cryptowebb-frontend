import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import matrixReducer, {
  setSpeed,
  setDensity,
  setGlitchIntensity,
  setTheme,
} from './slices/matrixSlice';
import { useMatrixSettings } from './hooks';
import type { RootState } from './store';

describe('useMatrixSettings', () => {
  let store: ReturnType<typeof configureStore>;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  const initialState: RootState = {
    matrix: {
      speed: 50,
      density: 1,
      glitchIntensity: 1,
      theme: {
        primaryColor: '#33ff33',
        backgroundColor: '#000000',
      },
    },
  };

  beforeEach(() => {
    store = configureStore({
      reducer: { matrix: matrixReducer },
      preloadedState: initialState,
    });
    dispatchSpy = vi.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    dispatchSpy.mockRestore();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('selects the current matrix state', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    expect(result.current.speed).toBe(initialState.matrix.speed);
    expect(result.current.density).toBe(initialState.matrix.density);
    expect(result.current.glitchIntensity).toBe(initialState.matrix.glitchIntensity);
    expect(result.current.theme).toEqual(initialState.matrix.theme);
  });

  it('dispatches setSpeed when updateSpeed is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    act(() => {
      result.current.updateSpeed(75);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(setSpeed(75));
  });

  it('dispatches setDensity when updateDensity is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    act(() => {
      result.current.updateDensity(0.8);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(setDensity(0.8));
  });

  it('dispatches setGlitchIntensity when updateGlitchIntensity is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    act(() => {
      result.current.updateGlitchIntensity(0.5);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(setGlitchIntensity(0.5));
  });

  it('dispatches setTheme when updateTheme is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    const newTheme = { primaryColor: '#ffffff' };

    act(() => {
      result.current.updateTheme(newTheme);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(setTheme(newTheme));
  });
});
