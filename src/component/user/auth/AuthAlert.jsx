import React from 'react';

const AuthAlert = ({ message, type = 'error' }) => {
  if (!message) return null;

  const alertClasses = {
    error: 'bg-red-50 border-red-500 text-red-700',
    success: 'bg-green-50 border-green-500 text-green-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700'
  };

  const iconClasses = {
    error: 'text-red-500',
    success: 'text-green-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  };

  const icons = {
    error: (
      <svg className={`h-5 w-5 ${iconClasses[type]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className={`h-5 w-5 ${iconClasses[type]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${alertClasses[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icons[type] || icons.error}
        </div>
        <div className="ml-3">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthAlert;