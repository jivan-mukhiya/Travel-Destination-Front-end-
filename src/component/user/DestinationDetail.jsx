import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthButton from "./auth/AuthButton ";
import DestinationHeader from "./DestinationDetails/DestinationHeader";
import TravelInformation from "./DestinationDetails/TravelInformation";
import PricingSummary from "./DestinationDetails/PricingSummary";
import ReviewsSection from "./DestinationDetails/ReviewsSection";


const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const destResponse = await fetch(`http://localhost:9000/api/v1/destination/${id}`);
        if (!destResponse.ok) throw new Error(`Server returned ${destResponse.status} status`);
        const destData = await destResponse.json();
        
        const reviewsResponse = await fetch(`http://localhost:9000/api/v1/destination-rating/list/${id}`);
        if (!reviewsResponse.ok) throw new Error(`Reviews server error: ${reviewsResponse.status}`);
        const reviewsData = await reviewsResponse.json();
        
        const combinedTags = [...(destData.recommendedFor || []), ...(destData.activityTags || [])];
        const uniqueTags = [...new Set(combinedTags)]
          .filter(tag => tag)
          .map(tag => typeof tag === 'string' ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag);

        setDestination({
          id: destData.destinationId,
          name: destData.name,
          type: destData.type,
          rating: destData.averageRating || 0,
          price: destData.costPerDay || 0,
          bestSeason: destData.bestSeasonToVisit || 'All year',
          popularity: destData.popularityScore || 0,
          image: destData.imagePath 
            ? `http://localhost:9000/${destData.imagePath.replace(/\\/g, '/')}`
            : FALLBACK_IMAGE,
          tags: uniqueTags,
          description: destData.description || 'No description available',
          addedTime: destData.addedTime
        });
        
        setReviews(reviewsData);
        setReviewsLoading(false);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNewReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
    // Update average rating
    if (destination) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating;
      const averageRating = totalRating / (reviews.length + 1);
      
      setDestination(prev => ({
        ...prev,
        rating: averageRating
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-4 text-xl font-semibold text-gray-700">Loading destination...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Error loading data</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <AuthButton 
            onClick={() => navigate(-1)}
            fullWidth={false}
            className="mt-6 mx-auto"
          >
            &larr; Back to Recommendations
          </AuthButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 px-5 py-3 bg-white hover:bg-gray-100 rounded-xl shadow transition-colors text-gray-700 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Recommendations
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <DestinationHeader 
            destination={destination} 
            reviews={reviews} 
            fallbackImage={FALLBACK_IMAGE} 
          />
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About {destination.name}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                <TravelInformation destination={destination} />

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <PricingSummary 
                  price={destination.price} 
                  destinationName={destination.name} 
                />
              </div>
            </div>
            
            <ReviewsSection
              destinationId={destination.id}
              reviews={reviews}
              reviewsLoading={reviewsLoading}
              destinationRating={destination.rating}
              onReviewSubmit={handleNewReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;