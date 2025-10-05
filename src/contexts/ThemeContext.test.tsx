import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, afterAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

const THEME_STORAGE_KEY = 'cryptowebb-theme';

const ThemeConsumer: React.FC = () => {
  const { theme, toggleMode, setTheme, resetTheme, applyTheme } = useTheme();

  return (
    <div>
      <span data-testid="mode">{theme.mode}</span>
      <span data-testid="variant">{theme.variant}</span>
      <span data-testid="intensity">{theme.matrixIntensity}</span>
      <span data-testid="animations">{String(theme.animations)}</span>
      <span data-testid="reduced-motion">{String(theme.reducedMotion)}</span>
      <button onClick={toggleMode}>toggle</button>
      <button onClick={() => setTheme({ variant: 'cyber' })}>setVariant</button>
      <button onClick={() => setTheme({ matrixIntensity: 'high' })}>setIntensity</button>
      <button onClick={() => setTheme({ animations: false })}>toggleAnimations</button>
      <button onClick={resetTheme}>reset</button>
      <button onClick={applyTheme}>apply</button>
    </div>
  );
};

const originalMatchMedia = window.matchMedia;
const matchMediaMock = vi.fn<(query: string) => MediaQueryList>();

const createMediaQuery = (query: string): MediaQueryList => ({
  matches: query.includes('prefers-reduced-motion') ? true : false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as unknown as MediaQueryList);

beforeAll(() => {
  matchMediaMock.mockImplementation(createMediaQuery);
  (window as unknown as { matchMedia: typeof window.matchMedia }).matchMedia = matchMediaMock as unknown as typeof window.matchMedia;
});

afterAll(() => {
  matchMediaMock.mockReset();
  if (originalMatchMedia) {
    (window as unknown as { matchMedia: typeof window.matchMedia }).matchMedia = originalMatchMedia;
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error allow cleanup for test environment
    delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
  }
});

beforeEach(() => {
  matchMediaMock.mockClear();
  matchMediaMock.mockImplementation(createMediaQuery);
  localStorage.clear();
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
});

describe('ThemeContext', () => {
  it('initializes with stored theme and applies document classes', async () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        mode: 'light',
        variant: 'minimal',
        matrixIntensity: 'high',
        animations: false,
        reducedMotion: true,
      }),
    );

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(screen.getByTestId('variant').textContent).toBe('minimal');
    expect(screen.getByTestId('intensity').textContent).toBe('high');
    expect(screen.getByTestId('animations').textContent).toBe('false');
    expect(screen.getByTestId('reduced-motion').textContent).toBe('true');

    await waitFor(() => {
      const classes = document.documentElement.classList;
      expect(classes.contains('theme-light')).toBe(true);
      expect(classes.contains('variant-minimal')).toBe(true);
      expect(classes.contains('intensity-high')).toBe(true);
      expect(classes.contains('animations-disabled')).toBe(true);
      expect(classes.contains('motion-reduced')).toBe(true);
    });
  });

  it('toggles between light and dark modes and persists to storage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('dark');

    await userEvent.click(screen.getByText('toggle'));

    await waitFor(() => {
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });

    const persisted = localStorage.getItem(THEME_STORAGE_KEY);
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted as string).mode).toBe('light');

    await waitFor(() => {
      expect(document.documentElement.classList.contains('theme-light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('merges theme updates and reset restores defaults', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText('setVariant'));
    await userEvent.click(screen.getByText('setIntensity'));
    await userEvent.click(screen.getByText('toggleAnimations'));

    await waitFor(() => {
      expect(screen.getByTestId('variant').textContent).toBe('cyber');
      expect(screen.getByTestId('intensity').textContent).toBe('high');
      expect(screen.getByTestId('animations').textContent).toBe('false');
    });

    const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) as string);
    expect(stored.variant).toBe('cyber');
    expect(stored.matrixIntensity).toBe('high');
    expect(stored.animations).toBe(false);

    await waitFor(() => {
      const classes = document.documentElement.classList;
      expect(classes.contains('variant-cyber')).toBe(true);
      expect(classes.contains('intensity-high')).toBe(true);
      expect(classes.contains('animations-disabled')).toBe(true);
    });

    await userEvent.click(screen.getByText('reset'));

    await waitFor(() => {
      expect(screen.getByTestId('variant').textContent).toBe('matrix');
      expect(screen.getByTestId('intensity').textContent).toBe('medium');
      expect(screen.getByTestId('animations').textContent).toBe('true');
    });

    await waitFor(() => {
      const classes = document.documentElement.classList;
      expect(classes.contains('variant-matrix')).toBe(true);
      expect(classes.contains('intensity-medium')).toBe(true);
      expect(classes.contains('animations-enabled')).toBe(true);
    });
  });
});
