"use client";

import React, { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, CheckCircle2, AlertCircle, ArrowRight, Upload, TrendingUp, Zap, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicCard from '@/components/HolographicCard';

export default function AIScannnerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [cardId, setCardId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !cardId) {
      setError('Please upload an image and enter a Card ID');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await api.post('/ai/analyze', {
        imageUrl: image,
        cardId: cardId
      });
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'AI Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCollection = async () => {
    try {
      await api.post('/collection/add', {
        cardId: cardId,
        condition: analysis.detectedCondition,
        quantity: 1
      });
      alert('Card added to your Dex with AI-verified condition!');
      router.push('/collection');
    } catch (err: any) {
      alert('Failed to add card');
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-fg-main font-body px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-electric/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fire/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-electric/10 text-electric border border-electric/30 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-glow"
          >
            <Zap className="w-3 h-3" /> AI Vision Engine v2.0
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent-gold via-accent-silver to-accent-gold mb-4">
            DAMAGE SCANNER
          </h1>
          <p className="text-fg-muted max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Upload a high-res capture. Our Neural Network analyzes whitening, centering, and surface scratches to verify the grade.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section: The "Input Terminal" */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-bg-surface p-8 rounded-3xl border border-accent-gold/20 shadow-lg backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-fg-muted block">Image Capture</label>
                <div
                  className={`relative h-80 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-500 ${image ? 'border-electric bg-electric/5' : 'border-fg-muted/20 bg-bg-muted/50 hover:border-electric/50'}`}
                >
                  {image ? (
                    <motion.img
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-lg p-4 shadow-2xl"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-gold/20 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-accent-gold" />
                      </div>
                      <p className="text-fg-muted font-medium">Drag and drop or click to upload</p>
                      <p className="text-xs text-fg-muted/50 mt-1">Recommended: 4K resolution, flat lay</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-fg-muted block">Card Identity Index</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-4 bg-bg-deep border border-fg-muted/20 rounded-xl focus:border-electric outline-none text-fg-main transition-all font-mono"
                    placeholder="ENTER CARD ID (e.g. 123)"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-fire/10 border border-fire/30 text-fire-400 rounded-xl text-center text-sm font-bold"
                >
                  {error}
                </motion.div>
              )}

              <button
                onClick={analyzeCard}
                disabled={isAnalyzing}
                className="w-full py-4 bg-gradient-to-r from-electric via-psychic to-electric bg-[length:200%_auto] animate-gradient-x text-bg-deep font-black rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-electric/20"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                {isAnalyzing ? 'PROCESSING NEURAL DATA...' : 'INITIALIZE AI SCAN'}
              </button>
            </div>
          </motion.div>

          {/* Results Section: The "HUD" */}
          <div className="space-y-6">
            {!analysis ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-bg-surface/30 rounded-3xl border border-accent-gold/10 backdrop-blur-md text-fg-muted">
                <div className="relative">
                  <div className="absolute inset-0 w-20 h-20 bg-accent-gold/20 blur-xl rounded-full animate-pulse" />
                  <Search className="w-16 h-16 text-accent-gold/40 relative z-10" />
                </div>
                <p className="mt-6 text-lg font-medium max-w-xs mx-auto">
                  Waiting for image input to generate Neural Analysis Report.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-bg-surface p-8 rounded-3xl shadow-2xl border border-electric/30 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="px-3 py-1 bg-electric text-bg-deep rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Confidence: {(analysis.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-electric/10 rounded-2xl border border-electric/30">
                    <ShieldCheck className="w-8 h-8 text-electric" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-fg-main">Neural Report</h2>
                    <p className="text-xs text-fg-muted uppercase tracking-widest">Verified Condition</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="p-6 bg-bg-deep/50 rounded-2xl border border-accent-gold/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-fg-muted uppercase tracking-widest block mb-1">Global Grade</span>
                    <div className="text-4xl font-display font-black text-accent-gold">{analysis.detectedCondition}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    < la-ReportItem label="Edge Whitening" value={analysis.findings.whitening} color="var(--color-electric)" />
                    < la-ReportItem label="Holo Scratches" value={analysis.findings.scratches} color="var(--color-psychic)" />
                    < la-ReportItem label="Centering" value={analysis.findings.centering} color="var(--color-grass)" />
                  </div>
                </div>

                <div className="p-6 bg-fire/10 rounded-2xl border border-fire/30 mb-10 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-fire" />
                    <span className="text-sm font-bold text-fire uppercase tracking-widest">Market Adjustment</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-fire">{(1 + analysis.suggestedPriceAdjustment) * 100}%</span>
                    <span className="text-xs text-fire/60 font-medium">of Mint value</span>
                  </div>
                </div>

                <button
                  onClick={addToCollection}
                  className="w-full py-4 bg-gradient-to-r from-grass via-electric to-grass bg-[length:200%_auto] animate-gradient-x text-bg-deep font-black rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-lg shadow-electric/20"
                >
                  <CheckCircle2 className="w-5 h-5" /> COMMIT TO DIGITAL DEX
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center p-4 bg-bg-deep/40 border border-fg-muted/10 rounded-xl backdrop-blur-sm transition-all hover:border-accent-gold/30 group">
      <span className="text-xs font-bold text-fg-muted uppercase tracking-wider group-hover:text-fg-main transition-colors">{label}</span>
      <span className="text-sm font-black" style={{ color }}>{value}</span>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

