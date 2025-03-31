// src/routes.tsx
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import PricingPage from './pages/PricingPage';
import TrialPage from './pages/TrialPage';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute'; // Keep the import if you uncomment later

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

// --- Dashboard Pages ---
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
// const DashboardHome = lazy(() => import('./pages/dashboard/Dashboard')); // Original dashboard home (can remove import if not used)
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const BlogEditor = lazy(() => import('./pages/blog/BlogEditor'));
const AnalyticsDashboard = lazy(() => import('./pages/dashboard/AnalyticsDashboard'));
const DatasourceManager = lazy(() => import('./pages/dashboard/DatasourceManager'));
const DashboardManager = lazy(() => import('./pages/dashboard/DashboardManager'));

// --- Other ---
// const NotFound = lazy(() => import('./pages/NotFound'));

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

        {/* --- Dashboard Routes (Temporarily UNPROTECTED) --- */}
        {/* WARNING: Removed <ProtectedRoute> wrapper for development viewing */}
        <Route
          path="/dashboard"
          element={
             // <ProtectedRoute> // <<< Temporarily commented out / removed
                <DashboardLayout />
             // </ProtectedRoute> // <<< Temporarily commented out / removed
          }
        >
          {/* Redirect base /dashboard to the main analytics view */}
          <Route index element={<Navigate to="analytics" replace />} />

          {/* DAaaS Features */}
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="datasources" element={<DatasourceManager />} />
          <Route path="manage" element={<DashboardManager />} />

          {/* Other Dashboard Sections */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          {/* Blog management routes (will also be unprotected now) */}
          <Route path="blog">
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>

        </Route> {/* --- End Dashboard Routes --- */}

        {/* Optional: Catch-all 404 Not Found Route */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </RouterRoutes>
    </Suspense>
  );
}