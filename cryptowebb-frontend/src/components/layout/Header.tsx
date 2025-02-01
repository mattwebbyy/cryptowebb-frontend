// src/components/layout/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm">
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
        </div>
      </nav>
    </header>
  );
};