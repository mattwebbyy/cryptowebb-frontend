// src/routes.tsx
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import PricingPage from './pages/PricingPage';
import TrialPage from './pages/TrialPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MarketingLayout } from './components/layout/MarketingLayout';
import AppShell from './components/layout/AppShell';

// --- Marketing / Public Pages ---
const Home = lazy(() => import('./pages/Home'));
const DesignPlayground = lazy(() => import('./pages/DesignPlayground'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// --- Auth Pages ---
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
import OAuthCallback from './components/auth/OAuthCallback';

// --- Blog Pages ---
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

// --- User Settings Pages ---
const SettingsLayout = lazy(() => import('./pages/settings/SettingsLayout'));
const SettingsOverview = lazy(() => import('./pages/settings/SettingsOverview'));
const Profile = lazy(() => import('./pages/settings/Profile'));
const ApiSettings = lazy(() => import('./pages/settings/Settings'));
const ReferralsPage = lazy(() => import('./pages/settings/Referrals'));
const BlogEditor = lazy(() => import('./pages/blog/BlogEditor'));

// --- Analytics Workspace ---
const AnalyticsLayout = lazy(() => import('./pages/analytics/AnalyticsLayout'));
const AnalyticsDashboard = lazy(() => import('./pages/analytics/AnalyticsDashboard'));
const MetricsCatalog = lazy(() => import('./pages/analytics/MetricsCatalog'));
const DatasourceManager = lazy(() => import('./pages/analytics/DatasourceManager'));
const DashboardManager = lazy(() => import('./pages/analytics/DashboardManager'));
const DataMetricChartPage = lazy(() => import('@/pages/analytics/DataMetricChartPage'));

// --- Top-level Feature Pages ---
const AlertsPage = lazy(() => import('./pages/alerts/AlertsPage'));
const LiveCryptoPage = lazy(() => import('./pages/live-crypto/LiveCryptoPage'));
const PortfolioPage = lazy(() => import('./pages/portfolio/PortfolioPage'));
const ApiDocumentation = lazy(() => import('./pages/docs/ApiDocumentation'));

// --- Blockchain Intelligence Pages (indexer-backed) ---
const LaunchFeedPage = lazy(() => import('./pages/launches/LaunchFeedPage'));
const WhalesPage = lazy(() => import('./pages/whales/WhalesPage'));
const FlowsPage = lazy(() => import('./pages/flows/FlowsPage'));
const SmartMoneyPage = lazy(() => import('./pages/smart-money/SmartMoneyPage'));
const TokenPage = lazy(() => import('./pages/token/TokenPage'));
const WalletPage = lazy(() => import('./pages/wallet/WalletPage'));
const StatusPage = lazy(() => import('./pages/status/StatusPage'));

// --- Shared / Embedded Dashboards (public, no chrome) ---
const PublicDashboard = lazy(() => import('./pages/shared/PublicDashboard'));
const EmbedDashboard = lazy(() => import('./pages/shared/EmbedDashboard'));

// --- Payment Pages ---
const CryptoPaymentSuccess = lazy(() => import('./pages/payment/CryptoPaymentSuccess'));
const CryptoPaymentCancel = lazy(() => import('./pages/payment/CryptoPaymentCancel'));

// --- Not Found Page ---
const NotFound = lazy(() => import('./pages/NotFound'));

export function Routes() {
  return (
    <Suspense fallback={<MatrixLoader />}>
      <RouterRoutes>
        {/* Marketing shell: top navbar + footer */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<DesignPlayground />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trial" element={<TrialPage />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Payment results */}
          <Route path="/payment/crypto/success" element={<CryptoPaymentSuccess />} />
          <Route path="/payment/crypto/cancel" element={<CryptoPaymentCancel />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* App shell: left sidebar product frame */}
        <Route element={<AppShell />}>
          {/* Public top of funnel */}
          <Route path="/launches" element={<LaunchFeedPage />} />
          <Route path="/token/:address" element={<TokenPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/docs" element={<ApiDocumentation />} />
          <Route path="/live-crypto" element={<LiveCryptoPage />} />

          {/* Account required (pro surfaces) */}
          <Route path="/whales" element={<ProtectedRoute><WhalesPage /></ProtectedRoute>} />
          <Route path="/flows" element={<ProtectedRoute><FlowsPage /></ProtectedRoute>} />
          <Route path="/smart-money" element={<ProtectedRoute><SmartMoneyPage /></ProtectedRoute>} />
          <Route path="/wallet/:address" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />

          {/* Analytics workspace */}
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsLayout /></ProtectedRoute>}>
            <Route index element={<AnalyticsDashboard />} />
            <Route path="metrics" element={<MetricsCatalog />} />
            <Route path="metrics/:metricId" element={<DataMetricChartPage />} />
            <Route path="datasources" element={<DatasourceManager />} />
            <Route path="manage" element={<DashboardManager />} />
          </Route>

          {/* Settings */}
          <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
            <Route index element={<SettingsOverview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="api" element={<ApiSettings />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="blog">
              <Route path="new" element={<BlogEditor />} />
              <Route path="edit/:id" element={<BlogEditor />} />
            </Route>
          </Route>
        </Route>

        {/* Bare (no chrome): shared/embedded dashboards */}
        <Route path="/shared/:shareToken" element={<PublicDashboard />} />
        <Route path="/embed/:shareToken" element={<EmbedDashboard />} />

        {/* Retired routes → new homes */}
        <Route path="/projects" element={<Navigate to="/about" replace />} />
        <Route path="/tokens" element={<Navigate to="/launches" replace />} />
        <Route path="/blockchain" element={<Navigate to="/status" replace />} />
        <Route path="/analytics/cipher-matrix" element={<Navigate to="/launches" replace />} />
      </RouterRoutes>
    </Suspense>
  );
}
