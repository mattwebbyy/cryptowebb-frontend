import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Skeleton,
  ChartSkeleton,
  TableSkeleton,
} from './Skeleton';

describe('Skeleton', () => {
  it('applies size styles and variant classes', () => {
    const { container } = render(
      <Skeleton width={120} height="2rem" variant="pulse" rounded={false} className="custom" />,
    );

    const element = container.firstElementChild as HTMLElement;
    expect(element).toBeTruthy();
    expect(element.style.width).toBe('120px');
    expect(element.style.height).toBe('2rem');
    expect(element.className).toContain('bg-matrix-green/20');
    expect(element.className).toContain('animate-bounce');
    expect(element.className).not.toContain('rounded');
    expect(element.className).toContain('custom');
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ChartSkeleton', () => {
  it('renders a fixed number of column bars with deterministic heights', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const { container } = render(<ChartSkeleton />);

    const columns = Array.from(container.querySelectorAll('div')).filter((element) => {
      const el = element as HTMLElement;
      return el.classList.contains('w-8') && el.style.height;
    });

    expect(columns).toHaveLength(8);
    columns.forEach((column) => {
      expect((column as HTMLElement).style.height).toBe('60px');
    });
    expect(randomSpy).toHaveBeenCalled();
  });
});

describe('TableSkeleton', () => {
  it('respects the requested row and column counts', () => {
    const rows = 2;
    const columns = 3;
    const { container } = render(<TableSkeleton rows={rows} columns={columns} />);

    const gridSections = Array.from(container.querySelectorAll('div')).filter((element) => {
      const gridTemplate = (element as HTMLElement).style.gridTemplateColumns;
      return gridTemplate === `repeat(${columns}, 1fr)`;
    });

    // Expect one header grid plus the specified number of body rows.
    expect(gridSections).toHaveLength(rows + 1);
  });
});
