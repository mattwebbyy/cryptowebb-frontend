// src/routes.tsx
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import PricingPage from './pages/PricingPage';

// Lazy load marketing and auth pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Lazy load blog pages
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));
const BlogEditor = lazy(() => import('./pages/blog/BlogEditor')); // Add this line

// Lazy load dashboard pages (nested routes)
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
import OAuthCallback from './components/auth/OAuthCallback';

export function Routes() {
  return (
    <Suspense fallback={<MatrixLoader />}>
      <RouterRoutes>
        {/* Marketing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Blog routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Dashboard nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Blog management routes */}
          <Route path="blog">
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>
        </Route>
      </RouterRoutes>
    </Suspense>
  );
}