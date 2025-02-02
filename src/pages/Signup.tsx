// src/pages/Signup.tsx
import React from 'react';
import BackButton from '@/components/ui/BackButton';
import { FloatingIcons } from '@/components/matrix/FloatingIcons';
import { RegisterForm } from '@/components/auth/RegisterForm';

const SignupPage = () => {
  return (
    <>
      <FloatingIcons />
      <BackButton /> {/* This will navigate back to home */}
      <div className="min-h-screen flex items-center justify-center">
        <RegisterForm />
      </div>
    </>
  );
};

export default SignupPage;
