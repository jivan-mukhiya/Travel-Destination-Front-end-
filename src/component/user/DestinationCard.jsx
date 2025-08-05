import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const DestinationCard = ({ destination, fallbackImage }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleViewClick = () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (user) {
      navigate(`/destination/${destination.id}`);
    } else {
      navigate('/user/login');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-full">
      {/* Enhanced image container with full-screen styling */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {/* Loading skeleton */}
        {imgLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        
        {/* Full-screen optimized image */}
        <img 
          src={imgError ? fallbackImage : destination.image} 
          alt={destination.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imgLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 truncate max-w-[70%]">
            {destination.name}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
            {destination.type}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-700">{destination.rating.toFixed(1)}</span>
          </div>
          <span className="ml-auto font-bold text-gray-900">${destination.price.toFixed(2)}/day</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {destination.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.tags.map((tag, index) => (
            <span 
              key={`${destination.id}-${tag}-${index}`}
              className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded truncate max-w-[120px]"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleViewClick}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;