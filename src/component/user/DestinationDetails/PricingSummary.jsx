import React from 'react';
import ShareButtons from './ShareButtons';

const PricingSummary = ({ price, destinationName }) => (
  <div className="bg-gray-50 p-6 rounded-2xl sticky top-8">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing Summary</h2>
    <div className="space-y-3 mb-6">
      <div className="flex justify-between">
        <span className="text-gray-600">Daily Cost</span>
        <span className="font-medium">${price.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Estimated 7 Days</span>
        <span className="font-medium">${(price * 7).toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3">
        <span className="text-gray-800 font-semibold">Total</span>
        <span className="text-lg font-bold text-blue-600">${(price * 7).toFixed(2)}</span>
      </div>
    </div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
      Plan Your Trip
    </button>
    
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Share this destination</h3>
      <ShareButtons destinationName={destinationName} />
    </div>
  </div>
);

export default PricingSummary;