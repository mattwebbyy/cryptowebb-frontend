import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import BackButton from './BackButton';
import { MemoryRouter } from 'react-router-dom';

describe('BackButton', () => {
  it('navigates to the root route when clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
