import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import FilterControls from './FilterControls';
import ActiveFilters from './ActiveFilters';
import DestinationCard from './DestinationCard';
import NoResults from './NoResults';
import Newsletter from './Newsletter';

const TravelRecommendations = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const endpoint =
          activeFilter === 'Recommendation'
            ? `http://localhost:9000/api/v1/destination/recommend/${user.id}`
            : 'http://localhost:9000/api/v1/destination/list';

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Server returned ${response.status} status`);

        const data = await response.json();

        const transformedData = data.map(dest => {
          const combinedTags = [...(dest.recommendedFor || []), ...(dest.activityTags || [])];
          const uniqueTags = [...new Set(combinedTags)]
            .filter(tag => tag)
            .map(tag =>
              typeof tag === 'string' ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag
            );

          let imageUrl = fallbackImage;
          if (dest.imagePath) {
            imageUrl = `http://localhost:9000/images/${dest.imagePath}`;
          }

          return {
            id: dest.destinationId,
            name: dest.name,
            type: dest.type,
            rating: dest.averageRating || 0,
            price: dest.costPerDay || 0,
            image: imageUrl,
            tags: uniqueTags,
            description: dest.description || 'No description available',
          };
        });

        setDestinations(transformedData);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [activeFilter, user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setTimeout(() => navigate('/user/login'), 300);
  };

  const getUniqueTypes = () => {
    const types = destinations.map(dest => dest.type).filter(Boolean);
    return ['All', 'Recommendation', ...new Set(types)].sort();
  };

  const filters = getUniqueTypes();
  const priceRanges = [
    { label: '$0-50', min: 0, max: 50 },
    { label: '$50-100', min: 50, max: 100 },
    { label: '$100-200', min: 100, max: 200 },
    { label: '$200-300', min: 200, max: 300 },
    { label: '$300+', min: 300, max: Infinity }
  ];

  const filteredDestinations = destinations.filter(dest => {
    if (activeFilter === 'Recommendation') return true; // skip local filtering

    const matchesFilter = activeFilter === 'All' || dest.type === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      !priceRange || (dest.price >= priceRange.min && dest.price <= priceRange.max);

    return matchesFilter && matchesSearch && matchesPrice;
  });

  const clearFilters = () => {
    setActiveFilter('All');
    setPriceRange(null);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading destinations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">
          Error: {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <FilterControls
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          priceRanges={priceRanges}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearFilters={clearFilters}
          searchQuery={searchQuery}
        />

        <ActiveFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} fallbackImage={fallbackImage} />
          ))}
        </div>

        {filteredDestinations.length === 0 && !loading && (
          <NoResults clearFilters={clearFilters} />
        )}
      </div>

      <Newsletter />
    </div>
  );
};

export default TravelRecommendations;
