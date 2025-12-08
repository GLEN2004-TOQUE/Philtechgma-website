import React from 'react';

interface AccessControlProps {
  children: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ children }) => {
  // Check if accessing from localhost or 127.0.0.1
  const isLocalhost = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === 'localhost:3000' ||
                     window.location.hostname === '127.0.0.1:3000';

  if (!isLocalhost) {
    // Show 404 page for unauthorized access
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              sorry do not try to bypass the localhostURL
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>This portal is only accessible through the official application.</p>
            <p className="mt-2">Please contact your administrator if you believe this is an error.</p>
          </div>
        </div>
      </div>
    );
  }

  // If localhost, render the protected content
  return <>{children}</>;
};

export default AccessControl;
