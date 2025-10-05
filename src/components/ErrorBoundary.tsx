// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    eventId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      eventId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.length && prevProps.resetKeys?.length) {
        // Check if any reset key has changed
        const hasResetKeyChanged = resetKeys.some(
          (resetKey, idx) => prevProps.resetKeys![idx] !== resetKey
        );
        
        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }

    // Reset on any prop change if resetOnPropsChange is true
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: null,
      });
    }, 100);
  };

  private reloadPage = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    const { error, errorInfo, eventId } = this.state;
    const errorDetails = {
      eventId,
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message,
        stack: error?.stack,
      },
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Matrix-themed error UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-black/90 border border-red-500/50 shadow-lg shadow-red-500/20">
            <div className="p-8 text-center">
              {/* Matrix-style error icon */}
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-red-500/10 rounded-full animate-ping" />
                <AlertTriangle className="absolute inset-4 w-12 h-12 text-red-500 animate-bounce" />
              </div>

              <h1 className="text-2xl font-mono font-bold text-red-500 mb-4">
                SYSTEM ERROR DETECTED
              </h1>
              
              <p className="text-matrix-green/80 mb-6 font-mono">
                An unexpected error occurred in the Matrix. Our systems are working to resolve this.
              </p>

              {this.state.eventId && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-6">
                  <p className="text-xs text-red-400 font-mono">
                    Error ID: <span className="text-red-300">{this.state.eventId}</span>
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <Button
                  onClick={this.resetErrorBoundary}
                  className="bg-matrix-green text-black hover:bg-matrix-green/80"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.reloadPage}
                  variant="ghost"
                  className="text-matrix-green border border-matrix-green/50 hover:bg-matrix-green/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button
                  onClick={this.goHome}
                  variant="ghost"
                  className="text-matrix-green border border-matrix-green/50 hover:bg-matrix-green/10"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Error details (collapsible) */}
              {this.props.showDetails && this.state.error && (
                <details className="text-left mt-6">
                  <summary className="cursor-pointer text-matrix-green/70 hover:text-matrix-green mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Technical Details
                  </summary>
                  
                  <div className="bg-black/50 border border-matrix-green/30 rounded p-4 font-mono text-xs">
                    <div className="mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">Error Message:</h4>
                      <p className="text-red-300">{this.state.error.message}</p>
                    </div>
                    
                    {this.state.error.stack && (
                      <div className="mb-4">
                        <h4 className="text-red-400 font-semibold mb-2">Stack Trace:</h4>
                        <pre className="text-red-300 whitespace-pre-wrap overflow-auto max-h-40 text-xs">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="text-red-400 font-semibold mb-2">Component Stack:</h4>
                        <pre className="text-red-300 whitespace-pre-wrap overflow-auto max-h-40 text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-matrix-green/20">
                      <Button
                        onClick={this.copyErrorDetails}
                        size="sm"
                        variant="ghost"
                        className="text-matrix-green/70 hover:text-matrix-green"
                      >
                        Copy Error Details
                      </Button>
                    </div>
                  </div>
                </details>
              )}

              <div className="mt-6 text-xs text-matrix-green/50 font-mono">
                If this problem persists, please contact support with the Error ID above.
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier use
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Specialized error boundaries for different contexts
export const ChartErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <Card className="h-full flex items-center justify-center border-red-500/50 bg-red-500/5">
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-red-500 font-semibold mb-2">Chart Error</h3>
          <p className="text-red-400 text-sm">Unable to render chart</p>
        </div>
      </Card>
    }
  >
    {children}
  </ErrorBoundary>
);

export const AnalyticsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    showDetails={process.env.NODE_ENV === 'development'}
    onError={(error, errorInfo) => {
      console.error('Analytics Error:', error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;