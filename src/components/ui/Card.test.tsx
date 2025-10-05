import React from 'react';
import { render, screen } from '@testing-library/react';
import { jest, describe, it, expect } from '@jest/globals';
import { Card } from './Card';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, className, style, ...props }) => (
      <div className={className} style={style} data-testid="motion-div" {...props}>
        {children}
      </div>
    )),
  },
}));

describe('<Card />', () => {
  it('should render children correctly', () => {
    const testContent = 'Test card content';
    render(<Card>{testContent}</Card>);

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should apply default CSS classes', () => {
    render(<Card>Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toHaveClass(
      'border',
      'border-matrix-green',
      'bg-matrix-dark/30',
      'p-6',
      'rounded-none'
    );
  });

  it('should merge custom className with default classes', () => {
    const customClass = 'custom-class';
    render(<Card className={customClass}>Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toHaveClass(customClass);
    expect(cardElement).toHaveClass('border', 'border-matrix-green'); // Still has defaults
  });

  it('should pass style props correctly', () => {
    const customStyle = { backgroundColor: 'red', width: '200px' };
    render(<Card style={customStyle}>Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toHaveStyle('background-color: red');
    expect(cardElement).toHaveStyle('width: 200px');
  });

  it('should render without className or style props', () => {
    render(<Card>Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should handle complex children structures', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Paragraph content</p>
        <button>Click me</button>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should pass framer-motion animation props correctly', () => {
    const { motion } = require('framer-motion');
    
    render(<Card>Test content</Card>);

    expect(motion.div).toHaveBeenCalledWith(
      expect.objectContaining({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }),
      expect.anything()
    );
  });

  it('should handle empty content', () => {
    render(<Card></Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toBeEmptyDOMElement();
  });

  it('should combine multiple custom classes correctly', () => {
    render(<Card className="class1 class2 class3">Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toHaveClass('class1', 'class2', 'class3');
    expect(cardElement).toHaveClass('border', 'border-matrix-green'); // Still has defaults
  });

  it('should override default classes when conflicting classes are provided', () => {
    // Test that clsx properly handles class merging
    render(<Card className="bg-red-500 p-2">Test content</Card>);

    const cardElement = screen.getByTestId('motion-div');
    expect(cardElement).toHaveClass('bg-red-500', 'p-2');
    expect(cardElement).toHaveClass('bg-matrix-dark/30', 'p-6'); // Both should be present due to clsx
  });

  it('should work with React fragments as children', () => {
    render(
      <Card>
        <>
          <span>Fragment child 1</span>
          <span>Fragment child 2</span>
        </>
      </Card>
    );

    expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
  });
});