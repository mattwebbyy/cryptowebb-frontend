import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

const mockUseTheme = vi.mocked(useTheme);

const baseTheme = {
  mode: 'dark' as const,
  variant: 'matrix' as const,
  matrixIntensity: 'medium' as const,
  animations: true,
  reducedMotion: false,
};

const setupThemeContext = (
  themeOverrides: Partial<typeof baseTheme> = {},
  handlerOverrides: Partial<Record<'setTheme' | 'toggleMode' | 'resetTheme' | 'applyTheme', ReturnType<typeof vi.fn>>> = {},
) => {
  const contextValue = {
    theme: { ...baseTheme, ...themeOverrides },
    setTheme: handlerOverrides.setTheme ?? vi.fn(),
    toggleMode: handlerOverrides.toggleMode ?? vi.fn(),
    resetTheme: handlerOverrides.resetTheme ?? vi.fn(),
    applyTheme: handlerOverrides.applyTheme ?? vi.fn(),
  };

  mockUseTheme.mockReturnValue(contextValue as unknown as ReturnType<typeof useTheme>);
  return contextValue;
};

describe('ThemeToggle', () => {
  it('toggles the theme mode when using the simple variant', async () => {
    const toggleMode = vi.fn();
    setupThemeContext({ mode: 'dark' }, { toggleMode });

    const user = userEvent.setup();
    render(<ThemeToggle variant="simple" showLabel />);

    const trigger = screen.getByRole('button', { name: /dark/i });
    await user.click(trigger);

    expect(toggleMode).toHaveBeenCalledTimes(1);
  });

  it('allows choosing a different mode from the dropdown', async () => {
    const setTheme = vi.fn();
    setupThemeContext({ mode: 'dark' }, { setTheme });

    const user = userEvent.setup();
    render(<ThemeToggle variant="full" showLabel />);

    await user.click(screen.getByRole('button', { name: /theme/i }));
    await user.click(await screen.findByRole('button', { name: /^light$/i }));

    expect(setTheme).toHaveBeenCalledWith({ mode: 'light' });
  });

  it('updates matrix intensity options while the dropdown is open', async () => {
    const setTheme = vi.fn();
    setupThemeContext({ matrixIntensity: 'medium' }, { setTheme });

    const user = userEvent.setup();
    render(<ThemeToggle variant="full" showLabel />);

    await user.click(screen.getByRole('button', { name: /theme/i }));
    await user.click(await screen.findByRole('button', { name: /^high$/i }));

    expect(setTheme).toHaveBeenCalledWith({ matrixIntensity: 'high' });
  });
});
