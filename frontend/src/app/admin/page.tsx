"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, TrendingUp, AlertTriangle, DollarSign, BarChart3, ShieldCheck, LogOut, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [heatMap, setHeatMap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/arbitrage/opportunities');
      setOpportunities(response.data.opportunities);

      // Generate heat map data based on opportunities
      // In a real app, this would be a separate API call to a set-trend analysis service
      const setTrends = {};
      response.data.opportunities.forEach((op: any) => {
        const setName = op.card_name.split(' ')[0] || 'Unknown';
        setTrends[setName] = (setTrends[setName] || 0) + parseFloat(op.profit_margin);
      });

      const mappedHeat = Object.entries(setTrends).map(([name, score]) => ({
        name,
        score,
        status: score > 50 ? 'HOT' : score > 20 ? 'WARM' : 'STABLE'
      })).sort((a, b) => b.score - a.score);

      setHeatMap(mappedHeat);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest">Admin Access Level 1</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Arbitrage Control Center</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </header>

        {/* Market Heat Map Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Global Market Heat Map</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heatMap.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 italic">
                No trend data available. Start listing cards to generate heat.
              </div>
            ) : (
              heatMap.map((set: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all cursor-default group relative overflow-hidden ${
                    set.status === 'HOT' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    set.status === 'WARM' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase block mb-1 opacity-60">{set.status}</span>
                    <span className="text-lg font-black truncate block">{set.name}</span>
                    <span className="text-xs font-mono">+{set.score.toFixed(1)}% Trend</span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full blur-2xl transition-opacity group-hover:opacity-100 opacity-40 ${
                    set.status === 'HOT' ? 'bg-red-500' :
                    set.status === 'WARM' ? 'bg-orange-500' : 'bg-slate-700'
                  }`} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Arbitrage Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> High-Profit Alerts
            </h2>
            <button onClick={fetchAdminData} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Card Name</th>
                  <th className="px-6 py-4 font-semibold">Seller</th>
                  <th className="px-6 py-4 font-semibold">Listed Price</th>
                  <th className="px-6 py-4 font-semibold">Market Value</th>
                  <th className="px-6 py-4 font-semibold">Profit Margin</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                      No arbitrage opportunities detected at the moment.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((op: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{op.card_name}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{op.seller_name}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono">${op.listed_price}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono">${op.market_price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          op.opportunity_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {op.profit_margin}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => window.open(`https://tcg-rlyx.onrender.com/marketplace`, '_blank')}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-500 transition-colors"
                        >
                          Buy Now
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
