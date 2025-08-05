import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { FaEdit } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { RiDeleteBin2Fill } from "react-icons/ri";
import Button from "./Button";

function Destination({ searchTerm }) {
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
      
      const result = await axios.get(
        "http://localhost:9000/api/v1/destination/list", 
        {
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      if (result.status === 200) {
        setDestinations(result.data);
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

  // Filter destinations based on search term
  const filteredDestinations = useMemo(() => {
    if (!searchTerm) return destinations;
    
    const term = searchTerm.toLowerCase();
    return destinations.filter(dest => 
      (dest.name && dest.name.toLowerCase().includes(term)) ||
      (dest.type && dest.type.toLowerCase().includes(term)) ||
      (dest.description && dest.description.toLowerCase().includes(term)) ||
      (dest.activityTags && dest.activityTags.some(tag => tag.toLowerCase().includes(term))) ||
      (dest.recommendedFor && dest.recommendedFor.some(tag => tag.toLowerCase().includes(term)))
    );
  }, [destinations, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/v1/destination/delete/${id}`);
      loadDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
      setError("Failed to delete destination");
    }
  };

  const renderRating = (rating) => {
    const normalizedRating = rating || 0;
    return (
      <div className="flex items-center">
        <span className="mr-1">{normalizedRating.toFixed(1)}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(normalizedRating) ? 'text-yellow-300' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    );
  };

  const renderArray = (array) => {
    if (!array || array.length === 0) return "N/A";
    return array.join(", ");
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
            onClick={loadDestinations}
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
        <h2 className="text-xl font-semibold text-gray-800">Destinations</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredDestinations.length} of {destinations.length} destinations
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">S.N</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Cost/Day</th>
              <th scope="col" className="px-6 py-3">Best Season</th>
              <th scope="col" className="px-6 py-3">Rating</th>
              <th scope="col" className="px-6 py-3">Popularity</th>
              <th scope="col" className="px-6 py-3">Recommended For</th>
              <th scope="col" className="px-6 py-3">Activities</th>
              <th scope="col" className="px-6 py-3">Added Time</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDestinations.map((destination, index) => (
              <tr 
                key={destination.destinationId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer">
                  {destination.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {destination.type ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {destination.type}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 font-medium">
                  {formatCurrency(destination.costPerDay || 0)}
                </td>
                <td className="px-6 py-4">
                  {destination.bestSeasonToVisit || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {renderRating(destination.averageRating)}
                </td>
                <td className="px-6 py-4">
                  {destination.popularityScore || 0}
                </td>
                <td className="px-6 py-4">
                  {renderArray(destination.recommendedFor)}
                </td>
                <td className="px-6 py-4">
                  {renderArray(destination.activityTags)}
                </td>
                <td className="px-6 py-4">
                  {formatDate(destination.addedTime || destination.localDateTime)}
                </td>
                <td className="px-6 py-4">
                  {destination.description || "N/A"}
                </td>
                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                  <Button
                    variant="icon"
                    icon={IoEye}
                    title="View"
                    className="text-blue-600 hover:text-blue-800"
                  />
                  
                  <Button
                    variant="icon"
                    icon={FaEdit}
                    to={`/admin/update/destination/${destination.destinationId}`}
                    title="Edit"
                    className="text-green-600 hover:text-green-800"
                  />
                  
                  <Button
                    variant="icon"
                    icon={RiDeleteBin2Fill}
                    onClick={() => handleDelete(destination.destinationId)}
                    title="Delete"
                    className="text-red-600 hover:text-red-800"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Destination;