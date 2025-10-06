import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalSearch } from './GlobalSearch';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('GlobalSearch', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('navigates to the first suggestion when submitting a matching query', async () => {
    const onOpenCommandPalette = vi.fn();
    const user = userEvent.setup();

    render(<GlobalSearch onOpenCommandPalette={onOpenCommandPalette} />);

    await user.click(screen.getByRole('button', { name: /search/i }));
    const input = await screen.findByPlaceholderText('Search pages and features...');
    await user.type(input, 'analytics');
    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith('/analytics');
    expect(onOpenCommandPalette).not.toHaveBeenCalled();
  });

  it('falls back to the command palette when no quick results are available', async () => {
    const onOpenCommandPalette = vi.fn();
    const user = userEvent.setup();

    render(<GlobalSearch onOpenCommandPalette={onOpenCommandPalette} />);

    await user.click(screen.getByRole('button', { name: /search/i }));
    const input = await screen.findByPlaceholderText('Search pages and features...');
    await user.type(input, 'unknown feature');
    await user.keyboard('{Enter}');

    expect(onOpenCommandPalette).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
