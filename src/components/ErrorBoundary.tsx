// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  // Called when an error is thrown in a descendant component
  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // Called after an error has been thrown by a descendant component
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Example logging: logErrorToMyService(error, errorInfo.componentStack);
  }

  // Function to attempt recovery by resetting the error state
  // Note: This might not fix the underlying issue if the component
  // consistently errors on render.
  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 m-4 border border-red-500 rounded bg-red-100 text-red-800 text-center font-mono">
          <h2 className="text-xl font-bold mb-2">System Malfunction Detected</h2>
          <p className="mb-2">An error occurred in this section.</p>
          {/* Optionally show error details in development */}
          {import.meta.env.DEV && this.state.error && (
             <details className="text-left text-sm bg-red-50 p-2 rounded mt-2">
                <summary>Error Details</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
             </details>
          )}
          <button
             onClick={this.handleReset}
             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Attempt Recovery
          </button>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;