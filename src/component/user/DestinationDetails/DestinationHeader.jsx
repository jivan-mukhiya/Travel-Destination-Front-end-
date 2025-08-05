import StarRating from "./StarRating";

const DestinationHeader = ({ destination, reviews, fallbackImage }) => (
  <div className="relative h-96 md:h-[500px]">
    <img 
      src={destination.image} 
      alt={destination.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.src = fallbackImage;
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{destination.name}</h1>
        <div className="flex flex-wrap items-center mt-3 gap-3">
          <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {destination.type}
          </span>
          <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <StarRating rating={destination.rating} />
            <span className="ml-2 text-white text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DestinationHeader;