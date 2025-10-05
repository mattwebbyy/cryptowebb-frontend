import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as React from 'react';
import { AuthResponse } from '../types/types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  lastLogin?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  }, []);

  const fetchUserInfo = useCallback(
    async (token: string) => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('User info fetched successfully:', data.user);
      } catch (error) {
        console.error('Error fetching user info:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  const login = useCallback(
    async (authData: AuthResponse) => {
      try {
        console.log('Logging in with auth data:', authData);

        // Store tokens
        localStorage.setItem('token', authData.token);
        localStorage.setItem('refreshToken', authData.refreshToken);
        localStorage.setItem('tokenType', authData.type);

        // Set user data
        setUser(authData.user);
        setIsAuthenticated(true);

        console.log('Login successful:', {
          user: authData.user,
          isAuthenticated: true,
          tokensStored: true,
        });
      } catch (error) {
        console.error('Error during login:', error);
        logout();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Found existing token, fetching user info...');
      fetchUserInfo(token);
    } else {
      console.log('No token found, setting loading to false');
      setIsLoading(false);
    }
  }, [fetchUserInfo]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
