import React from 'react';
import StarRating from './StarRating';
import UserReviewCard from './UserReviewCard';
import ReviewForm from './ReviewForm';

const ReviewsSection = ({ 
  destinationId, 
  reviews, 
  reviewsLoading, 
  destinationRating, 
  onReviewSubmit 
}) => (
  <div className="mt-12 pt-8 border-t border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Traveler Reviews</h2>
      <div className="flex items-center">
        <StarRating rating={destinationRating} />
        <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
      </div>
    </div>
    
    <div className="mb-8">
      <ReviewForm 
        destinationId={destinationId} 
        onReviewSubmit={onReviewSubmit} 
      />
    </div>
    
    {reviewsLoading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : reviews.length === 0 ? (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mt-4">No reviews yet</h3>
        <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <UserReviewCard key={review.id} review={review} />
        ))}
      </div>
    )}
  </div>
);

export default ReviewsSection;