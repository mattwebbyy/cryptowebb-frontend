// src/components/ui/Breadcrumb.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Auto-generate breadcrumbs from URL path
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Build breadcrumbs from URL segments
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    // Format label - handle special cases
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Replace dashes/underscores with spaces and title case
    label = label.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Special formatting for known routes
    const routeLabels: Record<string, string> = {
      'analytics': 'Analytics',
      'dashboard': 'Dashboard', 
      'datasources': 'Data Sources',
      'cipher-matrix': 'Cipher Matrix',
      'alerts': 'Alerts',
      'metrics': 'Metrics',
      'manage': 'Manage',
      'blog': 'Blog',
      'settings': 'Settings',
      'profile': 'Profile',
      'referrals': 'Referrals'
    };

    if (routeLabels[segment]) {
      label = routeLabels[segment];
    }

    // For metric IDs, show as "Metric: {ID}"
    if (segments[index - 1] === 'metrics' && !isNaN(Number(segment))) {
      label = `Metric: ${segment}`;
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : href,
      isActive: isLast
    });
  });

  return breadcrumbs;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className,
  showHome = true 
}) => {
  const location = useLocation();
  
  // Use provided items or auto-generate from current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);
  
  // Don't show breadcrumbs for home page or single-level pages
  if (!breadcrumbItems.length || (breadcrumbItems.length === 1 && !showHome)) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-matrix-green/70", className)}
    >
      {/* Home link */}
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center hover:text-matrix-green transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="h-4 w-4 text-matrix-green/50" />
          )}
        </>
      )}

      {/* Breadcrumb items */}
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !item.isActive ? (
              <Link
                to={item.href}
                className="flex items-center hover:text-matrix-green transition-colors font-medium"
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span 
                className={cn(
                  "flex items-center font-medium",
                  item.isActive || isLast 
                    ? "text-matrix-green" 
                    : "text-matrix-green/70"
                )}
                aria-current={item.isActive || isLast ? "page" : undefined}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-matrix-green/50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Specialized breadcrumb for analytics with dynamic content
interface AnalyticsBreadcrumbProps {
  metricName?: string;
  metricId?: string;
  className?: string;
}

export const AnalyticsBreadcrumb: React.FC<AnalyticsBreadcrumbProps> = ({
  metricName,
  metricId,
  className
}) => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  
  // Custom breadcrumbs for analytics pages
  const items: BreadcrumbItem[] = [
    { label: 'Analytics', href: '/analytics' }
  ];

  // Add specific pages based on current route
  if (segments.includes('datasources')) {
    items.push({ label: 'Data Sources', href: '/analytics/datasources' });
  } else if (segments.includes('alerts')) {
    items.push({ label: 'Alerts', href: '/analytics/alerts' });
  } else if (segments.includes('cipher-matrix')) {
    items.push({ label: 'Cipher Matrix', href: '/analytics/cipher-matrix' });
  } else if (segments.includes('manage')) {
    items.push({ label: 'Manage', href: '/analytics/manage' });
  } else if (segments.includes('metrics')) {
    items.push({ label: 'Metrics', href: '/analytics' });
    
    // Add specific metric if available
    if (metricId) {
      const label = metricName ? `${metricName}` : `Metric ${metricId}`;
      items.push({ 
        label, 
        isActive: true
      });
    }
  }

  return <Breadcrumb items={items} className={className} />;
};

export default Breadcrumb;