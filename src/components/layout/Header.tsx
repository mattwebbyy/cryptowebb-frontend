// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { CommandPalette } from '@/components/ui/CommandPalette';

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
  const authenticatedLinks = ['dashboard', 'analytics'];
  
  // All navigation links for desktop
  const allNavLinks = isAuthenticated 
    ? [...baseNavLinks, ...authenticatedLinks] 
    : baseNavLinks;
    
  // Debug logging
  console.log('Header: isAuthenticated =', isAuthenticated);
  console.log('Header: authenticatedLinks =', authenticatedLinks);
  console.log('Header: allNavLinks =', allNavLinks);

  return (
    <header className="fixed top-0 w-full z-[60] backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-matrix-green text-xl font-bold">
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
                    className={`text-matrix-green/70 hover:text-matrix-green transition-colors duration-200 capitalize ${
                      location.pathname === `/${path}` ? 'text-matrix-green font-semibold' : ''
                    } ${path === 'analytics' ? 'flex items-center gap-1' : ''}`}
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
                  className="text-matrix-green/70 hover:text-matrix-green transition-colors duration-200" 
                  title="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-sm px-4 py-1.5 border border-matrix-green bg-black/50 hover:bg-matrix-green/20 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" />
                  INITIALIZE
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-4 py-1.5 border border-matrix-green/50 hover:border-matrix-green bg-black/30 hover:bg-matrix-green/10 transition-all duration-300"
                >
                  REQUEST ACCESS
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-matrix-green"
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
              className="md:hidden absolute top-full left-0 right-0 z-[70]"
            >
              <div className="py-4 space-y-2 bg-black/98 mt-4 border border-matrix-green rounded-lg p-4 backdrop-blur-md shadow-2xl mx-4 max-h-[calc(100vh-120px)] overflow-y-auto pb-8">
                {/* Theme Toggle for Mobile */}
                <div className="flex justify-center pb-3 border-b border-matrix-green/30">
                  <ThemeToggle variant="simple" size="md" showLabel={true} />
                </div>
                
                {/* Base Navigation */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-matrix-green/60 uppercase tracking-wider mb-2 px-3">
                    Platform
                  </h4>
                  {baseNavLinks.map((path) => (
                    <Link
                      key={path}
                      to={`/${path}`}
                      className={`block text-matrix-green/70 hover:text-matrix-green transition-colors duration-200 p-3 capitalize rounded-lg min-h-[44px] flex items-center ${
                        location.pathname === `/${path}` ? 'text-matrix-green font-semibold bg-matrix-green/20' : 'hover:bg-matrix-green/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {path}
                    </Link>
                  ))}
                </div>
                
                {/* Authenticated Navigation */}
                {isAuthenticated && (
                  <div className="space-y-1 pt-3 border-t border-matrix-green/30">
                    <h4 className="text-xs font-semibold text-matrix-green uppercase tracking-wider mb-2 px-3 bg-matrix-green/10 rounded py-1">
                      User Area ({authenticatedLinks.length} items)
                    </h4>
                    {authenticatedLinks.map((path) => (
                      <Link
                        key={path}
                        to={`/${path}`}
                        className={`block text-matrix-green hover:text-matrix-green transition-colors duration-200 p-3 capitalize rounded-lg min-h-[44px] flex items-center gap-2 border border-matrix-green/20 ${
                          location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`) ? 'text-matrix-green font-semibold bg-matrix-green/20 border-matrix-green/40' : 'hover:bg-matrix-green/15 hover:border-matrix-green/30'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} className="text-matrix-green" />
                        <span className="font-medium">{path}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {!isAuthenticated ? (
                  <div className="space-y-2 pt-3 border-t border-matrix-green/30">
                    <Link
                      to="/login"
                      className="block text-sm px-4 py-3 border border-matrix-green bg-black/50 hover:bg-matrix-green/20 transition-all duration-300 rounded-lg text-center min-h-[44px] flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      INITIALIZE
                    </Link>
                    <Link
                      to="/register"
                      className="block text-sm px-4 py-3 border border-matrix-green/50 hover:border-matrix-green bg-black/30 hover:bg-matrix-green/10 transition-all duration-300 rounded-lg text-center min-h-[44px] flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REQUEST ACCESS
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 pt-3 border-t border-matrix-green/30">
                    <div className="px-4 py-2 text-white text-sm bg-matrix-green/10 rounded-lg">
                      Hello, {user?.firstName || user?.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-matrix-green hover:bg-matrix-green/20 transition-all duration-300 rounded-lg min-h-[44px] flex items-center"
                    >
                      Logout
                    </button>
                  </div>
                )}
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
