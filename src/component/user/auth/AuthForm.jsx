import React from 'react';

const AuthForm = ({ 
  children, 
  onSubmit, 
  title, 
  subtitle, 
  footerText, 
  footerLinkText, 
  footerLinkPath 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {children}
        </form>
        
        {(footerText || footerLinkText) && (
          <div className="text-center text-sm text-gray-600 mt-4">
            {footerText}{' '}
            <a href={footerLinkPath} className="font-medium text-indigo-600 hover:text-indigo-500">
              {footerLinkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;