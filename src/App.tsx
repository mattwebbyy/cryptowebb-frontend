// src/App.tsx
import { MatrixRain } from './components/matrix/MatrixRain';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { Routes } from './routes';

function App() {
  return (
    <AuthProvider>
      <>
        <MatrixRain />
        <Layout>
          <Routes />
        </Layout>
      </>
    </AuthProvider>
  );
}

export default App;
