"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, TrendingUp, Calendar, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [card, setCard] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCardData();
  }, [params.id]);

  const fetchCardData = async () => {
    try {
      setIsLoading(true);
      const cardRes = await api.get(`/cards/${params.id}`);
      const historyRes = await api.get(`/cards/${params.id}/history`);

      setCard(cardRes.data);
      setHistory(historyRes.data.history);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load card details');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Card Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => router.push('/search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Visual Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-6 relative group">
                <img src={card.image_url} alt={card.card_name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-black text-gray-900 mb-2">{card.card_name}</h1>
                <p className="text-gray-500 text-sm mb-6">{card.set_name} • #{card.card_number}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Rarity</span>
                    <span className="font-bold text-gray-800">{card.rarity}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Type</span>
                    <span className="font-bold text-gray-800">{card.card_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Overview */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Market Valuation</h2>
                  <p className="text-sm text-gray-500">Real-time data from TCGPlayer</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-blue-600">${card.price || 'N/A'}</span>
                  <div className="flex items-center gap-1 text-green-600 text-xs font-bold justify-end">
                    <TrendingUp className="w-3 h-3" /> +2.4% (30d)
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div className="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date_recorded"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickFormatter={(tick) => new Date(tick).toLocaleDate('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600" /> Market Price</div>
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 30 Day Window</div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Add to Collection</h3>
                  <p className="text-xs text-gray-500">Save this card to your digital Dex</p>
                </div>
              </div>
              <button
                onClick={() => alert('Adding to collection...')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M3 12h18"/></svg>
  );
}
