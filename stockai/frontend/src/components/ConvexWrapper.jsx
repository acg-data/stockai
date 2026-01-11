import React, { useState, useEffect } from 'react';

export const useConvexStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let checkTimeout;

    // Try to detect if Convex is available
    const checkConvex = () => {
      try {
        // Check if convex functions are available
        if (typeof window !== 'undefined' && window.convexClient) {
          if (mounted) {
            setStatus('connected');
            setHasInitialized(true);
          }
          return true;
        }

        // Check if Convex is in environment
        if (typeof window !== 'undefined' && window.convex) {
          if (mounted) {
            setStatus('connected');
            setHasInitialized(true);
          }
          return true;
        }

        // Timeout after 3 seconds - assume disconnected if not detected
        if (mounted) {
          setStatus('disconnected');
          setHasInitialized(true);
        }
        return false;
      } catch (error) {
        console.error('Error checking Convex:', error);
        if (mounted) {
          setStatus('disconnected');
          setHasInitialized(true);
        }
        return false;
      }
    };

    // Check immediately
    if (!checkConvex()) {
      // Retry after a short delay
      checkTimeout = setTimeout(() => {
        checkConvex();
      }, 1000);
    }

    return () => {
      mounted = false;
      if (checkTimeout) clearTimeout(checkTimeout);
    };
  }, []);

  return { status, hasInitialized, isConnected: status === 'connected' };
};

const ConvexWrapper = ({ children, fallback, isDark }) => {
  const { status, hasInitialized, isConnected } = useConvexStatus();

  if (!hasInitialized) {
    return (
      <div className={`h-full flex items-center justify-center ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Connecting to Convex...
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    if (fallback) {
      return fallback();
    }

    return (
      <div className={`h-full flex items-center justify-center ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`max-w-md p-8 rounded-2xl shadow-xl ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Convex Not Connected</h2>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            The Convex backend is not available. This is expected if you're in demo mode.
          </p>
          
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
            <p className="text-sm mb-2">To use Convex features:</p>
            <ol className={`text-sm list-decimal list-inside ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>Run <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 font-mono">npx convex dev</code></li>
              <li>Ensure environment variables are set</li>
              <li>Check that Convex deployment is active</li>
            </ol>
          </div>
          
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            In the meantime, try the <strong>Dummy Screener</strong> for demo data.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ConvexWrapper;