import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import AuthAlert from './auth/AuthAlert';

const HeroSection = ({ isAuthenticated, searchQuery, setSearchQuery, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setAlert({ message: 'Successfully logged out!', type: 'success' }); 
    setDropdownOpen(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20 px-4">
     
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50 w-full max-w-md px-4">
        <AuthAlert message={alert.message} type={alert.type} />
      </div>

    
      <div className="absolute top-4 right-4 z-50" ref={dropdownRef}>
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-full shadow-lg transition-all duration-300 border border-white/30"
            >
              <FiUser className="text-lg" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">User Profile</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/user/profile`);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FiLogOut className="text-gray-500" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/user/login')}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-full shadow-lg transition-all duration-300 border border-white/30"
          >
            <FiUser className="text-lg" />
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
      
     
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Perfect Getaway</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Find hand-picked travel destinations tailored to your preferences</p>
        
       
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search destinations, activities, or keywords..."
            className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute right-6 top-4 text-gray-500 text-xl" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
