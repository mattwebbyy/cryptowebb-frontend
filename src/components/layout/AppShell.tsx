// src/components/layout/AppShell.tsx — product shell: persistent left
// sidebar + slim top bar (search / theme / account). Marketing pages use
// MarketingLayout instead; this is the Nansen/Dune-style app frame.
import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  Rocket,
  Waves,
  ArrowLeftRight,
  Crosshair,
  Briefcase,
  Bell,
  LayoutDashboard,
  BookOpen,
  Activity,
  Settings,
  Lock,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFlag, setFlagOverride } from '@/lib/flags';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Button } from '@/components/ui/Button';

/**
 * Demo-data indicator/toggle. Always visible while mock data is active (so
 * generated numbers are never mistaken for chain data); in dev builds it's
 * also shown as an off-state toggle. Reloads to clear cached queries.
 */
const DemoDataChip = () => {
  const mockMode = useFlag('mockData');
  if (!mockMode && !import.meta.env.DEV) return null;

  const toggle = () => {
    setFlagOverride('mockData', !mockMode);
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      title={
        mockMode
          ? 'Showing generated demo data — click to switch to live data'
          : 'Switch to generated demo data (no backend needed)'
      }
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
        mockMode
          ? 'border-warning/50 bg-warning/10 text-warning hover:bg-warning/20'
          : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${mockMode ? 'bg-warning' : 'bg-border'}`}
        aria-hidden="true"
      />
      Demo data
    </button>
  );
};

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Requires an account — shows a lock hint when signed out. */
  gated?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Markets',
    items: [
      { to: '/launches', label: 'Launches', icon: Rocket },
      { to: '/whales', label: 'Whales', icon: Waves, gated: true },
      { to: '/flows', label: 'Exchange flows', icon: ArrowLeftRight, gated: true },
      { to: '/smart-money', label: 'Smart money', icon: Crosshair, gated: true },
    ],
  },
  {
    label: 'Track',
    items: [
      { to: '/portfolio', label: 'Portfolio', icon: Briefcase, gated: true },
      { to: '/alerts', label: 'Alerts', icon: Bell, gated: true },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/analytics', label: 'Analytics', icon: LayoutDashboard, gated: true },
      { to: '/docs', label: 'API docs', icon: BookOpen },
    ],
  },
];

const FOOT_ITEMS: NavItem[] = [
  { to: '/status', label: 'Status', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings, gated: true },
];

const SidebarNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
      isActive
        ? 'bg-surface-2 text-text font-medium'
        : 'text-text-secondary hover:text-text hover:bg-surface-2/60'
    }`;

  const renderItem = (item: NavItem) => (
    <NavLink key={item.to} to={item.to} className={itemClass} end={item.to === '/analytics'}>
      <item.icon className="w-4 h-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">{item.label}</span>
      {item.gated && !isAuthenticated && (
        <Lock className="w-3 h-3 text-text-secondary/60" aria-label="Requires an account" />
      )}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5" aria-label="App navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <h3 className="px-2.5 mb-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary/70">
              {section.label}
            </h3>
            <div className="space-y-0.5">{section.items.map(renderItem)}</div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-border space-y-0.5">
        {FOOT_ITEMS.map(renderItem)}
      </div>
    </div>
  );
};

export const AppShell = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 z-40 bg-surface border-r border-border">
        <Link
          to="/"
          className="flex items-center gap-2 h-12 px-4 border-b border-border text-text text-[15px] font-semibold tracking-tight shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <span className="w-2 h-2 rounded-[3px] bg-primary" aria-hidden="true" />
          CryptoWebb
        </Link>
        <SidebarNav isAuthenticated={isAuthenticated} />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-background/70"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 bg-surface border-r border-border flex flex-col">
            <div className="flex items-center justify-between h-12 px-4 border-b border-border shrink-0">
              <Link to="/" className="flex items-center gap-2 text-text font-semibold tracking-tight">
                <span className="w-2 h-2 rounded-[3px] bg-primary" aria-hidden="true" />
                CryptoWebb
              </Link>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-md text-text-secondary hover:text-text hover:bg-surface-2"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarNav isAuthenticated={isAuthenticated} />
          </aside>
        </>
      )}

      {/* Content column */}
      <div className="lg:pl-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-12 bg-background/85 backdrop-blur border-b border-border flex items-center gap-3 px-3 md:px-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text hover:bg-surface-2"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="hidden sm:block">
            <GlobalSearch onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
          </div>

          <div className="flex-1" />

          <DemoDataChip />
          <ThemeToggle variant="simple" size="sm" showLabel={false} />

          {!isLoading &&
            (isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden md:block text-[13px] text-text-secondary max-w-[11rem] truncate">
                  {user?.firstName || user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={logout} title="Log out">
                  <LogOut size={14} className="md:mr-1.5" aria-hidden="true" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get started</Button>
                </Link>
              </div>
            ))}
        </header>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
};

export default AppShell;
