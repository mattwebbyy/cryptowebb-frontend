import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import BackButton from './BackButton';

describe('BackButton', () => {
  it('navigates to root when clicked', async () => {
    render(<BackButton />);

    await userEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
