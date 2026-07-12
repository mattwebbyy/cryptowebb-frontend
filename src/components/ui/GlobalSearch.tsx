// src/components/ui/GlobalSearch.tsx
// Compact search trigger in the topbar; opens a centered quick-jump dialog.
// Searches pages plus live tokens from the indexer, with a fast-path for
// pasted 0x addresses (open as token or wallet).
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ArrowRight, CornerDownLeft, Coins, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTokenSearch } from '@/features/indexer';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { shortenAddress } from '@/lib/format';

interface GlobalSearchProps {
  onOpenCommandPalette: () => void;
  className?: string;
}

const quickSuggestions = [
  { label: 'Token Launches', path: '/launches', keywords: ['launches', 'new', 'tokens', 'pairs', 'feed'] },
  { label: 'Whale Feed', path: '/whales', keywords: ['whales', 'transfers', 'large', 'cex'] },
  { label: 'Exchange Flows', path: '/flows', keywords: ['flows', 'exchange', 'deposits', 'withdrawals'] },
  { label: 'Smart Money', path: '/smart-money', keywords: ['smart', 'money', 'traders', 'leaderboard'] },
  { label: 'Macro Metrics', path: '/macro', keywords: ['macro', 'metrics', 'netflow', 'reserves', 'charts'] },
  { label: 'Labels Directory', path: '/labels', keywords: ['labels', 'entities', 'exchanges', 'directory'] },
  { label: 'Network Status', path: '/status', keywords: ['status', 'sync', 'indexer', 'health'] },
  { label: 'Analytics Dashboard', path: '/analytics', keywords: ['analytics', 'dashboard', 'charts'] },
  { label: 'Live Crypto Feed', path: '/live-crypto', keywords: ['live', 'crypto', 'real-time', 'feed'] },
  { label: 'Data Sources', path: '/analytics/datasources', keywords: ['data', 'sources', 'connections'] },
  { label: 'Alerts', path: '/alerts', keywords: ['alerts', 'notifications', 'monitoring'] },
  { label: 'Portfolio', path: '/portfolio', keywords: ['portfolio', 'holdings', 'wallet'] },
  { label: 'Settings', path: '/settings', keywords: ['settings', 'profile', 'api'] },
  { label: 'Blog', path: '/blog', keywords: ['blog', 'posts', 'articles'] },
  { label: 'About', path: '/about', keywords: ['about', 'info', 'company'] },
  { label: 'Contact', path: '/contact', keywords: ['contact', 'support', 'help'] },
  { label: 'Pricing', path: '/pricing', keywords: ['pricing', 'plans', 'subscription'] },
];

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

type ResultKind = 'page' | 'token' | 'address';

interface ResultItem {
  kind: ResultKind;
  label: string;
  sublabel?: string;
  path: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onOpenCommandPalette,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trimmed = query.trim();
  const isAddress = ADDRESS_RE.test(trimmed);
  const debounced = useDebouncedValue(trimmed, 250);

  // Token search rides the indexer; failures just collapse the section.
  const { data: tokenResults } = useTokenSearch(isAddress ? '' : debounced, {
    enabled: isOpen && !isAddress && debounced.length >= 2,
  });

  const items = useMemo<ResultItem[]>(() => {
    if (isAddress) {
      return [
        {
          kind: 'address',
          label: `Open token ${shortenAddress(trimmed)}`,
          sublabel: 'View token analytics',
          path: `/token/${trimmed}`,
        },
        {
          kind: 'address',
          label: `Open wallet ${shortenAddress(trimmed)}`,
          sublabel: 'View wallet profile',
          path: `/wallet/${trimmed}`,
        },
      ];
    }

    const tokens: ResultItem[] = (tokenResults ?? []).slice(0, 5).map((t) => ({
      kind: 'token' as const,
      label: t.symbol || shortenAddress(t.address),
      sublabel: `${t.name || 'Unknown token'} · ${shortenAddress(t.address)}`,
      path: `/token/${t.address}`,
    }));

    const pages: ResultItem[] = (trimmed
      ? quickSuggestions.filter(
          (item) =>
            item.label.toLowerCase().includes(trimmed.toLowerCase()) ||
            item.keywords.some((k) => k.toLowerCase().includes(trimmed.toLowerCase()))
        )
      : quickSuggestions
    )
      .slice(0, 6)
      .map((s) => ({ kind: 'page' as const, label: s.label, path: s.path }));

    return [...tokens, ...pages];
  }, [isAddress, trimmed, tokenResults]);

  const firstPageIndex = items.findIndex((i) => i.kind === 'page');
  const hasTokenSection = items.some((i) => i.kind !== 'page');

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[activeIndex] ?? items[0];
      if (target) handleNavigate(target.path);
    }
  };

  // Escape closes; lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Clamp the cursor when async token results shrink the list.
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(items.length - 1, 0)));
  }, [items.length]);

  const iconFor = (item: ResultItem, active: boolean) => {
    const cls = `w-3.5 h-3.5 flex-shrink-0 ${
      active ? 'text-primary' : 'text-text-secondary/40'
    }`;
    if (item.kind === 'token') return <Coins className={cls} aria-hidden="true" />;
    if (item.kind === 'address')
      return item.path.startsWith('/wallet') ? (
        <Wallet className={cls} aria-hidden="true" />
      ) : (
        <Coins className={cls} aria-hidden="true" />
      );
    return <ArrowRight className={cls} aria-hidden="true" />;
  };

  const sectionHeading = (text: string) => (
    <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary/70">
      {text}
    </div>
  );

  return (
    <div className={className}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search (press Ctrl+K for command palette)"
        className="group flex w-44 lg:w-56 items-center gap-2 h-9 px-3 rounded-lg border border-border bg-surface-2 text-text-secondary hover:border-primary/40 hover:text-text transition-colors"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm flex-1 truncate text-left">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 flex-shrink-0">⌘K</kbd>
      </button>

      {/* Dialog — centered, never clipped by the viewport edge */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
            className="fixed z-[90] top-[15vh] left-1/2 -translate-x-1/2 w-[34rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
              <Search className="w-4 h-4 text-text-secondary flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tokens, addresses and pages…"
                className="flex-1 min-w-0 bg-transparent text-sm text-text placeholder:text-text-secondary/60 border-none outline-none"
                autoFocus
                role="combobox"
                aria-expanded="true"
                aria-controls="global-search-results"
                aria-activedescendant={
                  items[activeIndex] ? `global-search-option-${activeIndex}` : undefined
                }
                aria-autocomplete="list"
              />
              <kbd className="flex-shrink-0">esc</kbd>
            </div>

            <div
              id="global-search-results"
              role="listbox"
              aria-label="Search results"
              className="p-1.5 max-h-80 overflow-y-auto"
            >
              {hasTokenSection && sectionHeading(isAddress ? 'Address' : 'Tokens')}
              {items.map((item, index) => (
                <React.Fragment key={`${item.kind}:${item.path}`}>
                  {hasTokenSection && index === firstPageIndex && sectionHeading('Pages')}
                  {!hasTokenSection && !trimmed && index === 0 && sectionHeading('Pages')}
                  <button
                    type="button"
                    id={`global-search-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={() => handleNavigate(item.path)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 text-left rounded-lg text-sm transition-colors ${
                      index === activeIndex
                        ? 'bg-primary/10 text-text'
                        : 'text-text-secondary hover:text-text'
                    }`}
                  >
                    {iconFor(item, index === activeIndex)}
                    <span className="flex-1 min-w-0 truncate">
                      {item.label}
                      {item.sublabel && (
                        <span className="ml-2 text-xs text-text-secondary/70">
                          {item.sublabel}
                        </span>
                      )}
                    </span>
                    {index === activeIndex && (
                      <CornerDownLeft
                        className="w-3.5 h-3.5 text-text-secondary/50"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </React.Fragment>
              ))}

              {trimmed && items.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-text-secondary mb-2">No results for “{query}”</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onOpenCommandPalette();
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Open the command palette
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 h-9 border-t border-border bg-surface-2/50 text-[11px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <kbd>↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd>↵</kbd> open
              </span>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenCommandPalette();
                }}
                className="ml-auto flex items-center gap-1.5 hover:text-text transition-colors"
              >
                <kbd>⌘K</kbd> commands
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalSearch;
