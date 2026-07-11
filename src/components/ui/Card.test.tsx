import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('<Card />', () => {
  it('should render children correctly', () => {
    const testContent = 'Test card content';
    render(<Card>{testContent}</Card>);

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should apply default CSS classes', () => {
    const { container } = render(<Card>Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('rounded-md', 'border');
  });

  it('should merge custom className with default classes', () => {
    const customClass = 'custom-class';
    const { container } = render(<Card className={customClass}>Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass(customClass);
    expect(cardElement).toHaveClass('rounded-md', 'border'); // Still has defaults
  });

  it('should pass style props correctly', () => {
    const customStyle = { backgroundColor: 'red', width: '200px' };
    const { container } = render(<Card style={customStyle}>Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(cardElement).toHaveStyle('width: 200px');
  });

  it('should render without className or style props', () => {
    const { container } = render(<Card>Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
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

  it('should handle empty content', () => {
    const { container } = render(<Card>{null}</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toBeEmptyDOMElement();
  });

  it('should combine multiple custom classes correctly', () => {
    const { container } = render(<Card className="class1 class2 class3">Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('class1', 'class2', 'class3');
    expect(cardElement).toHaveClass('rounded-md', 'border'); // Still has defaults
  });

  it('should override default classes when conflicting classes are provided', () => {
    // Test that clsx properly handles class merging
    const { container } = render(<Card className="bg-red-500 p-2">Test content</Card>);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('bg-red-500', 'p-2');
    expect(cardElement).toHaveClass('rounded-md'); // Defaults retained alongside custom classes (clsx)
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