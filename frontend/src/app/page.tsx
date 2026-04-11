"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HolographicCard from '@/components/HolographicCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-deep text-fg-main font-body overflow-hidden relative">
      {/* Cinematic Background: Aurora Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-electric/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-psychic/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent-gold via-accent-silver to-accent-gold animate-gradient-x">
              TCG NEXUS
            </h1>
            <div className="absolute -inset-4 bg-accent-gold/10 blur-2xl rounded-full -z-10" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-fg-muted text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
          >
            Enter the ultimate holographic arena. <br />
            <span className="text-accent-gold font-bold">Scan. Analyze. Profit.</span>
          </motion.p>

          {/* The Centerpiece: Floating Holographic Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 50 }}
            className="relative my-12 group"
          >
            <HolographicCard
              image="https://images.pokemontcg.io/base1/4.png"
              name="Charizard"
              rarity="Legendary"
              element="Fire"
              description="The ultimate fire-type titan, pulsing with legendary holographic energy."
            />
            {/* Glow effect behind the card */}
            <div className="absolute inset-0 bg-fire/20 blur-3xl rounded-full -z-10 animate-pulse group-hover:bg-fire/40 transition-colors" />
          </motion.div>

          {/* Action Pods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <Link href="/marketplace" className="group relative px-8 py-4 bg-bg-surface border border-accent-gold/30 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/0 via-accent-gold/20 to-accent-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 font-display font-bold text-fg-main group-hover:text-accent-gold transition-colors">
                ENTER MARKETPLACE
              </span>
            </Link>

            <Link href="/ai-scan" className="group relative px-8 py-4 bg-bg-surface border border-electric/30 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-electric/0 via-electric/20 to-electric/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 font-display font-bold text-fg-main group-hover:text-electric transition-colors">
                AI DAMAGE SCANNER
              </span>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Background Grain Overlay for Cinematic Feel */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
}
