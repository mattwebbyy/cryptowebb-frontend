import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { API_BASE_URL } from '@/lib/config';

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
          navigate('/settings', { replace: true });
        })
        .catch((err) => {
          console.error('OAuth login error:', err);
          setError('Failed to complete Google authentication');
          navigate('/login', { replace: true });
        })
        .finally(() => {
          setIsProcessingOAuth(false);
        });
      return;
    }

    // --- Fallback: Check for a "code" parameter (if still in use) ---
    const code = searchParams.get('code');
    if (code) {
      setIsProcessingOAuth(true);
      const handleGoogleCallback = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/google/callback?code=${code}`,
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
          await login(data);
          navigate('/settings', { replace: true });
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-text-secondary">
        <div
          className="w-6 h-6 rounded-full border-2 border-border border-t-primary animate-spin"
          aria-hidden="true"
        />
        Completing Google sign-in…
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      await login(data);
      navigate('/settings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/login`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to initiate Google login');

      window.location.href = data.url;
    } catch {
      setError('Failed to initiate Google login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-black/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-text-secondary">Sign in to your CryptoWebb account</p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          type="button"
        >
          <FaGoogle className="mr-2 w-4 h-4" aria-hidden="true" />
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3" role="separator" aria-label="or">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-text-secondary uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="text-sm text-error p-3 rounded-lg border border-error/40 bg-error/10"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to CryptoWebb?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
