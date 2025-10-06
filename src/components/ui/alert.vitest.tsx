import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  it('renders with default variant styles and accessible role', () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something informative</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.className).toContain('border-teal-600');
    expect(alert.className).toContain('bg-teal-50');
    expect(screen.getByRole('heading', { level: 5, name: /heads up/i })).toBeInTheDocument();
    expect(screen.getByText(/something informative/i)).toBeInTheDocument();
  });

  it('supports the destructive variant and merges custom classes', () => {
    render(
      <Alert variant="destructive" className="custom-border">
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('border-red-500/50');
    expect(alert.className).toContain('bg-red-50');
    expect(alert.className).toContain('custom-border');
  });
});
