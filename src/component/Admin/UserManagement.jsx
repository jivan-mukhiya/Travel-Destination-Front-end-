import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import Button from "./Button";

function UserManagement({ searchTerm }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.userName && user.userName.toLowerCase().includes(term)) ||
      (user.userEmail && user.userEmail.toLowerCase().includes(term)) ||
      (user.profession && user.profession.toLowerCase().includes(term)) ||
      (user.pastVisitedDestinations && 
        user.pastVisitedDestinations.some(dest => dest.toLowerCase().includes(term))) ||
      (user.preferences && 
        user.preferences.some(pref => pref.toLowerCase().includes(term)))
    );
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await axios.get(
        "http://localhost:9000/api/v1/user/list", 
        {
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      if (result.status === 200) {
        setUsers(result.data);
      } else if (result.status === 302) {
        console.warn("Redirect detected. Check the server configuration.");
        setError("Server configuration issue detected");
      } else {
        console.error("Unexpected status:", result.status);
        setError("Unexpected server response");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleDropdown = (userId, field) => {
    const key = `${userId}-${field}`;
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const renderDropdown = (userId, array, field, title) => {
    if (!array || array.length === 0) return "N/A";
    
    const key = `${userId}-${field}`;
    const isActive = activeDropdown === key;

    return (
      <div className="relative inline-block">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(userId, field);
          }}
          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
        >
          {title} ({array.length})
          <svg 
            className={`w-4 h-4 ml-1 transition-transform ${isActive ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isActive && (
          <div 
            className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {array.map((item, i) => (
              <div 
                key={i} 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
                title={item}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">S.N</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Gender</th>
              <th scope="col" className="px-6 py-3">DOB</th>
              <th scope="col" className="px-6 py-3">Profession</th>
              <th scope="col" className="px-6 py-3">Budget Range</th>
              <th scope="col" className="px-6 py-3">Travel Preference</th>
              <th scope="col" className="px-6 py-3">Season Preference</th>
              <th scope="col" className="px-6 py-3">Past Visits</th>
              <th scope="col" className="px-6 py-3">Preferences</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr 
                key={user.userId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer">
                  {user.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {user.gender ? (
                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                      user.gender.toLowerCase() === 'male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {user.gender}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4">
                  {formatDate(user.dob)}
                </td>
                <td className="px-6 py-4">
                  {user.profession || "N/A"}
                </td>
                <td className="px-6 py-4 font-medium">
                  {formatCurrency(user.budgetMin || 0)} - {formatCurrency(user.budgetMax || 0)}
                </td>
                <td className="px-6 py-4">
                  {user.travelTypePreference || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {user.seasonPreference || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {renderDropdown(user.userId, user.pastVisitedDestinations, "visits", "Visits")}
                </td>
                <td className="px-6 py-4">
                  {renderDropdown(user.userId, user.preferences, "preferences", "Preferences")}
                </td>
                <td className="px-6 py-4">
                  {user.userName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {user.userEmail || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;