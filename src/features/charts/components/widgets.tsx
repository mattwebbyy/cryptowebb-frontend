// Non-canvas widget renderers (big number, data table) + shared live dot.
import type { ChartData } from '@/types/data';
import { Card } from '@/components/ui/Card';

export const LiveIndicator = ({ connected }: { connected: boolean }) => (
  <span
    className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
      connected ? 'bg-success animate-pulse' : 'bg-error'
    }`}
    role="status"
    aria-label={connected ? 'Live data connected' : 'Live data disconnected'}
    title={connected ? 'Live' : 'Disconnected'}
  />
);

interface WidgetShellProps {
  title?: string;
  isLive?: boolean;
  isConnected?: boolean;
  children: React.ReactNode;
}

export const WidgetShell = ({ title, isLive, isConnected = false, children }: WidgetShellProps) => (
  <Card className="relative h-full w-full flex flex-col overflow-hidden" hover={false}>
    {title && (
      <h3 className="text-sm font-medium text-text px-4 pt-3 pb-1 text-center flex-shrink-0 truncate">
        {title}
      </h3>
    )}
    {isLive && <LiveIndicator connected={isConnected} />}
    {children}
  </Card>
);

export const NumberWidget = ({ data, title, isLive, isConnected }: { data: ChartData; title?: string; isLive?: boolean; isConnected?: boolean }) => {
  const first = data[0];
  const keys = first ? Object.keys(first) : [];
  const valueKey = keys.find((k) => typeof first?.[k] === 'number');
  const rawValue = valueKey ? first?.[valueKey] : undefined;
  const displayValue = typeof rawValue === 'number' ? rawValue.toLocaleString() : 'N/A';

  return (
    <WidgetShell title={title} isLive={isLive} isConnected={isConnected}>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-4xl font-bold font-mono tabular-nums text-text">{displayValue}</div>
      </div>
    </WidgetShell>
  );
};

export const TableWidget = ({ data, title, isLive, isConnected }: { data: ChartData; title?: string; isLive?: boolean; isConnected?: boolean }) => {
  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <WidgetShell title={title} isLive={isLive} isConnected={isConnected}>
      <div className="overflow-auto flex-grow p-4 pt-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border">
              {keys.map((key) => (
                <th key={key} className="p-2 text-text-secondary font-medium sticky top-0 bg-surface">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/50 hover:bg-surface-2">
                {keys.map((key) => (
                  <td key={`${rowIndex}-${key}`} className="p-2 text-text whitespace-nowrap font-mono tabular-nums">
                    {String(row[key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <p className="text-text-secondary text-sm text-center p-4">No data available.</p>
        )}
      </div>
    </WidgetShell>
  );
};
