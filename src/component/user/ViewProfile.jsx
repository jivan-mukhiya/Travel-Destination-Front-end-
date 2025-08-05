import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiEdit3,
  FiGlobe,
  FiHeart
} from 'react-icons/fi';
import AuthAlert from './auth/AuthAlert';

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!userData) {
      setAlert({ message: 'User not logged in', type: 'error' });
      setLoading(false);
      return;
    }

    const userId = JSON.parse(userData)?.id;

    if (!userId) {
      setAlert({ message: 'Invalid user ID', type: 'error' });
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/v1/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setAlert({
          message: 'Failed to fetch profile. Please try again later.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <AuthAlert message={alert.message} type={alert.type} />
      </div>
    );
  }

  // Format budget range with currency symbol
  const formattedBudget = `₹${user.budgetMin.toLocaleString()} - ₹${user.budgetMax.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="flex items-center">
                  <FiBriefcase className="mr-2" />
                  {user.profession}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/user/edit')}
              className="flex items-center px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              <FiEdit3 className="mr-2" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DetailCard 
              icon={<FiUser className="text-blue-500" />} 
              title="Personal Information"
              items={[
                { label: 'Full Name', value: user.name },
                { label: 'Gender', value: user.gender },
                { label: 'Date of Birth', value: user.dob }
              ]}
            />
            
            <DetailCard 
              icon={<FiMail className="text-purple-500" />} 
              title="Contact"
              items={[
                { label: 'Email', value: user.userEmail },
                { label: 'Username', value: user.userName }
              ]}
            />
            
            <DetailCard 
              icon={<FiDollarSign className="text-green-500" />} 
              title="Travel Budget"
              items={[
                { label: 'Budget Range', value: formattedBudget }
              ]}
            />
            
            <DetailCard 
              icon={<FiMapPin className="text-red-500" />} 
              title="Travel Preferences"
              items={[
                { label: 'Travel Type', value: user.travelTypePreference },
                { label: 'Season', value: user.seasonPreference }
              ]}
            />
          </div>

          {/* Destinations Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <FiGlobe className="text-xl text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Visited Destinations</h2>
            </div>
            {user.pastVisitedDestinations?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.pastVisitedDestinations.map((destination, index) => (
                  <span 
                    key={index} 
                    className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200"
                  >
                    {destination}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No destinations recorded yet</p>
            )}
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <FiHeart className="text-xl text-pink-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Travel Preferences</h2>
            </div>
            {user.preferences?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.preferences.map((preference, index) => (
                  <span 
                    key={index} 
                    className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No preferences specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, title, items }) => (
  <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="ml-2 text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-gray-600">{item.label}:</span>
          <span className="font-medium text-gray-800">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ViewProfile;