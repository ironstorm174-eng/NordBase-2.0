import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', backgroundColor: '#030712', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold' }}>Application Error</h1>
          <p style={{ marginTop: '10px', color: '#94a3b8' }}>Something went wrong while rendering the application.</p>
          <pre style={{ marginTop: '20px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', overflowX: 'auto', fontSize: '14px', color: '#f1f5f9' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#06b6d4', color: '#090d16', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reload NordBase
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

