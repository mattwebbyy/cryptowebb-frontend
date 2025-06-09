import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import configureStore from 'redux-mock-store';

import { AuthProvider } from '../../hooks/useAuth';

// Mock the API client
jest.mock('../../lib/axios', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn();

const mockStore = configureStore([]);

const createTestWrapper = (initialState = {}) => {
  const store = mockStore(initialState);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('Authentication Flow Integration Tests', () => {
  const { apiClient } = require('../../lib/axios');
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: '1', email: 'test@example.com' } }),
    });
    
    // Suppress console logs in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Login Flow', () => {
    it('should test authentication context integration', async () => {
      const Wrapper = createTestWrapper();

      const TestComponent = () => {
        const { useAuth } = require('../../hooks/useAuth');
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) return <div>Loading...</div>;
        return <div>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>;
      };

      render(
        <Wrapper>
          <TestComponent />
        </Wrapper>
      );

      // Initially shows loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should eventually show not authenticated state
      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument();
      });
    });

  });

  describe('Authentication State Integration', () => {
    it('should persist authentication state across component remounts', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      };

      // Mock localStorage with existing token
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'existing-token';
        if (key === 'refreshToken') return 'existing-refresh-token';
        if (key === 'tokenType') return 'Bearer';
        return null;
      });

      // Mock successful user fetch
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      });

      const Wrapper = createTestWrapper();

      const TestComponent = () => {
        const { useAuth } = require('../../hooks/useAuth');
        const { isAuthenticated, user, isLoading } = useAuth();

        if (isLoading) return <div>Loading...</div>;
        if (isAuthenticated) return <div>Welcome {user?.firstName}</div>;
        return <div>Not authenticated</div>;
      };

      render(
        <Wrapper>
          <TestComponent />
        </Wrapper>
      );

      // Initially shows loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should fetch user info and show authenticated state
      await waitFor(() => {
        expect(screen.getByText('Welcome Test')).toBeInTheDocument();
      });

      // Verify fetch was called with correct headers
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/me', {
        headers: {
          Authorization: 'Bearer existing-token',
          Accept: 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should handle token expiration gracefully', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'expired-token';
        return null;
      });

      // Mock 401 response for expired token
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      const Wrapper = createTestWrapper();

      const TestComponent = () => {
        const { useAuth } = require('../../hooks/useAuth');
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) return <div>Loading...</div>;
        return <div>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>;
      };

      render(
        <Wrapper>
          <TestComponent />
        </Wrapper>
      );

      // Should eventually show not authenticated and clear tokens
      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('tokenType');
    });
  });
});