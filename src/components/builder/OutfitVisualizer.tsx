'use client';

import React from 'react';
import { Product, Category } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemGraphic, isIconImage, getIconType } from './ItemGraphic';

interface OutfitVisualizerProps {
  selectedItems: Partial<Record<Category, Product>>;
  zoom: number;
  rotation: number;
}

export default function OutfitVisualizer({
  selectedItems,
  zoom,
  rotation
}: OutfitVisualizerProps) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500"
      style={{
        transform: `scale(${zoom}) rotateY(${rotation}deg)`,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-full h-full flex items-center justify-center min-h-[400px] md:min-h-[550px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Sleek aesthetic Human Silhouette Backdrop */}
        <HumanSilhouette />

        {/* Layer Stacked Clothes */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          <AnimatePresence>
            {/* Headgear Layer */}
            <ModelLayer key={`h-${selectedItems.Headgear?.id}`} category="Headgear" product={selectedItems.Headgear} className="top-[3%] h-[18%] z-40" zOffset={30} />

            {/* Accessories: Eyewear overlay on Head / Sling across torso */}
            {selectedItems.Accessories && (
              <ModelLayer
                key={`a-${selectedItems.Accessories.id}`}
                category="Accessories"
                product={selectedItems.Accessories}
                className={getIconType(selectedItems.Accessories.image) === 'glasses' ? 'top-[9%] h-[8%] z-50' : 'top-[22%] h-[20%] z-40 scale-x-90 opacity-90'}
                zOffset={40}
              />
            )}

            {/* Tops Layer */}
            <ModelLayer key={`t-${selectedItems.Tops?.id}`} category="Tops" product={selectedItems.Tops} className="top-[18%] h-[32%] z-30" zOffset={20} />

            {/* Bottoms Layer */}
            <ModelLayer key={`b-${selectedItems.Bottoms?.id}`} category="Bottoms" product={selectedItems.Bottoms} className="top-[44%] h-[34%] z-20" zOffset={10} />

            {/* Footgear Layer */}
            <ModelLayer key={`f-${selectedItems.Footgear?.id}`} category="Footgear" product={selectedItems.Footgear} className="top-[73%] h-[22%] z-10" zOffset={0} />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Layer overlay for Anatomical Silhouette
function ModelLayer({ category, product, className, zOffset = 0 }: { category: Category; product?: Product; className?: string; zOffset?: number }) {
  if (!product) {
    // Return a sleek glowing dotted box placeholder if slot is empty
    return (
      <div
        className={`absolute left-1/2 w-[40%] flex items-center justify-center border border-dashed border-accent/20 bg-accent/[0.01] rounded-2xl ${(className ?? '').replace('-translate-x-1/2', '')}`}
        style={{ transform: `translateX(-50%) translateZ(${zOffset}px)` }}
      >
        <span className="text-[6px] md:text-[8px] uppercase tracking-widest font-black text-accent/30 animate-pulse">
          Swipe {category}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`absolute left-1/2 w-[70%] md:w-[65%] flex items-center justify-center transition-all duration-700 pointer-events-none ${(className ?? '').replace('-translate-x-1/2', '').replace('scale-x-90', '')}`}
      style={{ transform: `translateX(-50%) translateZ(${zOffset}px) ${className?.includes('scale-x-90') ? 'scaleX(0.9)' : ''}` }}
    >
      {isIconImage(product.image) ? (
        category === 'Accessories' ? (
          // Compact badge treatment for small accent items (shades, bags, watches)
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/30">
            <ItemGraphic image={product.image} strokeWidth={1.5} className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
        ) : (
          // Full silhouette-filling line art for apparel without real photography
          <ItemGraphic
            image={product.image}
            strokeWidth={1}
            className="max-w-full max-h-full w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
            style={{ color: 'var(--foreground)' }}
          />
        )
      ) : (
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        />
      )}
    </div>
  );
}

// Silhouette backdrop graphic
function HumanSilhouette() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none scale-90">
      {/* High-end vector outline of a human model */}
      <svg
        viewBox="0 0 100 200"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="0.8"
        className="w-full h-full max-h-[82vh]"
      >
        {/* Head */}
        <circle cx="50" cy="18" r="7" />
        {/* Neck */}
        <path d="M48 25h4v5h-4z" />
        {/* Torso & Arms */}
        <path d="M35 32c5-2 25-2 30 0l2 25-6 1h-4v36h-14V58h-4l-6-1 2-25z" />
        {/* Legs & Feet */}
        <path d="M42 94h16l2 70-8 6-8-6 2-70z" />
      </svg>
    </div>
  );
}
