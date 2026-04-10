"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Tag, TrendingUp, ShieldCheck } from 'lucide-react';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const response = await api.get('/marketplace');
      setListings(response.data.listings);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Community Marketplace</h1>
            <p className="text-gray-500 mt-2">Browse cards listed for sale by other collectors</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
            <ShieldCheck className="w-3 h-3" /> Verified Listings
          </div>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No cards are currently listed for sale.</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to list your collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.card_name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ${item.listed_price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{item.card_name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 truncate">{item.set_name} • {item.rarity}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                      {item.condition}
                    </span>
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                      <User className="w-3 h-3" />
                      {item.seller_name}
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Purchase flow would be implemented here!')}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component since User icon was used but not imported
function User(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
