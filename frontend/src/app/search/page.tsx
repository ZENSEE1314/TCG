"use client";

import React, { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Plus, Package, TrendingUp } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/cards?q=${encodeURIComponent(query)}`);
      setResults(response.data.cards);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch cards');
    } finally {
      setIsLoading(false);
    }
  };

  const addCardToCollection = async (card: any) => {
    try {
      // If the card is from the official API, it will have an externalId
      // In a real app, we would first save the card to our local db
      // to get a local ID, then add to collection.
      // For now, we use a simplified approach.
      await api.post('/collection/add', {
        cardId: card.id || card.externalId,
        quantity: 1
      });
      alert('Card added to your Dex!');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to add card');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Rare Cards</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Search millions of Pokémon cards and track their real-time market value.
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                placeholder="Search by name, set, or type... (e.g. Charizard)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        {results.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No cards found. Try a different search term!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((card: any) => (
            <div key={card.externalId || card.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img
                  src={card.image_url}
                  alt={card.card_name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm">
                  {card.price !== 'N/A' ? `$${card.price}` : 'N/A'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{card.card_name}</h3>
                <p className="text-xs text-gray-500 mb-4 truncate">{card.set_name} • {card.rarity}</p>
                <button
                  onClick={() => addCardToCollection(card)}
                  className="w-full py-2 bg-gray-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-3 h-3" /> Add to Dex
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
