// src/components/ui/MatrixLoader.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MatrixLoader } from './MatrixLoader'; // Adjust path if needed

// Mock framer-motion if necessary (usually not needed for basic rendering tests)
// jest.mock('framer-motion', () => ({
//   motion: {
//     div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
//     p: jest.fn(({ children, ...props }) => <p {...props}>{children}</p>),
//     // Add other motion components used if needed
//   },
//   AnimatePresence: jest.fn(({ children }) => <>{children}</>),
// }));

describe('<MatrixLoader />', () => {
  // Use fake timers to control setInterval
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // Restore real timers after each test
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the main title and initial messages', () => {
    render(<MatrixLoader />);

    // Check for the main title (case-insensitive check might be safer if casing varies)
    expect(screen.getByText(/INITIALIZING SYSTEM/i)).toBeInTheDocument();

    // Check for the loading messages
    expect(screen.getByText(/> Establishing secure connection/)).toBeInTheDocument();
    expect(screen.getByText(/> Loading matrix protocols/)).toBeInTheDocument();
    expect(screen.getByText(/> Decrypting data streams/)).toBeInTheDocument();
  });

  it('should render the animated progress bar structure', () => {
    const { container } = render(<MatrixLoader />);
    // Find the outer div representing the bar container
    const progressBarContainer = container.querySelector('.w-64.h-2.bg-matrix-dark');
    expect(progressBarContainer).toBeInTheDocument();
    // Find the inner animating div
    const progressBarFiller = progressBarContainer?.firstChild;
    expect(progressBarFiller).toHaveClass('bg-matrix-green/50');
  });

  it('should animate the dots correctly', () => {
    render(<MatrixLoader />);

    const titleElement = screen.getByText(/INITIALIZING SYSTEM/i);
    const dotsSpan = titleElement.querySelector('span'); // Find the span within the title

    // Initial state (no dots)
    expect(dotsSpan).toHaveTextContent('');

    // Advance time by 500ms (1st dot)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('.');

    // Advance time by 500ms (2nd dot)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('..');

    // Advance time by 500ms (3rd dot)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('...');

    // Advance time by 500ms (reset dots)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsSpan).toHaveTextContent('');

     // Advance time by 500ms (1st dot again)
     act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(dotsSpan).toHaveTextContent('.');
  });

  // Optional: Test framer-motion presence if not mocking
  it('should apply motion attributes (basic check)', () => {
     render(<MatrixLoader />);
     const title = screen.getByText(/INITIALIZING SYSTEM/i).parentElement; // Get the motion.div wrapping the h2
     expect(title).toHaveStyle('opacity: 0'); // Framer motion often starts with initial styles
     // Note: Testing exact animation states is complex and often better suited for E2E tests.
   });

});