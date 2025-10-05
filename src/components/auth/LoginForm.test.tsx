// src/components/auth/LoginForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Use userEvent for realistic interactions
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { LoginForm } from './LoginForm';

// Mock child components if they have complex logic or side effects
jest.mock('./GoogleLoginButton', () => ({
  GoogleLoginButton: ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled}>Mock Google Login</button>
  ),
}));

describe('<LoginForm />', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined); // Mock the submit handler
  const mockOnGoogleLogin = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnSubmit.mockClear();
    mockOnGoogleLogin.mockClear();
  });

  it('should render email and password fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} onGoogleLogin={mockOnGoogleLogin} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mock google login/i })).toBeInTheDocument();
  });

  it('should allow typing into email and password fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} onGoogleLogin={mockOnGoogleLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should call onSubmit with credentials when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} onGoogleLogin={mockOnGoogleLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

   it('should call onGoogleLogin when Google button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} onGoogleLogin={mockOnGoogleLogin} />);

    const googleButton = screen.getByRole('button', { name: /mock google login/i });
    await user.click(googleButton);

    expect(mockOnGoogleLogin).toHaveBeenCalledTimes(1);
  });


  it('should display loading state when loading prop is true', () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={true} onGoogleLogin={mockOnGoogleLogin} />);

    expect(screen.getByRole('button', { name: /logging in.../i })).toBeDisabled();
     expect(screen.getByRole('button', { name: /mock google login/i })).toBeDisabled();
  });

  it('should display error message when errorMessage prop is provided', () => {
    const errorMessage = 'Invalid credentials';
    render(<LoginForm onSubmit={mockOnSubmit} loading={false} errorMessage={errorMessage} onGoogleLogin={mockOnGoogleLogin} />);

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    // Or using getByText:
    // expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not call onSubmit if required fields are empty (HTML5 validation)', () => {
    // Note: JSDOM doesn't fully implement HTML5 validation, so this test
    // might rely on the 'required' attribute preventing submission logic.
    // More robust validation logic testing might need specific checks within the handler.
     render(<LoginForm onSubmit={mockOnSubmit} loading={false} onGoogleLogin={mockOnGoogleLogin} />);
     const submitButton = screen.getByRole('button', { name: /login/i });

     // Using fireEvent as userEvent might handle required slightly differently
     fireEvent.click(submitButton);

     // The browser would normally prevent submission here.
     // In JSDOM, we check if our mock was NOT called.
     expect(mockOnSubmit).not.toHaveBeenCalled();
   });
});