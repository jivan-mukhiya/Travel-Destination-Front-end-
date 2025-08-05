import React, { useState, useEffect } from 'react';
import { FiActivity } from 'react-icons/fi';
import axios from 'axios';

const ActivityTag = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityTags = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/v1/destination/activity-tags');
        
        // Convert the API response format to the format needed by the component
        const formattedTags = Object.entries(response.data).map(([name, count]) => ({
          name,
          count
        }));
        
        setTags(formattedTags);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivityTags();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Activity Tags</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Activity Tags</h2>
        <div className="text-red-500">Error loading activity tags: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Activity Tags</h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div key={tag.name} className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <FiActivity className="text-blue-500 mr-2" />
            <span className="font-medium text-gray-700">{tag.name}</span>
            <span className="ml-2 text-sm text-gray-500">({tag.count})</span>
          </div>
        ))}
      </div>
    </div>
  ); 
};

export default ActivityTag;