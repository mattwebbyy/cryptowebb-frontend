// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { RESPONSIVE_CLASSES } from '@/config/responsive';
export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcuts - MUST be before any conditional returns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return <div className="fixed top-0 w-full z-50 backdrop-blur-sm h-20" />;
  }

  // Organize navigation links properly
  const baseNavLinks = ['about', 'projects', 'blog', 'contact', 'pricing'];
  const authenticatedFeatureLinks = ['portfolio', 'alerts', 'live-crypto', 'docs'];
  const authenticatedPlatformLinks = ['settings', 'analytics'];
  
  // All navigation links for desktop
  const allNavLinks = isAuthenticated 
    ? [...baseNavLinks, ...authenticatedFeatureLinks, ...authenticatedPlatformLinks] 
    : baseNavLinks;

  // Using Tailwind's dark: modifier instead of custom logic

  return (
    <header className="fixed top-0 w-full z-[60] backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4 max-w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-teal-600 dark:text-matrix-green text-xl font-bold">
            Cryptowebb
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex gap-6">
              {allNavLinks.map((path) => (
                <motion.div key={path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/${path}`}
                    className={`${location.pathname === `/${path}` 
                      ? 'text-teal-600 dark:text-matrix-green font-bold' 
                      : 'text-teal-500/70 dark:text-matrix-green/70 hover:text-teal-600 dark:hover:text-matrix-green font-semibold'
                    } transition-colors duration-200 capitalize ${path === 'analytics' ? 'flex items-center gap-1' : ''}`}
                  >
                    {path === 'analytics' && <LayoutDashboard size={16} />}
                    {path}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Global Search */}
            <GlobalSearch 
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              className="ml-4"
            />
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex gap-4 items-center">
            {/* Theme Toggle */}
            <ThemeToggle variant="simple" size="md" />
            
            {isAuthenticated ? (
              <>
                {user && <span className="text-white">Hello, {user.firstName || user.email}</span>}
                <button 
                  onClick={logout} 
                  className="text-teal-500/70 dark:text-matrix-green/70 hover:text-teal-600 dark:hover:text-matrix-green transition-colors duration-200"
                  title="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-sm px-4 py-1.5 border border-teal-600 dark:border-matrix-green bg-black/50 dark:bg-black/50 hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 transition-all duration-300 flex items-center gap-2 text-teal-600 dark:text-matrix-green"
                >
                  <span className="w-2 h-2 bg-teal-600 dark:bg-matrix-green rounded-full animate-pulse" />
                  INITIALIZE
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-4 py-1.5 border border-teal-600/50 dark:border-matrix-green/50 hover:border-teal-600 dark:hover:border-matrix-green bg-black/30 dark:bg-black/30 hover:bg-teal-600/10 dark:hover:bg-matrix-green/10 transition-all duration-300 text-teal-600 dark:text-matrix-green"
                >
                  REQUEST ACCESS
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-teal-600 dark:text-matrix-green"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-[80px] left-4 right-4 z-[70] max-h-[calc(100vh-100px)] overflow-y-auto"
            >
              <div className="py-3 bg-white/95 dark:bg-black/[0.98] border border-teal-600/50 dark:border-matrix-green/50 rounded-lg backdrop-blur-md shadow-2xl">
                {/* Theme Toggle for Mobile */}
                <div className="flex justify-center pb-3 border-b border-teal-600/40 dark:border-matrix-green/40 mx-3">
                  <ThemeToggle variant="simple" size="sm" showLabel={false} />
                </div>
                
                {/* Compact Grid Layout for All Navigation */}
                <div className="p-3 space-y-3">
                  {/* Platform Links - 2x3 Grid */}
                  <div>
                    <h4 className="text-xs font-semibold text-teal-600 dark:text-matrix-green uppercase tracking-wider mb-2 text-center">
                      Platform
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {baseNavLinks.map((path) => (
                        <Link
                          key={path}
                          to={`/${path}`}
                          className={`text-center transition-colors duration-200 py-2.5 px-2 capitalize rounded-md min-h-[40px] flex items-center justify-center text-xs font-medium border bg-white/80 dark:bg-black/80 ${
                            location.pathname === `/${path}` 
                              ? 'text-teal-700 dark:text-matrix-green bg-teal-600/25 dark:bg-matrix-green/25 border-teal-600/60 dark:border-matrix-green/60'
                              : 'border-teal-600/30 dark:border-matrix-green/30 text-teal-600 dark:text-matrix-green hover:text-teal-700 dark:hover:text-matrix-green hover:bg-teal-600/15 dark:hover:bg-matrix-green/15 hover:border-teal-600/50 dark:hover:border-matrix-green/50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {path}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Features Navigation */}
                  {isAuthenticated && (
                    <div className="pt-2 border-t border-teal-600/40 dark:border-matrix-green/40">
                      <h4 className="text-xs font-semibold text-teal-600 dark:text-matrix-green uppercase tracking-wider mb-2 text-center">
                        Features
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {authenticatedFeatureLinks.map((path) => (
                          <Link
                            key={path}
                            to={`/${path}`}
                            className={`transition-colors duration-200 py-2.5 px-2 capitalize rounded-md min-h-[40px] flex items-center justify-center gap-1.5 text-xs font-medium border bg-white/80 dark:bg-black/80 ${
                              location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`)
                                ? 'text-teal-700 dark:text-matrix-green bg-teal-600/25 dark:bg-matrix-green/25 border-teal-600/60 dark:border-matrix-green/60'
                                : 'border-teal-600/30 dark:border-matrix-green/30 text-teal-600 dark:text-matrix-green hover:text-teal-700 dark:hover:text-matrix-green hover:bg-teal-600/15 dark:hover:bg-matrix-green/15 hover:border-teal-600/50 dark:hover:border-matrix-green/50'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="font-medium">{path.replace('-', ' ')}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Platform Navigation */}
                  {isAuthenticated && (
                    <div className="pt-2 border-t border-teal-600/40 dark:border-matrix-green/40">
                      <h4 className="text-xs font-semibold text-teal-600 dark:text-matrix-green uppercase tracking-wider mb-2 text-center">
                        Account
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {authenticatedPlatformLinks.map((path) => (
                          <Link
                            key={path}
                            to={`/${path}`}
                            className={`transition-colors duration-200 py-2.5 px-2 capitalize rounded-md min-h-[40px] flex items-center justify-center gap-1.5 text-xs font-medium border bg-white/80 dark:bg-black/80 ${
                              location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`)
                                ? 'text-teal-700 dark:text-matrix-green bg-teal-600/25 dark:bg-matrix-green/25 border-teal-600/60 dark:border-matrix-green/60'
                                : 'border-teal-600/30 dark:border-matrix-green/30 text-teal-600 dark:text-matrix-green hover:text-teal-700 dark:hover:text-matrix-green hover:bg-teal-600/15 dark:hover:bg-matrix-green/15 hover:border-teal-600/50 dark:hover:border-matrix-green/50'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LayoutDashboard size={12} className="text-teal-600 dark:text-matrix-green" />
                            <span className="font-medium">{path}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Authentication Section */}
                  {!isAuthenticated ? (
                    <div className="pt-2 border-t border-teal-600/40 dark:border-matrix-green/40">
                      <h4 className="text-xs font-semibold text-teal-600 dark:text-matrix-green uppercase tracking-wider mb-2 text-center">
                        Access
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/login"
                          className="text-xs px-2 py-2.5 border border-teal-600 dark:border-matrix-green bg-white/80 dark:bg-black/80 hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 transition-all duration-300 rounded-md text-center min-h-[40px] flex items-center justify-center font-medium text-teal-600 dark:text-matrix-green"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          INITIALIZE
                        </Link>
                        <Link
                          to="/register"
                          className="text-xs px-2 py-2.5 border border-teal-600/50 dark:border-matrix-green/50 hover:border-teal-600 dark:hover:border-matrix-green hover:bg-teal-600/15 dark:hover:bg-matrix-green/15 bg-white/80 dark:bg-black/80 transition-all duration-300 rounded-md text-center min-h-[40px] flex items-center justify-center font-medium text-teal-600 dark:text-matrix-green"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          ACCESS
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-teal-600/40 dark:border-matrix-green/40">
                      <div className="px-2 py-1.5 text-white text-xs bg-teal-600/15 dark:bg-matrix-green/15 rounded-md mb-2 text-center">
                        {user?.firstName || user?.email?.split('@')[0]}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-2 py-2.5 text-teal-600 dark:text-matrix-green hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 transition-all duration-300 rounded-md min-h-[40px] flex items-center justify-center border border-teal-600/40 dark:border-matrix-green/40 font-medium text-xs bg-white/80 dark:bg-black/80"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </header>
  );
};
