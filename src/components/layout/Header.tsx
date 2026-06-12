// src/components/layout/Header.tsx — app topbar (logo · nav · search · theme · auth)
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Button } from '@/components/ui/Button';

const baseNavLinks = ['about', 'projects', 'blog', 'contact', 'pricing'];
const authenticatedFeatureLinks = ['portfolio', 'alerts', 'live-crypto', 'tokens', 'docs'];
const authenticatedPlatformLinks = ['settings', 'analytics'];

const linkLabel = (path: string) => path.replace('-', ' ');

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K opens the command palette — must register before any returns
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

  // Close the mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return <div className="fixed top-0 w-full z-50 h-16 bg-background/80 backdrop-blur border-b border-border" />;
  }

  const allNavLinks = isAuthenticated
    ? [...baseNavLinks, ...authenticatedFeatureLinks, ...authenticatedPlatformLinks]
    : baseNavLinks;

  const isActive = (path: string) =>
    location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`);

  const navLinkClass = (path: string) =>
    `capitalize text-sm transition-colors duration-150 rounded-md px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
      isActive(path)
        ? 'text-text font-semibold'
        : 'text-text-secondary hover:text-text'
    }`;

  return (
    <header className="fixed top-0 w-full z-[60] bg-background/80 backdrop-blur border-b border-border">
      <nav className="mx-auto px-4 h-16 flex items-center gap-4 max-w-screen-2xl" aria-label="Main navigation">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text text-lg font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-primary" aria-hidden="true" />
          CryptoWebb
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 ml-4 min-w-0 overflow-x-auto">
          {allNavLinks.map((path) => (
            <Link key={path} to={`/${path}`} className={navLinkClass(path)}>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                {path === 'analytics' && <LayoutDashboard size={15} aria-hidden="true" />}
                {linkLabel(path)}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:block flex-1" />

        {/* Search */}
        <div className="hidden md:block">
          <GlobalSearch onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        </div>

        {/* Desktop auth + theme */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle variant="simple" size="md" />

          {isAuthenticated ? (
            <>
              <span className="text-sm text-text-secondary max-w-[12rem] truncate">
                {user?.firstName || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} title="Log out">
                <LogOut size={15} className="mr-1.5" aria-hidden="true" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden ml-auto text-text p-2 rounded-md hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-[70] max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border bg-surface shadow-lg"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <ThemeToggle variant="simple" size="sm" showLabel={false} />
                {isAuthenticated && (
                  <span className="text-sm text-text-secondary truncate">
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                )}
              </div>

              <nav aria-label="Mobile navigation" className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Platform
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {baseNavLinks.map((path) => (
                      <Link
                        key={path}
                        to={`/${path}`}
                        className={`capitalize text-sm rounded-md px-3 py-2.5 border transition-colors ${
                          isActive(path)
                            ? 'bg-primary/10 border-primary/40 text-text font-medium'
                            : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        {linkLabel(path)}
                      </Link>
                    ))}
                  </div>
                </div>

                {isAuthenticated && (
                  <>
                    <div>
                      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        Features
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {authenticatedFeatureLinks.map((path) => (
                          <Link
                            key={path}
                            to={`/${path}`}
                            className={`capitalize text-sm rounded-md px-3 py-2.5 border transition-colors ${
                              isActive(path)
                                ? 'bg-primary/10 border-primary/40 text-text font-medium'
                                : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
                            }`}
                          >
                            {linkLabel(path)}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        Account
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {authenticatedPlatformLinks.map((path) => (
                          <Link
                            key={path}
                            to={`/${path}`}
                            className={`capitalize text-sm rounded-md px-3 py-2.5 border transition-colors ${
                              isActive(path)
                                ? 'bg-primary/10 border-primary/40 text-text font-medium'
                                : 'border-border text-text-secondary hover:text-text hover:bg-surface-2'
                            }`}
                          >
                            {linkLabel(path)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {isAuthenticated ? (
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut size={15} className="mr-2" aria-hidden="true" />
                    Logout
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="contents">
                      <Button variant="outline" className="w-full">Sign in</Button>
                    </Link>
                    <Link to="/register" className="contents">
                      <Button variant="primary" className="w-full">Get started</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </header>
  );
};
