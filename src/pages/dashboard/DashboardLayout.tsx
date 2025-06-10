// src/pages/dashboard/DashboardLayout.tsx
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Settings as SettingsIcon, Home, Share2, ChevronRight, BarChart3 } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

type SubscriptionData = {
  tier: string;
  status: string;
  renewalDate?: string;
  daysRemaining?: number;
};

type APIUsageData = {
  current: number;
  limit: number;
  percentage: number;
};

const makeAuthRequest = async (url: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');
  
  const response = await fetch(`http://localhost:8080${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  
  return response.json();
};

const fetchSubscriptionData = async (): Promise<SubscriptionData> => {
  try {
    const data = await makeAuthRequest('/api/v1/users/me/subscription');
    return {
      tier: data.tier || 'Free',
      status: data.status || 'Active',
      daysRemaining: data.daysRemaining,
      renewalDate: data.renewalDate,
    };
  } catch (error) {
    return {
      tier: 'Free',
      status: 'Active',
    };
  }
};

const fetchAPIUsageData = async (): Promise<APIUsageData> => {
  try {
    const data = await makeAuthRequest('/api/v1/users/me/api-usage');
    return {
      current: data.current || 0,
      limit: data.limit || 1000,
      percentage: data.percentage || 0,
    };
  } catch (error) {
    return {
      current: 0,
      limit: 1000,
      percentage: 0,
    };
  }
};

const DashboardLayout = () => {
  const location = useLocation();
  
  const { data: subscriptionData } = useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: fetchSubscriptionData,
  });

  const { data: apiUsageData } = useQuery<APIUsageData>({
    queryKey: ['apiUsage'],
    queryFn: fetchAPIUsageData,
  });

  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Overview',
      icon: <Home className="h-5 w-5" />,
      end: true
    },
    {
      path: '/dashboard/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />
    },
    {
      path: '/dashboard/settings',
      label: 'API Keys',
      icon: <SettingsIcon className="h-5 w-5" />
    },
    {
      path: '/dashboard/referrals',
      label: 'Referrals',
      icon: <Share2 className="h-5 w-5" />
    }
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out ${
      isActive
        ? 'bg-primary/10 text-primary font-medium shadow-sm backdrop-blur-sm border border-primary/20'
        : 'text-text-secondary hover:text-primary hover:bg-primary/5 hover:translate-x-1'
    }`;

  return (
    <div className="min-h-screen relative">
      {/* Matrix Glass Background */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 backdrop-blur-lg bg-matrix-green/[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-matrix-green/5 via-transparent to-matrix-green/5"></div>
      
      {/* Header - Fixed Width */}
      <header className="relative z-10 bg-matrix-green/10 backdrop-blur-md border-b border-matrix-green/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CryptoWebb
                </h1>
                <p className="text-sm text-text-secondary">User Dashboard</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/analytics"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics Platform
              <ChevronRight className="h-4 w-4" />
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Matrix Sidebar */}
        <aside className="relative z-10 w-72 bg-matrix-green/[0.08] backdrop-blur-md border-r border-matrix-green/20 min-h-[calc(100vh-80px)]">
          <div className="p-6">
            {/* Navigation Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-secondary/60 uppercase tracking-wider mb-4">
                  Account Management
                </h3>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={getNavLinkClass}
                    >
                      <div className={`transition-transform duration-200 group-hover:scale-110 ${
                        location.pathname === item.path ? 'text-primary' : 'text-text-secondary'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-all duration-200 ${
                        location.pathname === item.path 
                          ? 'opacity-100 translate-x-1' 
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                      }`} />
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Quick Stats or Additional Info */}
              <div className="pt-6 border-t border-matrix-green/20">
                <h3 className="text-sm font-semibold text-text-secondary/60 uppercase tracking-wider mb-4">
                  Quick Access
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-matrix-green/10 backdrop-blur-md rounded-xl border border-matrix-green/30 shadow-lg shadow-matrix-green/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text">Subscription</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                        {subscriptionData?.tier || 'Free'}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {subscriptionData?.daysRemaining 
                        ? `${subscriptionData.daysRemaining} days remaining`
                        : subscriptionData?.status || 'Active'
                      }
                    </p>
                  </div>
                  
                  <div className="p-4 bg-matrix-green/10 backdrop-blur-md rounded-xl border border-matrix-green/30 shadow-lg shadow-matrix-green/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text">API Usage</span>
                      <span className="text-xs text-success font-medium">
                        {apiUsageData?.current.toLocaleString() || '0'}/{apiUsageData?.limit.toLocaleString() || '1k'}
                      </span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(apiUsageData?.percentage || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Contained but consistent */}
        <main className="relative z-10 flex-1 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* FIXED WIDTH CONTAINER - ALWAYS EXACTLY THE SAME */}
            <div className="w-[1000px] mx-auto space-y-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;