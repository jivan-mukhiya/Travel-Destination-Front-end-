import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DestinationItem = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await axios.get("http://localhost:9000/api/v1/destination/list", {
        validateStatus: (status) => status >= 200 && status < 400,
      });

      if (result.status === 200) {
        // Ensure all destinations have a valid type
        const validatedDestinations = result.data.map(dest => ({
          ...dest,
          type: dest.type || 'unknown' // Default to 'unknown' if type is null/undefined
        }));
        setDestinations(validatedDestinations);
      } else if (result.status === 302) {
        console.warn("Redirect detected. Check the server configuration.");
        setError("Server configuration issue detected");
      } else {
        console.error("Unexpected status:", result.status);
        setError("Unexpected server response");
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setError("Failed to load destinations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getBadgeColor = (type) => {
    // Make type safe by providing a default
    const safeType = (type || 'unknown').toLowerCase();
    
    const typeColors = {
      lake: 'bg-blue-100 text-blue-800',
      mountain: 'bg-green-100 text-green-800',
      city: 'bg-purple-100 text-purple-800',
      beach: 'bg-yellow-100 text-yellow-800',
      historical: 'bg-red-100 text-red-800',
      wildlife: 'bg-indigo-100 text-indigo-800',
      unknown: 'bg-gray-100 text-gray-800' // Added default for unknown types
    };
    return typeColors[safeType] || typeColors.unknown;
  };

  const displayedDestinations = destinations.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadDestinations}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (displayedDestinations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No destinations found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {displayedDestinations.map((destination, index) => (
        <div 
          key={destination.destinationId || index} 
          className="p-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800">{destination.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(destination.addedTime)}
              </p>
            </div>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getBadgeColor(destination.type)}`}>
              {destination.type || 'Unknown'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DestinationItem;