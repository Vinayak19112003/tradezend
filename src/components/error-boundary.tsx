/**
 * @fileOverview Error Boundary Component
 *
 * React Error Boundary to catch and handle errors gracefully in the component tree.
 * Displays a fallback UI when an error occurs instead of crashing the entire app.
 *
 * @module components/error-boundary
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  /**
   * Log error information for debugging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by Error Boundary:', error);
    console.error('Error Info:', errorInfo);

    // You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * Reset error state and attempt to recover
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-sm text-muted-foreground">
                  We&apos;re sorry for the inconvenience. An unexpected error has occurred.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="w-full rounded-md bg-muted p-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 overflow-auto rounded bg-background p-2">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-auto rounded bg-background p-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={this.handleReset}
                  className="w-full sm:w-auto"
                  aria-label="Try again"
                >
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full sm:w-auto"
                  aria-label="Go to home page"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for Error Boundary for easier use in function components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
