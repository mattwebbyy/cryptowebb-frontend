// src/pages/analytics/AnalyticsLayout.tsx
import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Database, LayoutDashboard, ChevronLeft, Menu, X ,Eye, Settings, InfoCircle, FaCreditCard, FaTimes, FaInfoCircle, FaCheck } from 'lucide-react'; // Added missing icons from previous examples

const AnalyticsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    // ADDED w-full HERE, removed w-screen previously
    <div className="h-screen w-full flex flex-col overflow-hidden bg-black/50 text-matrix-green">
      {/* Top header bar */}
      <header className="flex items-center justify-between h-12 border-b border-matrix-green/50 bg-black/50 px-4 flex-shrink-0">
        <div className="flex items-center min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 mr-3 rounded hover:bg-matrix-green/20 flex-shrink-0"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-mono font-bold tracking-wide truncate">CRYPTOWEBB ANALYTICS TERMINAL</h1>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <NavLink to="/" className="p-1 rounded hover:bg-matrix-green/20" title="Back to Home">
            <Home size={18} />
          </NavLink>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden"> {/* This handles sidebar + main */}
        {/* Collapsible sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'w-48' : 'w-0'}
            border-r border-matrix-green/50 bg-black/50
            transition-all duration-200 ease-in-out
            overflow-hidden flex flex-col flex-shrink-0
          `}
        >
          {/* Only render content when open for smoother transition */}
          {sidebarOpen && (
              <div className="p-3 flex-1 overflow-y-auto">
                <nav>
                  <ul className="space-y-1">
                    <li>
                      <NavLink
                        to="/analytics"
                        end
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded whitespace-nowrap ${isActive
                            ? 'bg-matrix-green/20 text-matrix-green font-medium'
                            : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                        }
                      >
                        <LayoutDashboard size={18} className="mr-2 flex-shrink-0" />
                        <span>Dashboards</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/analytics/datasources"
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded whitespace-nowrap ${isActive
                            ? 'bg-matrix-green/20 text-matrix-green font-medium'
                            : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                        }
                      >
                        <Database size={18} className="mr-2 flex-shrink-0" />
                        <span>Data Sources</span>
                      </NavLink>
                    </li>
                     <li>
                       <NavLink
                         to="/analytics/cipher-matrix"
                          className={({ isActive }) =>
                            `flex items-center p-2 rounded whitespace-nowrap ${isActive
                              ? 'bg-matrix-green/20 text-matrix-green font-medium'
                              : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                          }
                       >
                         <Eye size={18} className="mr-2 flex-shrink-0" />
                         <span>Cipher Matrix</span>
                       </NavLink>
                     </li>
                    <li>
                      <NavLink
                        to="/analytics/manage"
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded whitespace-nowrap ${isActive
                            ? 'bg-matrix-green/20 text-matrix-green font-medium'
                            : 'text-matrix-green/70 hover:bg-matrix-green/10 hover:text-matrix-green'}`
                        }
                      >
                        {/* Assuming you might want a Settings icon here */}
                        <Settings size={18} className="mr-2 flex-shrink-0" />
                        <span>Manage</span>
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
          )}
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-black/50 min-w-0">
          {/* overflow-auto allows scrolling WITHIN main if Outlet content overflows */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AnalyticsLayout;