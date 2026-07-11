// Shared numeric/address formatters for analytics surfaces. Data from the
// indexer is frequently null (fresh launches, partial backfill) — the *Maybe
// variants render an em dash so tables degrade gracefully.

export const EM_DASH = '—';

/** 1234567 -> "1.23M" */
export function formatCompact(num: number, decimals = 2): string {
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

export function formatUSD(num: number): string {
  const sign = num < 0 ? '-' : '';
  return `${sign}$${formatCompact(Math.abs(num))}`;
}

export function formatUSDMaybe(num: number | null | undefined): string {
  return num == null ? EM_DASH : formatUSD(num);
}

/**
 * The indexer's price frontier trails the chain while backfill runs, so junk
 * tokens can be valued at absurd USD figures (an $8.8B transfer of a
 * micro-cap). Anything past the cap is almost certainly a stale-price
 * artifact — render an em dash instead of a lie.
 */
export const USD_SANITY_CAP = 5_000_000_000;

export function isJunkUSD(num: number | null | undefined, cap = USD_SANITY_CAP): boolean {
  return num != null && Math.abs(num) > cap;
}

export function formatUSDSane(num: number | null | undefined, cap = USD_SANITY_CAP): string {
  if (num == null) return EM_DASH;
  return isJunkUSD(num, cap) ? EM_DASH : formatUSD(num);
}

export function formatCompactMaybe(num: number | null | undefined, decimals = 0): string {
  return num == null ? EM_DASH : formatCompact(num, decimals);
}

/**
 * Token prices span ~15 orders of magnitude; show enough significant digits
 * for micro-caps without scientific notation.
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0';
  if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  // Sub-0.0001: show 4 significant digits, e.g. $0.0000004525
  const digits = Math.max(4, -Math.floor(Math.log10(price)) + 3);
  return `$${price.toFixed(Math.min(digits, 18))}`;
}

export function formatPriceMaybe(price: number | null | undefined): string {
  return price == null ? EM_DASH : formatPrice(price);
}

export function shortenAddress(addr: string, chars = 4): string {
  if (!addr) return '';
  if (addr.length <= 2 + chars * 2) return addr;
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

/** Unix seconds -> "5m ago" */
export function timeAgo(unixSeconds: number): string {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000 - unixSeconds));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Minutes -> "3m" / "2h" / "5d" */
export function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}

export function formatPercent(fraction: number, decimals = 1): string {
  return `${(fraction * 100).toFixed(decimals)}%`;
}

export function etherscanTxUrl(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}

export function etherscanAddressUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}
