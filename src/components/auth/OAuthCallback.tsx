// src/components/auth/OAuthCallback.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
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

      login(authData)
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch((err) => {
          console.error('Error during OAuth callback:', err);
          navigate('/login', { replace: true });
        });
    } else {
      // No token found? Redirect to login.
      navigate('/login', { replace: true });
    }
  }, [location, login, navigate]);

  return <div>Processing authentication...</div>;
};

export default OAuthCallback;
