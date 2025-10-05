// src/components/auth/LoginForm.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';

const loginMock = vi.fn();
const fetchMock = vi.fn();
const originalFetch = global.fetch;

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    logout: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

const renderLoginForm = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
    </MemoryRouter>
  );

beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
  fetchMock.mockReset();
  loginMock.mockReset();
  loginMock.mockResolvedValue(undefined);
});

describe('<LoginForm />', () => {
  it('renders the email/password inputs and action buttons', () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /access system/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('submits credentials and calls the auth login helper on success', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'token',
      refreshToken: 'refresh',
      type: 'Bearer',
      user: { id: '1', email: 'test@example.com' },
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    renderLoginForm();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /access system/i }));

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('shows an error message when the login request fails', async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    } as Response);

    renderLoginForm();

    await user.type(screen.getByPlaceholderText(/email/i), 'wrong@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /access system/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});
