// src/pages/dashboard/DashboardLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';
import { User, Settings as SettingsIcon, Home, Share2 } from 'lucide-react'; // Added Share2 icon

const DashboardLayout = () => {
  return (
    <div className="min-h-screen text-matrix-green">
      <header className="p-4 border-b border-matrix-green">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
      </header>
      <div className="flex">
        <aside className="w-64 p-4 border-r border-matrix-green">
          <nav>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-matrix-green">Account Management</h3>
              <ul className="space-y-3">
                <li>
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 ${
                        isActive
                          ? 'text-matrix-green font-medium'
                          : 'text-matrix-green/70 hover:text-matrix-green'
                      }`
                    }
                  >
                    <Home size={18} />
                    <span>Overview</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 ${
                        isActive
                          ? 'text-matrix-green font-medium'
                          : 'text-matrix-green/70 hover:text-matrix-green'
                      }`
                    }
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/settings" // This link is labeled "API Keys" and points to settings
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 ${
                        isActive
                          ? 'text-matrix-green font-medium'
                          : 'text-matrix-green/70 hover:text-matrix-green'
                      }`
                    }
                  >
                    <SettingsIcon size={18} />
                    <span>API Keys</span>
                  </NavLink>
                </li>
                {/* --- ADDED REFERRALS LINK --- */}
                <li>
                  <NavLink
                    to="/dashboard/referrals" // Path for the Referrals page
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 ${
                        isActive
                          ? 'text-matrix-green font-medium'
                          : 'text-matrix-green/70 hover:text-matrix-green'
                      }`
                    }
                  >
                    <Share2 size={18} /> {/* Icon for Referrals */}
                    <span>Referrals</span>
                  </NavLink>
                </li>
                {/* --- END OF ADDED REFERRALS LINK --- */}
              </ul>
            </div>
            {/* You can add other navigation sections here if needed */}
            {/* e.g.,
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-matrix-green">Other Section</h3>
              <ul className="space-y-3">
                 ... more links ...
              </ul>
            </div>
            */}
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;