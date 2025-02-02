// src/routes.tsx
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));   // This should contain your LoginForm component (with BackButton)
const Signup = lazy(() => import('./pages/Signup')); // This should contain your Signup component (with BackButton)

export function Routes() {
  return (
    <Suspense fallback={<MatrixLoader />}>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </RouterRoutes>
    </Suspense>
  );
}
