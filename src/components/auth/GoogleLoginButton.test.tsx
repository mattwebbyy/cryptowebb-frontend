import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleLoginButton from './GoogleLoginButton';

describe('<GoogleLoginButton />', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockReset();
  });

  it('should render with correct text and icon', () => {
    render(<GoogleLoginButton onClick={mockOnClick} />);

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    
    // Check if SVG icon is present
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<GoogleLoginButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /continue with google/i });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<GoogleLoginButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should not call onClick when disabled and clicked', async () => {
    const user = userEvent.setup();
    render(<GoogleLoginButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button', { name: /continue with google/i });
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should be enabled by default', () => {
    render(<GoogleLoginButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).not.toBeDisabled();
  });

  it('should have correct CSS classes for styling', () => {
    render(<GoogleLoginButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).toHaveClass(
      'w-full',
      'flex',
      'items-center',
      'justify-center',
      'gap-2',
      'bg-white',
      'text-gray-700',
      'px-4',
      'py-2',
      'rounded-lg',
      'border',
      'border-gray-300',
      'hover:bg-gray-50',
      'transition-colors'
    );
  });

  it('should render with accessible button role', () => {
    render(<GoogleLoginButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
