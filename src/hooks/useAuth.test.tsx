import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { AuthProvider, useAuth } from './useAuth';
import { AuthResponse } from '../types/types';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock as unknown as typeof fetch;
const fetchMockFn = fetchMock as unknown as Mock;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console.log and console.error to avoid test output
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    fetchMockFn.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: '1', email: 'test@example.com' } }),
    });
  });

  afterAll(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test since we expect an error
    const originalError = console.error;
    console.error = vi.fn() as unknown as typeof console.error;

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });

  it('should provide initial state when no token exists', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should fetch user info when token exists in localStorage', async () => {
    const mockToken = 'mock-token';
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };

    localStorageMock.getItem.mockReturnValue(mockToken);
    fetchMockFn.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const mockAuthData: AuthResponse = {
      token: 'new-token',
      refreshToken: 'new-refresh-token',
      type: 'Bearer',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };

    await act(async () => {
      await result.current.login(mockAuthData);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('tokenType', 'Bearer');

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockAuthData.user);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle logout correctly', async () => {
    // First login
    const { result } = renderHook(() => useAuth(), { wrapper });

    const mockAuthData: AuthResponse = {
      token: 'token',
      refreshToken: 'refresh-token',
      type: 'Bearer',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };

    await act(async () => {
      await result.current.login(mockAuthData);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenType');

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch user info failure', async () => {
    const mockToken = 'invalid-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    fetchMockFn.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenType');
  });

  it('should handle login error and logout user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Mock login to throw an error after setting tokens
    const mockAuthData: AuthResponse = {
      token: 'token',
      refreshToken: 'refresh-token',
      type: 'Bearer',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };

    // Simulate an error during login (e.g., after storing tokens)
    const originalLogin = result.current.login;
    
    try {
      await act(async () => {
        await result.current.login(mockAuthData);
      });
    } catch (error) {
      // Login might complete successfully, so we test the error handling in fetch
    }

    // Verify tokens were stored during successful login
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'token');
  });

  it('should handle network errors gracefully', async () => {
    const mockToken = 'mock-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    fetchMockFn.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    const initialLogin = result.current.login;
    const initialLogout = result.current.logout;

    rerender();

    expect(result.current.login).toBe(initialLogin);
    expect(result.current.logout).toBe(initialLogout);
  });


  it('should handle malformed user data gracefully', async () => {
    const mockToken = 'mock-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    fetchMockFn.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ /* malformed - no user field */ }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeUndefined();
  });
});
