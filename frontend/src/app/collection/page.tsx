"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Loader2, Package, Plus, Trash2, TrendingUp, LogOut, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicCard from '@/components/HolographicCard';

interface CardItem {
  card_id: string;
  card_name: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  condition: string;
  quantity: number;
  is_listed: boolean;
  listed_price: number | null;
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addCardId, setAddCardId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const response = await api.get('/collection');
      setCollection(response.data.collection);
    } catch (err: any) {
      setError('Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setError('');

    try {
      await api.post('/collection/add', { cardId: addCardId });
      setAddCardId('');
      await fetchCollection();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add card');
    } finally {
      setIsAdding(false);
    }
  };

  const removeCard = async (cardId: string) => {
    if (!confirm('Remove this card from your collection?')) return;
    try {
      await api.delete(`/collection/${cardId}`);
      await fetchCollection();
    } catch (err) {
      alert('Failed to remove card');
    }
  };

  const toggleListing = async (cardId: string) => {
    try {
      let price = null;
      const currentItem = collection.find((c) => c.card_id === cardId);

      if (!currentItem?.is_listed) {
        const inputPrice = prompt('Enter the listing price for this card:');
        if (!inputPrice) return;
        price = parseFloat(inputPrice);
        if (isNaN(price)) {
          alert('Please enter a valid number for the price.');
          return;
        }
      }

      await api.patch(`/marketplace/list/${cardId}`, { price });
      await fetchCollection();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update listing status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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
      {/* HUD Frame Overlay */}
      <div className="hud-frame pointer-events-none z-50 border-accent-gold/10" />

      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-psychic/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="scanline" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-silver to-accent-gold uppercase">
              Digital Dex
            </h1>
            <p className="text-fg-muted mt-2 text-lg font-medium tracking-wide uppercase text-xs">
              Asset Management // Neural Archive
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="gaming-button px-6 py-2 text-xs font-bold text-fg-main uppercase tracking-widest flex items-center gap-2 hover:text-fire transition-colors"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Card Section: Neural Input Terminal */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="gaming-border p-8 space-y-6 backdrop-blur-md bg-bg-surface/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent" />

              <h2 className="text-sm font-black text-accent-gold uppercase tracking-widest flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-electric rounded-full animate-ping" />
                Neural Input Terminal
              </h2>

              <form onSubmit={handleAddCard} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-fg-muted uppercase tracking-[0.2em] block">
                    Card Identity Index
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-bg-deep border border-fg-muted/20 rounded-lg focus:border-electric outline-none text-fg-main transition-all font-mono text-sm"
                    placeholder="ENTER CARD ID (e.g. 1)"
                    value={addCardId}
                    onChange={(e) => setAddCardId(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-fire/10 border border-fire/30 text-fire text-xs font-bold rounded-lg text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full py-4 bg-gradient-to-r from-electric via-psychic to-electric bg-[length:200%_auto] animate-gradient-x text-bg-deep font-black rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-electric/20 uppercase tracking-widest text-xs"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isAdding ? 'SYNCING DATA...' : 'SINK TO DEX'}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Collection Grid: The Archive */}
          <div className="lg:col-span-2">
            {collection.length === 0 ? (
              <div className="text-center py-32 bg-bg-surface/30 rounded-3xl border border-accent-gold/10 backdrop-blur-xl shadow-lg max-w-2xl mx-auto text-fg-muted">
                <div className="w-20 h-20 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-gold/20">
                  <Package className="w-10 h-10 text-accent-gold/40" />
                </div>
                <h2 className="text-2xl font-display font-bold text-fg-main mb-2">Archive Empty</h2>
                <p className="text-lg mb-8 opacity-60">No neural assets detected in your current directory.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AnimatePresence mode="popLayout">
                  {collection.map((item: any, idx: number) => (
                    <motion.div
                      key={item.card_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <HolographicCard
                          image={item.image_url}
                          name={item.card_name}
                          rarity={item.rarity}
                          element={item.element || "Electric"}
                          description={`${item.set_name} • #${item.card_number}`}
                        />
                        <div className="absolute -inset-4 bg-electric/5 blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="mt-6 w-full max-w-[320px] p-5 gaming-border backdrop-blur-md bg-bg-surface/80 space-y-4 transition-all group-hover:border-accent-gold/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-fg-main">{item.card_name}</h3>
                            <p className="text-[10px] text-fg-muted uppercase tracking-widest font-mono">{item.set_name} // #{item.card_number}</p>
                          </div>
                          <button
                            onClick={() => removeCard(item.card_id)}
                            className="p-2 text-fg-muted hover:text-fire transition-colors bg-bg-deep/50 rounded-lg border border-fg-muted/10"
                            title="Remove Asset"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-bg-deep/50 rounded-lg border border-accent-gold/10">
                          <span className="text-[10px] font-black text-fg-muted uppercase tracking-tighter">Condition</span>
                          <span className="text-xs font-bold text-electric uppercase tracking-widest">{item.condition}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-bg-deep/50 rounded-lg border border-accent-gold/10">
                          <span className="text-[10px] font-black text-fg-muted uppercase tracking-tighter">Quantity</span>
                          <div className="flex items-center gap-1 text-grass font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            {item.quantity}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleListing(item.card_id)}
                          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            item.is_listed
                              ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500/20'
                              : 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30 hover:bg-accent-gold/20'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {item.is_listed ? `Listed for $${item.listed_price}` : 'Initiate Listing'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
