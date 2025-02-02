// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login upon successful registration
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full p-6 border border-matrix-green bg-black/30"
    >
      <h2 className="text-2xl mb-6 text-center text-matrix-green">
        Initialize New Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 bg-black border border-matrix-green text-matrix-green"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 bg-black border border-matrix-green text-matrix-green"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-black border border-matrix-green text-matrix-green"
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
            className="w-full p-2 bg-black border border-matrix-green text-matrix-green"
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
          className="w-full p-2 bg-matrix-green text-black font-bold hover:bg-matrix-green/90"
          type="submit"
        >
          Initialize System Access
        </motion.button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-matrix-green hover:text-matrix-green/80"
        >
          Return to Login
        </button>
      </div>
    </motion.div>
  );
};
