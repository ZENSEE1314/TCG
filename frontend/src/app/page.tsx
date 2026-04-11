"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HolographicCard from '@/components/HolographicCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-deep text-fg-main font-body overflow-hidden relative">
      {/* HUD Overlay Frame */}
      <div className="hud-frame pointer-events-none z-50 border-accent-gold/10">
        <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono text-accent-gold/50 uppercase tracking-widest">
          <span className="w-2 h-2 bg-electric animate-pulse rounded-full" />
          System Status: Operational
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono text-accent-gold/50 uppercase tracking-widest">
          Coord: 42.001 // 118.202
          <span className="w-2 h-2 bg-electric animate-pulse rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-accent-gold/50 uppercase tracking-widest">
          S-Nexus v2.0.4-beta
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-accent-gold/50 uppercase tracking-widest">
          Auth: Admin_Level_1
        </div>
      </div>

      {/* Background Aura */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-electric/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-psychic/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
        <div className="scanline" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Hero Centerpiece */}
        <div className="flex flex-col items-center gap-12 max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent-gold via-accent-silver to-accent-gold italic uppercase">
              TCG NEXUS
            </h1>
            <div className="absolute -inset-10 bg-accent-gold/20 blur-3xl rounded-full -z-10 animate-pulse" />
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-16 justify-center">
            {/* Left Side: Technical Specs HUD */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="gaming-border p-6 w-80 text-left space-y-4 backdrop-blur-md bg-bg-surface/50"
            >
              <div className="flex items-center gap-2 text-accent-gold font-mono text-xs font-bold uppercase tracking-widest border-b border-accent-gold/20 pb-2">
                <div className="w-2 h-2 bg-electric rounded-full animate-ping" />
                Neural Analysis
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-fg-muted">Detection Rate:</span>
                  <span className="text-electric">99.8%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-fg-muted">Precision:</span>
                  <span className="text-electric">0.001mm</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-fg-muted">S-Grades:</span>
                  <span className="text-accent-gold">Active</span>
                </div>
              </div>
              <div className="pt-4 border-t border-accent-gold/10">
                <p className="text-[10px] text-fg-muted italic leading-relaxed">
                  S-Nexus provides real-time market arbitrage and neural damage analysis for high-value TCG assets.
                </p>
              </div>
            </motion.div>

            {/* The 3D Card centerpiece */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.8, duration: 1, type: "spring" }}
              className="relative group"
            >
              <HolographicCard
                image="https://images.pokemontcg.io/base1/4.png"
                name="Charizard"
                rarity="Legendary"
                element="Fire"
                description="The ultimate fire-type titan, pulsing with legendary holographic energy."
              />
              <div className="absolute -inset-10 bg-fire/20 blur-3xl rounded-full -z-10 animate-pulse" />
            </motion.div>

            {/* Right Side: Navigation Module */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="gaming-border p-6 w-80 text-left space-y-4 backdrop-blur-md bg-bg-surface/50"
            >
              <div className="flex items-center gap-2 text-accent-gold font-mono text-xs font-bold uppercase tracking-widest border-b border-accent-gold/20 pb-2">
                <div className="w-2 h-2 bg-electric rounded-full animate-ping" />
                System Navigation
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/marketplace" className="gaming-button px-4 py-3 text-xs font-bold text-fg-main uppercase tracking-widest flex items-center gap-3">
                  <span className="text-accent-gold">01</span> The Vault
                </Link>
                <Link href="/ai-scan" className="gaming-button px-4 py-3 text-xs font-bold text-fg-main uppercase tracking-widest flex items-center gap-3">
                  <span className="text-accent-gold">02</span> Neural Scan
                </Link>
                <Link href="/collection" className="gaming-button px-4 py-3 text-xs font-bold text-fg-main uppercase tracking-widest flex items-center gap-3">
                  <span className="text-accent-gold">03</span> Digital Dex
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 text-fg-muted font-mono text-[10px] uppercase tracking-[0.3em] opacity-40"
          >
            Initialize Connection // Enter The Nexus
          </motion.div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
}
