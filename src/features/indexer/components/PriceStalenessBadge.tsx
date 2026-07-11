import { Clock } from 'lucide-react';
import { usePrices } from '../api/useIndexerApi';

const STALE_AFTER_SECONDS = 24 * 3600;

const TOOLTIP =
  'USD values come from the price backfill frontier, which is still catching up to the chain. Dollar figures may be inaccurate until it does.';

/**
 * Amber pill shown whenever the indexer's price frontier is more than a day
 * old. Renders nothing when prices are fresh (or unknown), so it can be
 * dropped into any header unconditionally.
 */
export function PriceStalenessBadge({ asOf }: { asOf: number | null | undefined }) {
  if (asOf == null) return null;
  if (Date.now() / 1000 - asOf < STALE_AFTER_SECONDS) return null;

  const date = new Date(asOf * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <span
      title={TOOLTIP}
      className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning whitespace-nowrap"
    >
      <Clock size={12} aria-hidden />
      Prices as of {date}
    </span>
  );
}

/**
 * Self-fetching variant for pages whose payload doesn't carry prices_as_of
 * (whales, flows, launches). Cheap: /prices is cached server-side.
 */
export function GlobalPriceStalenessBadge() {
  const { data } = usePrices({ refetchInterval: 60_000 });
  return <PriceStalenessBadge asOf={data?.as_of} />;
}
