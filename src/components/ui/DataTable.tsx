// Generic analytics table: TanStack Table for sorting/columns, TanStack
// Virtual for large result sets (holder lists, whale feeds). Token-styled,
// sticky header, skeleton loading, optional row-flash for live prepends.
import { useRef } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export type { ColumnDef, SortingState };

/**
 * Per-column extras carried on TanStack's `meta`. `className` lands on both
 * the header and body cells — use it to hide secondary columns on small
 * screens (`hidden md:table-cell`).
 */
export interface ColumnMeta {
  className?: string;
}

const metaClass = (meta: unknown): string | undefined =>
  (meta as ColumnMeta | undefined)?.className;

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
  /** Render an error state (shown only when there are no rows to show). */
  error?: { message: string; onRetry?: () => void } | null;
  /** Stable key per row; defaults to row index */
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  initialSorting?: SortingState;
  /**
   * Virtualize rows inside a fixed-height scroll container. Use for feeds
   * and holder lists that can exceed a few hundred rows.
   */
  virtualized?: boolean;
  /** Scroll container height when virtualized (default 600px) */
  height?: number;
  /** Estimated row height for the virtualizer (default 40px) */
  estimateRowHeight?: number;
  /** Row keys to flash-highlight (live WS prepends) */
  highlightedKeys?: ReadonlySet<string>;
  className?: string;
}

const SKELETON_ROWS = 8;

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data',
  error = null,
  rowKey,
  onRowClick,
  initialSorting = [],
  virtualized = false,
  height = 600,
  estimateRowHeight = 40,
  highlightedKeys,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const scrollRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 12,
    enabled: virtualized,
  });

  const keyFor = (row: Row<T>) => (rowKey ? rowKey(row.original) : row.id);

  const renderRow = (row: Row<T>, style?: React.CSSProperties) => {
    const key = keyFor(row);
    const highlighted = highlightedKeys?.has(key);
    return (
      <tr
        key={key}
        style={style}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        className={cn(
          'border-b border-border/60 transition-colors hover:bg-surface-2/60',
          onRowClick && 'cursor-pointer',
          highlighted && 'animate-row-flash'
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className={cn(
              'px-3 py-2 text-[13px] whitespace-nowrap',
              metaClass(cell.column.columnDef.meta)
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    );
  };

  const header = (
    <thead className="sticky top-0 z-10 bg-surface">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b border-border">
          {headerGroup.headers.map((h) => {
            const sortable = h.column.getCanSort();
            const dir = h.column.getIsSorted();
            return (
              <th
                key={h.id}
                className={cn(
                  'px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-text-secondary select-none whitespace-nowrap',
                  sortable && 'cursor-pointer hover:text-text',
                  metaClass(h.column.columnDef.meta)
                )}
                onClick={sortable ? h.column.getToggleSortingHandler() : undefined}
                aria-sort={
                  dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {sortable &&
                    (dir === 'asc' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : dir === 'desc' ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    ))}
                </span>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );

  if (isLoading) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full">
          {header}
          <tbody>
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {columns.map((_, j) => (
                  <td key={j} className="px-3 py-2.5">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full">{header}</table>
        {error ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-text-secondary">{error.message}</p>
            {error.onRetry && (
              <button
                onClick={error.onRetry}
                className="rounded-lg border border-border bg-surface-2 px-4 py-1.5 text-sm text-text hover:border-primary/60 hover:text-primary transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-text-secondary">{emptyMessage}</div>
        )}
      </div>
    );
  }

  if (!virtualized) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full">
          {header}
          <tbody>{rows.map((row) => renderRow(row))}</tbody>
        </table>
      </div>
    );
  }

  // Virtualized: fixed-height scroll container, spacer rows keep table
  // semantics while only visible rows render.
  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div ref={scrollRef} className={cn('overflow-auto', className)} style={{ height }}>
      <table className="w-full">
        {header}
        <tbody>
          {paddingTop > 0 && (
            <tr aria-hidden>
              <td colSpan={columns.length} style={{ height: paddingTop, padding: 0 }} />
            </tr>
          )}
          {virtualRows.map((vRow) => renderRow(rows[vRow.index]))}
          {paddingBottom > 0 && (
            <tr aria-hidden>
              <td colSpan={columns.length} style={{ height: paddingBottom, padding: 0 }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
