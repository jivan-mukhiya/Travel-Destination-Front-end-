import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavLink = ({ children, icon: Icon, active = false, onClick, className = '', to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full p-3 rounded-lg transition ${active ? 'bg-blue-700' : 'hover:bg-blue-700'} ${className}`}
    >
      {Icon && <Icon className="mr-3" />}
      {children}
    </button>
  );
};

export default NavLink;
