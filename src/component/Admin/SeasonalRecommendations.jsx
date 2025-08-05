import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeasonalRecommendations = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define default values internally
  const title = "Seasonal Recommendations";
  const className = "";
  const defaultColors = {
    summer: 'bg-red-100 text-red-800',
    winter: 'bg-blue-100 text-blue-800',
    spring: 'bg-green-100 text-green-800',
    autumn: 'bg-yellow-100 text-yellow-800',
    "": 'bg-gray-100 text-gray-800',
    'not specified': 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/v1/destination/season-stats');
        
        // Transform API data to match component format
        const formattedSeasons = Object.entries(response.data).map(([season, count]) => ({
          season: season || 'Not specified', // Handle empty string case
          count,
          color: season ? defaultColors[season.toLowerCase()] : defaultColors['not specified']
        }));
        
        setSeasons(formattedSeasons);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="text-red-500 p-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {seasons.map((item) => (
          <div key={item.season} className={`p-4 rounded-lg ${item.color} flex items-center justify-between`}>
            <span className="font-medium capitalize">{item.season}</span>
            <span className="text-xl font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalRecommendations;