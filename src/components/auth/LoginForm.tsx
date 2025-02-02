import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleSignIn = () => {
    // Replace this with your Google auth logic.
    console.log('Google sign in clicked');
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg w-full p-8 border border-matrix-green bg-black/30 shadow-lg "
    >
      <h2 className="text-3xl mb-8 text-center text-matrix-green font-bold px-16">
        System Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-matrix-green text-matrix-green rounded focus:outline-none focus:ring-2 focus:ring-matrix-green"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-matrix-green text-matrix-green rounded focus:outline-none focus:ring-2 focus:ring-matrix-green"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full p-3 bg-matrix-green text-black font-bold rounded hover:bg-matrix-green/90 transition-colors"
        >
          Access System
        </motion.button>
      </form>
      <div className="my-6 text-center text-matrix-green font-semibold">or</div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 p-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
      >
        <FaGoogle size={20} />
        Sign in with Google
      </motion.button>
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/register')}
          className="text-matrix-green hover:text-matrix-green/80 transition-colors"
        >
          Initialize New Account
        </button>
      </div>
    </motion.div>
  );
};
