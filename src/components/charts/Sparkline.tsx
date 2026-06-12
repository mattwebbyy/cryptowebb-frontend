// Dependency-free SVG sparkline (replaces react-sparklines).
import { memo, useId } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /** Stroke color; defaults to the first chart ramp color. */
  color?: string;
  /** Soft gradient fill under the line. */
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}

const SparklineInner = ({
  data,
  width = 120,
  height = 32,
  color = 'var(--chart-1)',
  fill = true,
  strokeWidth = 1.5,
  className,
}: SparklineProps) => {
  const gradientId = useId();

  if (data.length < 2) {
    return <svg width={width} height={height} className={className} aria-hidden="true" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = strokeWidth;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const areaPath = `${path} L${points[points.length - 1][0].toFixed(2)},${height} L${points[0][0].toFixed(2)},${height} Z`;

  return (
    <svg width={width} height={height} className={className} role="img" aria-label="trend sparkline">
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export const Sparkline = memo(SparklineInner);
export default Sparkline;
