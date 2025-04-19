// src/pages/analytics/AnalyticsLayout.tsx
import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Database, LayoutDashboard, ChevronLeft, Menu, X ,Eye} from 'lucide-react';

const AnalyticsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black text-matrix-green">
      {/* Top header bar */}
      <header className="flex items-center justify-between h-12 border-b border-matrix-green/50 bg-black px-4">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 mr-3 rounded hover:bg-matrix-green/20"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-mono font-bold tracking-wide">CRYPTOWEBB ANALYTICS TERMINAL</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="p-1 rounded hover:bg-matrix-green/20" title="Back to Home">
            <Home size={18} />
          </NavLink>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible sidebar */}
        <aside 
          className={`${sidebarOpen ? 'w-48' : 'w-0'} border-r border-matrix-green/50 bg-black transition-all duration-200 overflow-hidden flex flex-col`}
        >
          <div className="p-3 flex-1 overflow-y-auto">
            <nav>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/analytics"
                    end
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded ${isActive 
                        ? 'bg-matrix-green/20 text-matrix-green font-medium' 
                        : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                    }
                  >
                    <LayoutDashboard size={18} className="mr-2" />
                    <span>Dashboards</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/analytics/datasources"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded ${isActive 
                        ? 'bg-matrix-green/20 text-matrix-green font-medium' 
                        : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                    }
                  >
                    <Database size={18} className="mr-2" />
                    <span>Data Sources</span>
                  </NavLink>
                </li>
                <li>
  <NavLink
    to="/analytics/cipher-matrix"
    className={({ isActive }) =>
      `flex items-center p-2 rounded ${isActive 
        ? 'bg-matrix-green/20 text-matrix-green font-medium' 
        : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
    }
  >
    <Eye size={18} className="mr-2" /> {/* Import Eye from lucide-react */}
    <span>Cipher Matrix</span>
  </NavLink>
</li>
                <li>
                  <NavLink
                    to="/analytics/manage"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded ${isActive 
                        ? 'bg-matrix-green/20 text-matrix-green font-medium' 
                        : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                    }
                  >
                    <LayoutDashboard size={18} className="mr-2" />
                    <span>Manage</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 overflow-hidden bg-black/90">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;