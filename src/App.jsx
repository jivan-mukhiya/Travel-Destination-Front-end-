import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './component/Admin/Sidebar';
import Header from './component/Admin/Header';
import Destination from './component/Admin/Destination';
import AdminHome from './component/Admin/Home';
import EditDestination from './component/Admin/EditDestination';
import UserFeedback from './component/Admin/UserFeedback';
import AddDestination from './component/Admin/AddDestination';
import TravelRecommendations from './component/user/TravelRecommendations';
import UserManagement from './component/Admin/UserManagement';
import UserLogin from './component/user/UserLogin';
import UserRegistrationForm from './component/user/UserRegistrationForm';
import UserDetailsForm from './component/user/UserDetailsForm';
import ForgotPassword from './component/user/ForgotPassword';
import DestinationDetail from './component/user/DestinationDetail';
import AdminLogin from './component/Admin/AdminLogin';
import ViewProfile from './component/user/ViewProfile';
import EditUserForm from './component/user/EditUserForm';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('adminLoggedIn');
    if (loggedInStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAdminLogin = () => {
    localStorage.setItem('adminLoggedIn', 'true');
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Default route redirects to user side */}
        <Route path="/" element={<Navigate to="/user" replace />} />
        
        {/* User Routes */}
        <Route path="/user" element={<TravelRecommendations />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/registration" element={<UserRegistrationForm />} />
        <Route path="/user/user-details/:email" element={<UserDetailsForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/user/profile" element={<ViewProfile />} /> 
        <Route path="/user/edit" element={<EditUserForm />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleAdminLogin} />} />
        
        <Route 
          path="/admin/*" 
          element={
            isAdminLoggedIn ? (
              <div className="flex h-screen bg-gray-100">
                {sidebarOpen && (
                  <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  ></div>
                )}

                <Sidebar 
                  isOpen={sidebarOpen} 
                  onClose={() => setSidebarOpen(false)} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  onLogout={handleAdminLogout}
                />

                <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                  <Header 
                    onMenuClick={toggleSidebar} 
                    onSearch={setSearchTerm} 
                  />

                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Routes>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<AdminHome />} />
                      <Route path="list/destination" element={<Destination searchTerm={searchTerm}/>} />
                      <Route path="add/destination" element={<AddDestination />} />
                      <Route path="update/destination/:id" element={<EditDestination />} />
                      <Route path="feedback/list" element={<UserFeedback searchTerm={searchTerm} />} />
                      <Route path="user-management" element={<UserManagement searchTerm={searchTerm} />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />
          <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </Router>
  );
}

export default App;