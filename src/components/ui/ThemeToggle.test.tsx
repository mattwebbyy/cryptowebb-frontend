import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

const useThemeMock = useTheme as unknown as vi.Mock;

let toggleModeMock: ReturnType<typeof vi.fn>;
let setThemeMock: ReturnType<typeof vi.fn>;

const baseTheme = {
  mode: 'dark' as const,
  variant: 'matrix' as const,
  matrixIntensity: 'medium' as const,
  animations: true,
  reducedMotion: false,
};

beforeEach(() => {
  toggleModeMock = vi.fn();
  setThemeMock = vi.fn();
  useThemeMock.mockReturnValue({
    theme: baseTheme,
    toggleMode: toggleModeMock,
    setTheme: setThemeMock,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('ThemeToggle', () => {
  it('renders simple variant and toggles mode on click', async () => {
    render(<ThemeToggle variant="simple" showLabel />);

    const button = screen.getByRole('button', { name: /dark/i });
    expect(button).toHaveAttribute('title', 'Switch to light mode');

    await userEvent.click(button);
    expect(toggleModeMock).toHaveBeenCalledTimes(1);
  });

  it('allows selecting theme options in full variant', async () => {
    render(<ThemeToggle variant="full" showLabel />);

    await userEvent.click(screen.getByRole('button', { name: /theme/i }));

    await userEvent.click(screen.getByRole('button', { name: /light/i }));
    expect(setThemeMock).toHaveBeenCalledWith({ mode: 'light' });
    setThemeMock.mockClear();

    await userEvent.click(screen.getByRole('button', { name: /cyber/i }));
    expect(setThemeMock).toHaveBeenCalledWith({ variant: 'cyber' });
    setThemeMock.mockClear();

    await userEvent.click(screen.getByRole('button', { name: /high/i }));
    expect(setThemeMock).toHaveBeenCalledWith({ matrixIntensity: 'high' });
    setThemeMock.mockClear();

    const animationsLabel = screen.getByText('Animations');
    const animationsToggle = animationsLabel.closest('label')?.querySelector('button');
    expect(animationsToggle).toBeTruthy();

    if (animationsToggle) {
      await userEvent.click(animationsToggle);
      expect(setThemeMock).toHaveBeenCalledWith({ animations: false });
    }
  });

  it('hides matrix controls when variant is not matrix', () => {
    useThemeMock.mockReturnValue({
      theme: { ...baseTheme, variant: 'cyber' as const },
      toggleMode: toggleModeMock,
      setTheme: setThemeMock,
    });

    render(<ThemeToggle variant="full" />);

    expect(screen.queryByText('Matrix Intensity')).toBeNull();
  });
});
