import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import BackButton from '@/components/ui/BackButton';

const LoginPage = () => {
  return (
    <>
      <BackButton /> {/* Navigates to home or previous route */}
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
