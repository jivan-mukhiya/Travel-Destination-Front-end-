import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import AuthButton from './auth/AuthButton ';

const FilterControls = ({
  filters,
  activeFilter,
  setActiveFilter,
  priceRanges,
  priceRange,
  setPriceRange,
  showFilters,
  setShowFilters,
  clearFilters,
  searchQuery
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended Destinations</h2>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <FiFilter className="text-gray-600" />
            <span className="text-gray-600">Filters:</span>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-1 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <FiFilter className="text-gray-600" />
            <span>Filters</span>
            <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

         {(activeFilter !== 'All' || priceRange || searchQuery) && (
  <button
    type="button"
    onClick={clearFilters}
    className="flex items-center space-x-1 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
  >
    <FiX />
    <span>Clear all</span>
  </button>
)}
        </div>
      </div>

      {showFilters && (
        <div className="md:hidden bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-medium mb-3">Category</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="flex flex-wrap gap-3">
            {priceRanges.map(range => (
              <button
                key={range.label}
                onClick={() => setPriceRange(priceRange?.label === range.label ? null : range)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceRange?.label === range.label ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}

      
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-gray-600 self-center">Category:</span>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="text-gray-600 self-center">Price:</span>
          {priceRanges.map(range => (
            <button
              key={range.label}
              onClick={() => setPriceRange(priceRange?.label === range.label ? null : range)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceRange?.label === range.label ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
