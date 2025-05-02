// src/store/hooks.test.tsx
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { renderHook, act } from '@testing-library/react';
import { useMatrixSettings } from './hooks';
import { setSpeed, setDensity, setGlitchIntensity, setTheme } from './slices/matrixSlice';
import type { RootState } from './store'; // Use your RootState type

// Configure the mock store
const mockStore = configureStore<RootState>([]); // Provide RootState type argument

describe('useMatrixSettings Hook', () => {
  let store: ReturnType<typeof mockStore>;
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
    // Add other slices initial states here if needed for RootState
  };

  beforeEach(() => {
    // Create a new store instance for each test
    store = mockStore(initialState);
    // Mock dispatch directly on the store instance if needed (optional)
    store.dispatch = jest.fn();
  });

  // Wrapper component providing the mock Redux store
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should select initial state from the store', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });

    expect(result.current.speed).toBe(initialState.matrix.speed);
    expect(result.current.density).toBe(initialState.matrix.density);
    expect(result.current.glitchIntensity).toBe(initialState.matrix.glitchIntensity);
    expect(result.current.theme).toEqual(initialState.matrix.theme);
  });

  it('should dispatch setSpeed action when updateSpeed is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });
    const newSpeed = 75;

    act(() => {
      result.current.updateSpeed(newSpeed);
    });

    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(setSpeed(newSpeed));
  });

  it('should dispatch setDensity action when updateDensity is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });
    const newDensity = 0.8;

    act(() => {
      result.current.updateDensity(newDensity);
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(setDensity(newDensity));
  });

  it('should dispatch setGlitchIntensity action when updateGlitchIntensity is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });
    const newIntensity = 0.5;

    act(() => {
      result.current.updateGlitchIntensity(newIntensity);
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(setGlitchIntensity(newIntensity));
  });

  it('should dispatch setTheme action when updateTheme is called', () => {
    const { result } = renderHook(() => useMatrixSettings(), { wrapper });
    const newTheme = { primaryColor: '#ffffff' };

    act(() => {
      result.current.updateTheme(newTheme);
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(setTheme(newTheme));
  });
});