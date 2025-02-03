import React from 'react';
import { ToastContainer } from 'react-toastify';
import { MatrixRain } from './components/matrix/MatrixRain';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { Routes } from './routes';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;