import React from 'react';
import { FiHome, FiMap, FiPlusCircle, FiUsers, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import NavLink from './NavLink';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 bg-blue-800 text-white overflow-y-auto`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">TravelAdmin</h1>
        <button 
          className="lg:hidden p-1 rounded-md hover:bg-blue-700"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/admin/dashboard"
              icon={FiHome} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/list/destination"
              icon={FiMap} 
              active={activeTab === 'destinations'} 
              onClick={() => setActiveTab('destinations')}
            >
              Destinations
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/add/destination"
              icon={FiPlusCircle} 
              active={activeTab === 'add'} 
              onClick={() => setActiveTab('add')}
            >
              Add Destination
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/feedback/list"
              icon={FiUsers} 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
            >
              User Feedback
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/user-management"
              icon={FiUsers} 
              active={activeTab === 'userManagement'} 
              onClick={() => setActiveTab('userManagement')}
            >
              User Management
            </NavLink>
          </li>
        </ul>
        
        <div className="mt-8 pt-4 border-t border-blue-700">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiLogOut className="text-white" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;