// src/components/layout/Header.tsx — marketing topbar (logo · product links · auth).
// Deliberately minimal: the data product lives in AppShell's sidebar, and
// secondary pages (blog, docs, about, contact) live in the footer.
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { to: '/launches', label: 'Launches' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
];

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return <div className="fixed top-0 w-full z-50 h-16 bg-background/80 backdrop-blur border-b border-border" />;
  }

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="fixed top-0 w-full z-[60] bg-background/80 backdrop-blur border-b border-border">
      <nav className="mx-auto px-4 h-16 flex items-center gap-6 max-w-6xl" aria-label="Main navigation">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text text-[15px] font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
        >
          <span className="w-2 h-2 rounded-[3px] bg-primary" aria-hidden="true" />
          CryptoWebb
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm rounded-md px-2.5 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isActive(link.to)
                  ? 'text-text font-medium'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Desktop auth + theme */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle variant="simple" size="sm" showLabel={false} />
          {isAuthenticated ? (
            <Link to="/launches">
              <Button variant="primary" size="sm">
                Open app
                <ArrowRight size={14} className="ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
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
          className="md:hidden ml-auto text-text p-2 rounded-md hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="md:hidden fixed top-16 left-0 right-0 z-[70] border-b border-border bg-surface shadow-lg"
          >
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block text-sm rounded-md px-3 py-2.5 transition-colors ${
                      isActive(link.to)
                        ? 'bg-surface-2 text-text font-medium'
                        : 'text-text-secondary hover:text-text hover:bg-surface-2'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <ThemeToggle variant="simple" size="sm" showLabel={false} />
                {isAuthenticated ? (
                  <Link to="/launches">
                    <Button variant="primary" size="sm">
                      Open app
                      <ArrowRight size={14} className="ml-1.5" aria-hidden="true" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm">Sign in</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">Get started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
