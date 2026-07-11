import { describe, it, expect } from 'vitest';
import { resolveIndexerMock, ComingSoonError, nextMockNewTokenAlert, nextMockWhaleAlert } from './mocks';
import type { NewToken, WhaleTransfer, IndexerStatus, TokenStats, Portfolio } from './types';

describe('resolveIndexerMock', () => {
  it('honors the launch-feed filters (hours, min liquidity, sort, limit)', () => {
    const rows = resolveIndexerMock('/tokens/new', {
      hours: 6,
      min_liquidity_usd: 10_000,
      sort: 'liquidity',
      limit: 25,
    }) as NewToken[];

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(25);
    for (const row of rows) {
      expect(row.age_minutes).toBeLessThanOrEqual(6 * 60);
      expect(row.liquidity_usd ?? 0).toBeGreaterThanOrEqual(10_000);
    }
    // sorted descending by liquidity
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].liquidity_usd ?? 0).toBeGreaterThanOrEqual(rows[i].liquidity_usd ?? 0);
    }
  });

  it('honors the whales min_usd filter', () => {
    const rows = resolveIndexerMock('/whales', { min_usd: 1_000_000, limit: 50 }) as WhaleTransfer[];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.value_usd).toBeGreaterThanOrEqual(1_000_000);
    }
  });

  it('returns a syncing status with a live-ish block height', () => {
    const status = resolveIndexerMock('/status') as IndexerStatus;
    expect(status.latest_chain_block).toBeGreaterThan(21_000_000);
    expect(status.blocks_behind).toBe(status.latest_chain_block - status.latest_indexed_block);
  });

  it('is deterministic per token address', () => {
    const a = resolveIndexerMock('/token/0xabc123/stats') as TokenStats;
    const b = resolveIndexerMock('/token/0xabc123/stats') as TokenStats;
    expect(a.symbol).toBe(b.symbol);
    expect(a.holder_count).toBe(b.holder_count);
  });

  it('sums portfolio token values into the total', () => {
    const p = resolveIndexerMock('/portfolio/0xdef456') as Portfolio;
    const tokensValue = p.tokens.reduce((sum, t) => sum + (t.value_usd ?? 0), 0);
    expect(p.total_value_usd).toBeCloseTo(p.eth_value_usd + tokensValue, 6);
  });

  it('throws ComingSoonError for upstream-stubbed endpoints', () => {
    for (const endpoint of ['/pnl/0xabc', '/indicators/0xabc', '/tvl', '/stats/defi']) {
      expect(() => resolveIndexerMock(endpoint)).toThrow(ComingSoonError);
    }
  });
});

describe('mock stream events', () => {
  it('produces well-formed alerts', () => {
    const launch = nextMockNewTokenAlert();
    expect(launch.token_address).toMatch(/^0x[0-9a-f]{40}$/);
    expect(launch.timestamp).toBeGreaterThan(1_700_000_000);

    const whale = nextMockWhaleAlert();
    expect(whale.transaction_hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(whale.value_usd).toBeGreaterThanOrEqual(100_000);
  });
});
