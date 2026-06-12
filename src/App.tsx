import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { StripeProvider } from './components/providers/StripeProvider';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Routes } from './routes';
import { HelmetProvider } from 'react-helmet-async';

// Matrix rain only loads (and only costs bytes) under the matrix easter-egg theme.
const MatrixRain = lazy(() =>
  import('./components/matrix/MatrixRain').then((m) => ({ default: m.MatrixRain }))
);

const MatrixRainGate = () => {
  const { theme } = useTheme();
  if (theme.variant !== 'matrix') return null;
  return (
    <Suspense fallback={null}>
      <MatrixRain />
    </Suspense>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <StripeProvider>
            <div className="app-container w-full overflow-x-hidden">
              <MatrixRainGate />
              <Layout>
                <Routes />
              </Layout>
              <Toaster position="bottom-right" richColors closeButton theme="dark" />
            </div>
          </StripeProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
