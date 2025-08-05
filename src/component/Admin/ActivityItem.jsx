import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';

const ActivityItem = ({ icon: Icon, color, title, time }) => {
  const colorClasses = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className="flex items-start">
      <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} mr-4`}>
        {Icon ? <Icon size={18} /> : <FiIcons.FiHelpCircle size={18} />}
      </div>
      <div>
        <div 
          className="text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: title }} 
        />
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/v1/activities/recent');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="text-red-700 font-medium">Error loading activities</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
      
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const IconComponent = FiIcons[activity.icon];
            
            return (
              <ActivityItem
                key={index}
                icon={IconComponent}
                color={activity.color}
                title={activity.title}
                time={activity.time}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No activities found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;