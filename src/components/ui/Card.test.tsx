import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('<Card />', () => {
  const renderCard = (ui: React.ReactNode) => {
    const result = render(ui);
    const element = result.container.querySelector('.rounded-xl');
    if (!element) {
      throw new Error('Card root element not found');
    }
    return { ...result, cardElement: element as HTMLElement };
  };

  it('renders children content', () => {
    render(<Card>Test card content</Card>);
    expect(screen.getByText('Test card content')).toBeInTheDocument();
  });

  it('applies the default styling classes', () => {
    const { cardElement } = renderCard(<Card>Test content</Card>);

    expect(cardElement).toHaveClass('rounded-xl');
    expect(cardElement).toHaveClass('transition-all', 'duration-300', 'ease-out');
    expect(cardElement.className).toContain('bg-surface/80');
    expect(cardElement).toHaveClass('border');
    expect(cardElement.className).toContain('border-border/50');
    expect(cardElement.className).toContain('backdrop-blur-sm');
    expect(cardElement.className).toContain('hover:shadow-modern-lg');
  });

  it('merges custom class names with defaults', () => {
    const { cardElement } = renderCard(
      <Card className="custom-class">Test content</Card>
    );

    expect(cardElement).toHaveClass('custom-class');
    expect(cardElement).toHaveClass('rounded-xl');
  });

  it('passes inline styles through', () => {
    const { cardElement } = renderCard(
      <Card style={{ backgroundColor: 'red', width: '200px' }}>Test content</Card>
    );

    expect((cardElement as HTMLElement).style.backgroundColor).toBe('red');
    expect((cardElement as HTMLElement).style.width).toBe('200px');
  });

  it('supports complex child structures', () => {
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

  it('renders fragments as children', () => {
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
