import React from 'react';
import { ToastContainer } from 'react-toastify';
import { MatrixRain } from './components/matrix/MatrixRain';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { StripeProvider } from './components/providers/StripeProvider';
import { Routes } from './routes';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>

    <AuthProvider>
      <StripeProvider>
        <div className="app-container">
          <MatrixRain />
          <Layout>
            <Routes />
          </Layout>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </StripeProvider>
    </AuthProvider>
        </HelmetProvider>

  );
}

export default App;