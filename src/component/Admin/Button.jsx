import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({ 
  to,
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center rounded-lg transition focus:outline-none';
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    icon: 'p-2 bg-transparent text-gray-500 hover:bg-gray-100 rounded-full'
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon className={children ? 'mr-2' : ''} />}
      {children}
    </button>
  );
};

export default Button;