import React from 'react';

const TravelInformation = ({ destination }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Travel Information</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-gray-500 text-sm font-medium">Best Season</h3>
        <p className="font-semibold text-gray-800">{destination.bestSeason}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-gray-500 text-sm font-medium">Daily Cost</h3>
        <p className="font-semibold text-gray-800">${destination.price.toFixed(2)}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-gray-500 text-sm font-medium">Popularity</h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, destination.popularity)}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{destination.popularity}%</span>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-gray-500 text-sm font-medium">Added On</h3>
        <p className="font-semibold text-gray-800">
          {new Date(destination.addedTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

export default TravelInformation;