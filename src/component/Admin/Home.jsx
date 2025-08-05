import React from 'react';
import { FiPlusCircle, FiMap, FiUsers } from 'react-icons/fi';
import StatCard from './StatCard';
import DestinationItem from './DestinationItem';
import Button from './Button';
import ActivityItem from './ActivityItem';
import ActivityTag from './ActivityTag';
import SeasonalRecommendations from './SeasonalRecommendations';

const AdminHome = () => {

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats cards */}
      <div className="md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
       
          <StatCard />
      </div>
      
      {/* Recent destinations */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recently Added Destinations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <DestinationItem />
        </div>
        <div className="p-4 border-t border-gray-200 text-center">
          <Button variant="ghost"
          to="/admin/list/destination"
          >
            View All Destinations
          </Button>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Button to="/admin/add/destination" variant="ghost" icon={FiPlusCircle} className="w-full justify-between">
              Add New Destination
            </Button>
            <Button to="/admin/user-management" variant="ghost" icon={FiMap} className="w-full justify-between">
            User Management
            </Button>
            <Button to="/admin/feedback/list" variant="ghost" icon={FiUsers} className="w-full justify-between">
              View User Feedback
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            
              <ActivityItem  />
          </div>
        </div>
      </div>

      {/* Activity Tags Section */}
      <ActivityTag />

      {/* Seasonal Recommendations Section */}
      <SeasonalRecommendations />
    </>
  );
};

export default AdminHome;