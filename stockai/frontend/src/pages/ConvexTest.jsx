import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

function ConvexTest() {
  const [message, setMessage] = useState('');
  const testConnection = useQuery(api.test.testConnection);

  useEffect(() => {
    if (testConnection) {
      setMessage(testConnection.message);
    }
  }, [testConnection]);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Convex Integration Test
      </h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status:</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {testConnection ? '✅ Connected' : '⏳ Connecting...'}
        </p>
        
        {testConnection && (
          <div className="mt-4">
            <p><strong>Message:</strong> {testConnection.message}</p>
            <p><strong>Timestamp:</strong> {new Date(testConnection.timestamp).toLocaleString()}</p>
            <p><strong>Deployment:</strong> {testConnection.deployment}</p>
          </div>
        )}
      </div>

      {message && (
        <div className="mt-4 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{message}</p>
        </div>
      )}
    </div>
  );
}

export default ConvexTest;