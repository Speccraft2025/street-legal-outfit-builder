'use client';

import React from 'react';
import { products } from '@/data/products';
import ProductCarousel from './ProductCarousel';
import { Category } from '@/types';

const CATEGORIES: { name: Category; label: string; height: string }[] = [
  { name: 'Headgear', label: 'Headwear Tracks', height: 'h-[18%]' },
  { name: 'Tops', label: 'Tops Selections', height: 'h-[25%]' },
  { name: 'Bottoms', label: 'Bottoms Tracks', height: 'h-[25%]' },
  { name: 'Footgear', label: 'Footwear Tracks', height: 'h-[18%]' },
  { name: 'Accessories', label: 'Accessories Tracks', height: 'h-[14%]' },
];

export default function RightSidebar() {
  return (
    <div className="w-full h-full bg-background border-l border-border-subtle flex flex-col justify-between overflow-hidden select-none">
      {CATEGORIES.map((cat) => {
        const catProducts = products.filter((p) => p.category === cat.name);
        
        return (
          <div
            key={cat.name}
            className={`w-full relative border-b border-border-subtle last:border-b-0 flex flex-col justify-center overflow-hidden py-1 group/row ${cat.height}`}
          >
            {/* Carousel Category Header label */}
            <div className="absolute left-6 top-2 z-20 pointer-events-none flex items-center gap-2">
              <span className="text-[7px] uppercase font-black tracking-[0.3em] text-white/20 group-hover/row:text-accent transition-colors duration-300">
                {cat.label}
              </span>
              <div className="w-1 h-1 bg-surface-3 rounded-full group-hover/row:bg-chrome/40" />
            </div>

            {/* Horizontal Touch Snap Carousel Track */}
            <div className="w-full h-[85%] flex items-center">
              <ProductCarousel category={cat.name} products={catProducts} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
