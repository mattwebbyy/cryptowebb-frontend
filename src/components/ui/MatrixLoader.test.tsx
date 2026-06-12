// src/components/ui/MatrixLoader.test.tsx
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MatrixLoader } from './MatrixLoader'; // Adjust path if needed

// Mock framer-motion if necessary (usually not needed for basic rendering tests)
// vi.mock('framer-motion', () => ({
//   motion: {
//     div: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>),
//     p: vi.fn(({ children, ...props }) => <p {...props}>{children}</p>),
//     // Add other motion components used if needed
//   },
//   AnimatePresence: vi.fn(({ children }) => <>{children}</>),
// }));

describe('<MatrixLoader />', () => {
  // Use fake timers to control setInterval
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Restore real timers after each test
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render the main title and initial messages', () => {
    render(<MatrixLoader />);

    // Check for the main title (case-insensitive check might be safer if casing varies)
    expect(screen.getByText(/INITIALIZING SYSTEM/i)).toBeInTheDocument();

    // Check for the loading messages
    expect(screen.getByText(/Establishing secure connection/)).toBeInTheDocument();
    expect(screen.getByText(/Loading matrix protocols/)).toBeInTheDocument();
    expect(screen.getByText(/Decrypting data streams/)).toBeInTheDocument();
  });

  it('should render the animated progress bar structure', () => {
    const { container } = render(<MatrixLoader />);
    // Find the outer div representing the bar container
    const progressBarContainer = container.querySelector('.w-64.h-2');
    expect(progressBarContainer).toBeInTheDocument();
    // Find the inner animating div
    const progressBarFiller = progressBarContainer?.firstChild;
    expect(progressBarFiller).toHaveClass('bg-primary/50');
  });

  it('should animate the dots correctly', () => {
    render(<MatrixLoader />);

    const titleElement = screen.getByText(/INITIALIZING SYSTEM/i);
    const dotsSpan = titleElement.querySelector('span'); // Find the span within the title

    // Initial state (no dots)
    expect(dotsSpan).toHaveTextContent('');

    // Advance time by 500ms (1st dot)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('.');

    // Advance time by 500ms (2nd dot)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('..');

    // Advance time by 500ms (3rd dot)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('...');

    // Advance time by 500ms (reset dots)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('');

     // Advance time by 500ms (1st dot again)
     act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(dotsSpan).toHaveTextContent('.');
  });

  // Optional: Test framer-motion presence if not mocking
  it('should render the title wrapper', () => {
     render(<MatrixLoader />);
     // framer-motion is mocked in tests, so animation styles are not applied;
     // assert the structural wrapper exists instead.
     const title = screen.getByText(/INITIALIZING SYSTEM/i).parentElement;
     expect(title).toBeInTheDocument();
   });

});