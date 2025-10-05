import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MatrixLoader } from './MatrixLoader';

describe('<MatrixLoader />', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('renders the primary heading and status messages', () => {
    render(<MatrixLoader />);

    expect(screen.getByText(/INITIALIZING SYSTEM/i)).toBeInTheDocument();
    expect(screen.getByText(/Establishing secure connection/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading matrix protocols/i)).toBeInTheDocument();
    expect(screen.getByText(/Decrypting data streams/i)).toBeInTheDocument();
  });

  it('displays the progress bar container and filler', () => {
    const { container } = render(<MatrixLoader />);

    const progressBarContainer = container.querySelector('.w-64.h-2');
    expect(progressBarContainer).toBeInTheDocument();
    expect(progressBarContainer?.className).toContain('bg-gray-200');
    expect(progressBarContainer?.className).toContain('dark:bg-gray-800');

    const progressBarFiller = progressBarContainer?.querySelector('div');
    expect(progressBarFiller).toBeInTheDocument();
    expect(progressBarFiller?.className).toContain('bg-teal-600/50');
  });

  it('cycles the trailing dots over time', () => {
    render(<MatrixLoader />);

    const heading = screen.getByText(/INITIALIZING SYSTEM/i);
    const dotsSpan = heading.querySelector('span');
    expect(dotsSpan).not.toBeNull();

    expect(dotsSpan).toHaveTextContent('');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('.');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('..');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('...');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('');
  });
});
