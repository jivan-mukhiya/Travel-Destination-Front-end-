// src/components/Header.js
import React, { useState } from 'react';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import Button from './Button';

const Header = ({ onMenuClick, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="icon" 
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <FiMenu size={20} />
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={handleChange}
              className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                AD
              </div>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <span className="hidden md:inline">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;