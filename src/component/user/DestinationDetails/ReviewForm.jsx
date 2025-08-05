  import { useState } from "react";
  import AuthAlert from "../auth/AuthAlert";
  import StarRating from "./StarRating";
  import AuthInput from "../auth/AuthInput";
  import AuthButton from "../auth/AuthButton ";

  const ReviewForm = ({ destinationId, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const getUser = () => {
  try {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
   
    return {
      ...user,
      id: Number(user.id)  
    };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (rating === 0) {
        setError('Please select a rating');
        return;
      }

      setSubmitting(true);
      setError(null);
      
      const user = getUser();
      console.log(user);
      
      if (!user || !user.id) {
        setError('You must be logged in to submit a review');
        setSubmitting(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:9000/api/v1/destination-rating/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          
          },
          body: JSON.stringify({
            destinationId,
            rating,
            feedback,
            userId: user.id 
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server returned ${response.status} status`);
        }
        
        const data = await response.json();
        onReviewSubmit(data);
        setSuccess(true);
        setRating(0);
        setFeedback('');
        
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err.message || 'Failed to submit review');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
        
        {success && (
          <AuthAlert 
            message="Review submitted successfully!" 
            type="success" 
            className="mb-4"
          />
        )}
        
        {error && (
          <AuthAlert 
            message={error} 
            type="error" 
            className="mb-4"
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Rating</label>
            <StarRating 
              rating={rating} 
              interactive={true} 
              onRatingChange={setRating} 
            />
          </div>
          
          <div className="mb-4">
            <AuthInput
              id="feedback"
              name="feedback"
              type="textarea"
              label="Your Feedback"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required={true}
              error={null}
            />
          </div>
          
          <AuthButton 
            type="submit"
            isLoading={submitting}
            disabled={submitting || rating === 0}
            fullWidth={true}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </AuthButton>
        </form>
      </div>
    );
  };

  export default ReviewForm;  