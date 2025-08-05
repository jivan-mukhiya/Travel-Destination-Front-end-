import { FiX } from 'react-icons/fi';

const ActiveFilters = ({ activeFilter, setActiveFilter, priceRange, setPriceRange }) => {
 if ((activeFilter === 'All' || activeFilter === 'Recommendation') && !priceRange) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
      <span className="text-gray-600">Active filters:</span>
      {activeFilter !== 'All' && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          {activeFilter}
          <button 
            onClick={() => setActiveFilter('All')}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <FiX size={14} />
          </button>
        </span>
      )}
      {priceRange && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          {priceRange.label}
          <button 
            onClick={() => setPriceRange(null)}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <FiX size={14} />
          </button>
        </span>
      )}
    </div>
  );
};

export default ActiveFilters;