import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback, isDark } = this.props;

      if (fallback) {
        return fallback(this.state.error);
      }

      return (
        <div className={`h-full flex items-center justify-center ${
          isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}>
          <div className={`max-w-md p-8 rounded-2xl shadow-xl ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Unable to Load Page</h2>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {this.props.message || 'This page encountered an error while loading. We\'re working to fix it.'}
            </p>
            
            <div className={`p-4 rounded-lg mb-6 text-sm ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              {this.state.error && this.state.error.message}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
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