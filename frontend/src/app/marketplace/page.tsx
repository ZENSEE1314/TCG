"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Tag, TrendingUp, ShieldCheck, User, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import HolographicCard from '@/components/HolographicCard';

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
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <Loader2 className="w-12 h-12 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-fg-main font-body px-4 py-12 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-psychic/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-silver to-accent-gold">
              THE VAULT
            </h1>
            <p className="text-fg-muted mt-2 text-lg font-medium">
              Acquire legendary assets from the global nexus.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-accent-gold/30 rounded-full text-xs font-bold text-accent-gold shadow-glow">
              <ShieldCheck className="w-4 h-4" />
              VERIFIED NEXUS LISTINGS
            </div>
          </div>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-fire/10 border border-fire/30 text-fire-400 rounded-2xl text-center font-bold backdrop-blur-md">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="text-center py-32 bg-bg-surface/50 rounded-3xl border border-accent-gold/10 backdrop-blur-xl shadow-lg max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-gold/20">
              <Tag className="w-10 h-10 text-accent-gold/40" />
            </div>
            <h2 className="text-2xl font-display font-bold text-fg-main mb-2">Vault is currently empty</h2>
            <p className="text-fg-muted text-lg mb-8">No legendary cards are listed for trade at this moment.</p>
            <Link
              href="/collection"
              className="px-8 py-3 bg-accent-gold text-bg-deep font-bold rounded-full hover:scale-105 transition-transform"
            >
              List Your Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {listings.map((item: any, idx: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col items-center group"
                >
                  <HolographicCard
                    image={item.image_url}
                    name={item.card_name}
                    rarity={item.rarity}
                    element={item.element || "Electric"}
                    description={`${item.set_name} • Condition: ${item.condition}`}
                  />

                  <div className="mt-6 w-72 p-4 bg-bg-surface/80 backdrop-blur-md rounded-2xl border border-accent-gold/20 shadow-lg transition-all group-hover:border-accent-gold/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-fg-muted" />
                        <span className="text-xs font-medium text-fg-muted">{item.seller_name}</span>
                      </div>
                      <div className="text-lg font-black text-accent-gold">${item.listed_price}</div>
                    </div>

                    <button
                      onClick={() => alert('Purchase flow would be implemented here!')}
                      className="w-full py-3 bg-gradient-to-r from-accent-gold via-accent-silver to-accent-gold text-bg-deep font-black rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-accent-gold/20"
                    >
                      ACQUIRE ASSET
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
