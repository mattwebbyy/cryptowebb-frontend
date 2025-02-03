import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="fixed top-0 w-full z-50 backdrop-blur-sm h-20" />;
  }

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-matrix-green text-xl font-bold">
            MATRIX
          </Link>

          <div className="flex gap-6">
            {['about', 'projects', 'contact'].map((path) => (
              <motion.div
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/${path}`}
                  className={`matrix-button capitalize ${
                    location.pathname === `/${path}` ? 'bg-matrix-green/20' : ''
                  }`}
                >
                  {path}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
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
              <div 
                className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 fade-in"
                style={{ animationDelay: '0.3s' }}
              >
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
        </div>
      </nav>
    </header>
  );
};