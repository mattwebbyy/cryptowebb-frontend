// src/pages/NotFound.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl mb-4 glitch-text" data-text="404">
          404
        </h1>
        <p className="text-2xl mb-8">SYSTEM ERROR: Path Not Found</p>
        <div className="space-y-4">
          <p className="text-matrix-green/70">
            The requested path has been disconnected from the Matrix.
          </p>
          <Link
            to="/"
            className="matrix-button inline-block hover:bg-matrix-green hover:text-black transition-colors"
          >
            RETURN TO MAINFRAME
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
