// src/pages/dashboard/DashboardLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-matrix-green">
      <header className="p-4 border-b border-matrix-green">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      <div className="flex">
        <aside className="w-64 p-4 border-r border-matrix-green">
          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    isActive ? 'underline' : 'hover:underline'
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                    isActive ? 'underline' : 'hover:underline'
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings"
                  className={({ isActive }) =>
                    isActive ? 'underline' : 'hover:underline'
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
