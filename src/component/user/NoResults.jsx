import { FiX } from 'react-icons/fi';
import AuthButton from './auth/AuthButton ';

const NoResults = ({ clearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <FiX className="text-gray-500 text-3xl" />
      </div>
      <h3 className="text-xl font-medium text-gray-600 mb-2">No destinations found</h3>
      <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>

      <div className="flex justify-center mt-6">
        <AuthButton 
          type="button" 
          fullWidth={false} 
          onClick={clearFilters}
        >
          Clear all filters
        </AuthButton>
      </div>
    </div>
  );
};

export default NoResults;
