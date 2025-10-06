// src/pages/settings/SettingsLayout.tsx
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Settings as SettingsIcon, Home, Share2, ChevronRight, BarChart3, Menu, X, CreditCard } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

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

const SettingsLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: subscriptionData } = useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: fetchSubscriptionData,
  });

  const { data: apiUsageData } = useQuery<APIUsageData>({
    queryKey: ['apiUsage'],
    queryFn: fetchAPIUsageData,
  });

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems: NavItem[] = [
    {
      path: '/settings',
      label: 'Overview',
      icon: <Home className="h-5 w-5" />,
      end: true
    },
    {
      path: '/settings/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />
    },
    {
      path: '/settings/api',
      label: 'API Keys',
      icon: <SettingsIcon className="h-5 w-5" />
    },
    {
      path: '/settings/referrals',
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
    <div className="min-h-screen w-full relative pt-20 overflow-x-hidden">
      <div className='bg-white dark:bg-black overflow-x-hidden'>
      <header className="relative z-50 bg-surface/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4 shadow-sm bg-b">
        <div className="flex items-center justify-between bg-ba">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CryptoWebb
              </h1>
              <p className="text-xs md:text-sm text-text-secondary">User Settings Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text hover:bg-primary/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/[0.98] backdrop-blur-md border-b border-border shadow-xl z-[80] mt-2 mx-4 rounded-lg border border-primary/50">
            <nav className="p-3 space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                  Settings
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md transition-all duration-200 min-h-[40px] text-xs font-medium border  ${
                          isActive
                            ? 'bg-primary/25 text-primary border-primary/60'
                            : 'text-text-secondary hover:text-primary hover:bg-primary/15 border-primary/30 hover:border-primary/50'
                        }`
                      }
                    >
                      <div className="text-current flex-shrink-0">
                        {React.cloneElement(item.icon as React.ReactElement, { size: 12 })}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t border-primary/40">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                  Platform
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <NavLink
                    to="/analytics"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/15 transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 hover:border-primary/50 bg-black/80"
                  >
                    <BarChart3 className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">Analytics</span>
                  </NavLink>
                  
                  <NavLink
                    to="/"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/15 transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 hover:border-primary/50 bg-black/80"
                  >
                    <Home className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">Home</span>
                  </NavLink>
                  
                  <NavLink
                    to="/pricing"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/15 transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 hover:border-primary/50 bg-black/80"
                  >
                    <CreditCard className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">Pricing</span>
                  </NavLink>
                  
                  <NavLink
                    to="/about"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/15 transition-all duration-200 min-h-[40px] text-xs font-medium border border-primary/30 hover:border-primary/50 bg-black/80"
                  >
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">About</span>
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="flex w-full max-w-7xl mx-auto overflow-hidden">
        <aside className="hidden md:block relative z-10 w-64 flex-shrink-0 bg-surface/95 backdrop-blur-sm border-r border-border min-h-[calc(100vh-80px)] shadow-sm">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
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
                      <div className={`transition-transform duration-200 ${
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

              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Quick Access
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-surface border border-border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text">Subscription</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
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
                  
                  <div className="p-4 bg-surface border border-border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text">API Usage</span>
                      <span className="text-xs text-primary font-medium">
                        {apiUsageData?.current.toLocaleString() || '0'}/{apiUsageData?.limit.toLocaleString() || '1k'}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(apiUsageData?.percentage || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative z-10 flex-1 min-h-[calc(100vh-80px)] min-w-0 overflow-hidden">
          <div className="h-full w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 flex items-start justify-center">
            <div className="w-full max-w-5xl min-w-0">
              <div className="settings-scroll w-full bg-surface/95 backdrop-blur-sm border border-border rounded-lg shadow-sm p-4 md:p-6 lg:p-8 min-h-[calc(100vh-220px)]">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default SettingsLayout;
