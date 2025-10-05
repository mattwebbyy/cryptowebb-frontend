import { ToastContainer } from 'react-toastify';
import { MatrixRain } from './components/matrix/MatrixRain';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './hooks/useAuth';
import { StripeProvider } from './components/providers/StripeProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { Routes } from './routes';
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StripeProvider>
          <div className="app-container w-full overflow-x-hidden">
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
    </ThemeProvider>
  );
}

export default App;
