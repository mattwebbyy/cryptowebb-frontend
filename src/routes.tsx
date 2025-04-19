// src/routes.tsx
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import PricingPage from './pages/PricingPage';
import TrialPage from './pages/TrialPage';

// --- Marketing / Public Pages ---
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// --- Auth Pages ---
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
import OAuthCallback from './components/auth/OAuthCallback';

// --- Blog Pages ---
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

// --- User Dashboard Pages ---
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const BlogEditor = lazy(() => import('./pages/blog/BlogEditor'));

// --- Analytics Pages (NEW) ---
const AnalyticsLayout = lazy(() => import('./pages/analytics/AnalyticsLayout'));
const AnalyticsDashboard = lazy(() => import('./pages/analytics/AnalyticsDashboard'));
const DatasourceManager = lazy(() => import('./pages/analytics/DatasourceManager'));
const DashboardManager = lazy(() => import('./pages/analytics/DashboardManager'));
const CipherMatrix = lazy(() => import('./pages/analytics/CipherMatrix'));

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
        <Route path="/trial" element={<TrialPage />} />

        {/* Blog routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="blog">
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>
        </Route>

        {/* Analytics Platform Routes (Completely Separate) */}
        <Route path="/analytics" element={<AnalyticsLayout />}>
          <Route index element={<AnalyticsDashboard />} />
          <Route path="datasources" element={<DatasourceManager />} />
          <Route path="manage" element={<DashboardManager />} />
          <Route path="cipher-matrix" element={<CipherMatrix />} />

        </Route>

      </RouterRoutes>
    </Suspense>
  );
}