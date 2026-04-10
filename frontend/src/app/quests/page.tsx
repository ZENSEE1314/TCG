"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Trophy, Coins, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function QuestPage() {
  const [data, setData] = useState({ credits: 0, quests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/quests/status');
      setData(response.data);
    } catch (err: any) {
      setError('Failed to load quest status');
    } finally {
      setIsLoading(false);
    }
  };

  const claimReward = async (questId: string) => {
    try {
      await api.post('/quests/claim-reward', { questId });
      await fetchStatus();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to claim reward');
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
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Quest Log</h1>
            <p className="text-gray-500 mt-2">Complete challenges to earn AI credits</p>
          </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200 shadow-sm">
              <Coins className="w-5 h-5" />
              <span className="font-bold text-lg">{data.credits} Credits</span>
            </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {data.quests.map((quest: any) => (
            <div key={quest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{quest.title}</h3>
                  <p className="text-sm text-gray-500">{quest.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase block">Reward</span>
                  <span className="text-lg font-black text-yellow-600">+{quest.reward} 🪙</span>
                </div>
                <button
                  onClick={() => claimReward(quest.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Zap className="w-3 h-3" /> Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
