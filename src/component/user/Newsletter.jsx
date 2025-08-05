import AuthButton from "./auth/AuthButton ";

const Newsletter = () => {
  return (
    <div className="bg-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Travel Inspiration</h2>
        <p className="text-gray-600 mb-6">Subscribe to receive weekly destination recommendations and travel tips</p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          
          <AuthButton 
            type="button" 
            fullWidth={false}
          >
            Subscribe
          </AuthButton>
        </div>

        <p className="text-xs text-gray-500 mt-3">We'll never share your email. Unsubscribe at any time.</p>
      </div>
    </div>
  );
};

export default Newsletter;
