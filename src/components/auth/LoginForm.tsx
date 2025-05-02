import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // --- Option 1: Check if token data is in the URL (from backend redirect) ---
    const token = searchParams.get('token');
    if (token) {
      // Build the auth response object from the URL query parameters
      const authData = {
        token,
        refreshToken: searchParams.get('refreshToken') || '',
        type: searchParams.get('type') || 'Bearer',
        user: {
          id: searchParams.get('id') || '',
          email: searchParams.get('email') || '',
          firstName: searchParams.get('firstName') || '',
          lastName: searchParams.get('lastName') || '',
          role: searchParams.get('role') || '',
          avatarUrl: searchParams.get('avatarUrl') || '',
        },
      };

      setIsProcessingOAuth(true);
      login(authData)
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch((err) => {
          console.error('OAuth login error:', err);
          setError('Failed to complete Google authentication');
          navigate('/login', { replace: true });
        })
        .finally(() => {
          setIsProcessingOAuth(false);
        });
      return; // No need to process further if token was found
    }

    // --- Fallback: Check for a "code" parameter (if still in use) ---
    const code = searchParams.get('code');
    if (code) {
      setIsProcessingOAuth(true);
      const handleGoogleCallback = async () => {
        try {
          console.log('Handling Google callback with code:', code);
          const response = await fetch(
            `http://localhost:8080/api/v1/auth/google/callback?code=${code}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Authentication failed');
          }

          const data = await response.json();
          console.log('Google auth response:', data);
          await login(data);
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Google auth error:', err);
          setError('Failed to complete Google authentication');
          navigate('/login', { replace: true });
        } finally {
          setIsProcessingOAuth(false);
        }
      };

      handleGoogleCallback();
    }
  }, [location, login, navigate]);

  if (isProcessingOAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-matrix-green text-center">
          <div className="mb-4">Processing Google Authentication...</div>
          {/* You could add a loading spinner here if desired */}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      await login(data); // Save tokens and user data to localStorage
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/google/login');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to initiate Google login');

      // Redirect the user to the Google OAuth page.
      window.location.href = data.url;
    } catch (err) {
      setError('Failed to initiate Google login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg w-full p-8 border border-matrix-green bg-black/30 shadow-lg"
    >
      <h2 className="text-3xl mb-8 text-center text-matrix-green font-bold px-16">System Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-matrix-green text-matrix-green rounded focus:outline-none focus:ring-2 focus:ring-matrix-green"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-matrix-green text-matrix-green rounded focus:outline-none focus:ring-2 focus:ring-matrix-green"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full p-3 bg-matrix-green text-black font-bold rounded hover:bg-matrix-green/90 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Authenticating...' : 'Access System'}
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
