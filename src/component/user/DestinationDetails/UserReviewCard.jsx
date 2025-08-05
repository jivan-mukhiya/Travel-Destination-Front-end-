import React from 'react';
import StarRating from './StarRating';

const UserReviewCard = ({ review }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <div>
        <div className="flex items-center mb-1">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="ml-3 font-semibold text-gray-800">{review.userName}</span>
        </div>
        <div className="flex items-center">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <span className="text-xs text-gray-500">
        {new Date().toLocaleDateString()}
      </span>
    </div>
    <p className="text-gray-600 mt-2">{review.feedback}</p>
  </div>
);

export default UserReviewCard;