"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HolographicCardProps {
  image: string;
  name: string;
  rarity?: "Common" | "Rare" | "Epic" | "Legendary";
  element?: "Electric" | "Fire" | "Psychic" | "Grass" | "Water";
  description?: string;
  className?: string;
}

export default function HolographicCard({
  image,
  name,
  rarity = "Rare",
  element = "Electric",
  description = "A mystical creature from the Neo-Region, pulsing with holographic energy.",
  className,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the tilt movement
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig);

  // Shimmer position based on rotation
  const shimmerX = useTransform(rotateY, [-10, 10], ["-150%", "150%"]);
  const shimmerY = useTransform(rotateX, [-10, 10], ["-150%", "150%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Elemental color mapping
  const elementColors = {
    Electric: "var(--color-electric)",
    Fire: "var(--color-fire)",
    Psychic: "var(--color-psychic)",
    Grass: "var(--color-grass)",
    Water: "var(--color-water)",
  };

  return (
    <div
      className={cn(
        "perspective-1000 group relative w-72 h-96 cursor-pointer",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full transition-transform duration-150 ease-out"
      >
        {/* Main Card Body */}
        <div
          className="relative w-full h-full rounded-lg overflow-hidden shadow-lg bg-bg-surface border-2 border-accent-silver/30"
          style={{
            boxShadow: "0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)",
            backgroundColor: "var(--color-bg-surface)"
          }}
        >
          {/* Holographic Foil Overlay */}
          <motion.div
            style={{
              left: shimmerX,
              top: shimmerY,
              background: "linear-gradient(135deg, transparent 20%, rgba(252,234,187,0.4) 50%, transparent 80%)",
            }}
            className="absolute inset-0 pointer-events-none z-20 w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Card Art Container */}
          <div className="relative w-full h-3/5 overflow-hidden border-b border-accent-silver/20">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Glass Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/60 to-transparent z-10" />
          </div>

          {/* Card Info */}
          <div className="p-4 flex flex-col gap-2 bg-bg-surface">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-xl font-bold text-fg-main tracking-tight">
                {name}
              </h3>
              <span
                className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full border border-accent-gold/50 text-accent-gold"
                style={{ borderColor: elementColors[element] }}
              >
                {rarity}
              </span>
            </div>

            <p className="text-xs text-fg-muted font-body leading-relaxed italic">
              {description}
            </p>

            {/* Element Tag */}
            <div
              className="mt-2 h-1 w-12 rounded-full"
              style={{ backgroundColor: elementColors[element] }}
            />
          </div>

          {/* Outer Glass Border / Glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border-[3px] border-white/10"
            style={{
              boxShadow: `inset 0 0 15px ${elementColors[element]}33`,
            }}
          />
        </div>
      </motion.div>

      {/* Ambient Shadow/Glow below the card */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/40 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </div>
  );
}
