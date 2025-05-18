// src/routes.tsx
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader'; // Using '@/' alias as in your example
import PricingPage from './pages/PricingPage';
import TrialPage from './pages/TrialPage';
// Guards - if you use them, ensure they are compatible with JSX routes
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import AdminRoute from './components/auth/AdminRoute';

// --- Marketing / Public Pages ---
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// --- Auth Pages ---
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
import OAuthCallback from './components/auth/OAuthCallback'; // Kept as non-lazy per your example

// --- Blog Pages ---
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

// --- User Dashboard Pages ---
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings')); // API Keys are managed here
const ReferralsPage = lazy(() => import('./pages/dashboard/Referrals')); // Added Referrals page (filename Referrals.tsx)
const BlogEditor = lazy(() => import('./pages/blog/BlogEditor'));

// --- Analytics Pages ---
const AnalyticsLayout = lazy(() => import('./pages/analytics/AnalyticsLayout'));
const AnalyticsDashboard = lazy(() => import('./pages/analytics/AnalyticsDashboard'));
const DatasourceManager = lazy(() => import('./pages/analytics/DatasourceManager'));
const DashboardManager = lazy(() => import('./pages/analytics/DashboardManager'));
const CipherMatrix = lazy(() => import('./pages/analytics/CipherMatrix'));
const DataMetricChartPage = lazy(() => import('@/pages/analytics/DataMetricChartPage'));

// --- Not Found Page ---
const NotFound = lazy(() => import('./pages/NotFound')); // Assuming you have this page

export function Routes() {
  // Note: For protected routes like /dashboard and /analytics, you would typically wrap
  // their 'element' prop with your ProtectedRoute component.
  // Example: element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
  // I'm keeping it as you provided for now, focusing on adding the referral route.
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
        <Route path="/register" element={<Signup />} /> {/* Path as per your JSX example */}
        <Route path="/oauth/callback" element={<OAuthCallback />} /> {/* Path as per your JSX example */}

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} /> {/* API Keys are managed within this Settings page */}
          <Route path="referrals" element={<ReferralsPage />} /> {/* ADDED: Referrals Route */}
          <Route path="blog"> {/* Blog editor under dashboard as per your JSX example */}
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>
        </Route>

        {/* Analytics Platform Routes */}
        <Route path="/analytics" element={<AnalyticsLayout />}>
          <Route index element={<AnalyticsDashboard />} />
          <Route path="datasources" element={<DatasourceManager />} />
          <Route path="manage" element={<DashboardManager />} />
          <Route path="cipher-matrix" element={<CipherMatrix />} />
          <Route path="metrics/:metricId" element={<DataMetricChartPage />} />

        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Suspense>
  );
}