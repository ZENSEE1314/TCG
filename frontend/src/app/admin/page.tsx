"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, TrendingUp, AlertTriangle, DollarSign, BarChart3, ShieldCheck, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchArbitrage();
  }, []);

  const fetchArbitrage = async () => {
    try {
      const response = await api.get('/arbitrage/opportunities');
      setOpportunities(response.data.opportunities);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load arbitrage data');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Access Level 1</span>
            </div>
            <h1 className="text-3xl font-black text-white">Arbitrage Control Center</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Active Opportunities"
            value={opportunities.length}
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            color="green"
          />
          <StatCard
            label="Avg. Profit Margin"
            value={opportunities.length > 0 ? `${(opportunities.reduce((acc, curr) => acc + parseFloat(curr.profit_margin), 0) / opportunities.length).toFixed(1)}%` : '0%'}
            icon={<DollarSign className="w-6 h-6 text-blue-500" />}
            color="blue"
          />
          <StatCard
            label="Market Heat"
            value="Bullish"
            icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
            color="orange"
          />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Arbitrage Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> High-Profit Alerts
            </h2>
            <button onClick={fetchArbitrage} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
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

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-lg bg-slate-800`}>{icon}</div>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
