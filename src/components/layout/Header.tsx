// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="fixed top-0 w-full z-50 backdrop-blur-sm h-20" />;
  }

  // Add base nav links
  const navLinks = ['about', 'projects', 'blog', 'contact', 'pricing'];
  
  // Add authenticated-only links
  if (isAuthenticated) {
    navLinks.push('dashboard');
    navLinks.push('analytics'); // Add analytics link for authenticated users
  }

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-matrix-green text-xl font-bold">
            Cryptowebb
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((path) => (
              <motion.div
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/${path}`}
                  className={`matrix-button capitalize ${
                    location.pathname === `/${path}` ? 'bg-matrix-green/20' : ''
                  } ${path === 'analytics' ? 'flex items-center gap-1' : ''}`}
                >
                  {path === 'analytics' && <LayoutDashboard size={16} />}
                  {path}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <span className="text-white">
                    Hello, {user.firstName || user.email}
                  </span>
                )}
                <button 
                  onClick={logout} 
                  className="matrix-button"
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4 bg-black/90 mt-4 border border-matrix-green rounded-lg p-4">
                {navLinks.map((path) => (
                  <Link
                    key={path}
                    to={`/${path}`}
                    className={`block matrix-button capitalize ${
                      location.pathname === `/${path}` ? 'bg-matrix-green/20' : ''
                    } ${path === 'analytics' ? 'flex items-center gap-2' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {path === 'analytics' && <LayoutDashboard size={16} />}
                    {path}
                  </Link>
                ))}
                {!isAuthenticated ? (
                  <div className="space-y-2 pt-2 border-t border-matrix-green/30">
                    <Link
                      to="/login"
                      className="block text-sm px-4 py-2 border border-matrix-green bg-black/50 hover:bg-matrix-green/20 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      INITIALIZE
                    </Link>
                    <Link
                      to="/register"
                      className="block text-sm px-4 py-2 border border-matrix-green/50 hover:border-matrix-green bg-black/30 hover:bg-matrix-green/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REQUEST ACCESS
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-matrix-green/30">
                    <span className="block text-white px-4">
                      Hello, {user?.firstName || user?.email}
                    </span>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-matrix-green hover:bg-matrix-green/20 transition-all duration-300"
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
    </header>
  );
};