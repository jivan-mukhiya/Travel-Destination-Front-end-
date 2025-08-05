import React, { useState } from 'react';

const StarRating = ({ rating, interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <svg 
            key={i}
            className={`w-5 h-5 ${ratingValue <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
            onMouseEnter={() => interactive && setHoverRating(ratingValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange(ratingValue)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-gray-600 font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;