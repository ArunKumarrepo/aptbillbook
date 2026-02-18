/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import React from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    logger.error('React Error Boundary caught an error', {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            textAlign: 'center',
            border: '2px solid #dc2626',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ margin: '0 0 20px 0', color: '#111827' }}>
              Application Error
            </h1>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280', lineHeight: '1.5' }}>
              The application encountered an unexpected error and cannot continue.
            </p>
            {this.state.error && (
              <details style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid #e5e7eb',
              }}>
                <summary style={{ fontWeight: 'bold', color: '#374151' }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: '10px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#dc2626',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
