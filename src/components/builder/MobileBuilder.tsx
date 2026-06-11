'use client';

import React, { useState } from 'react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { products } from '@/data/products';
import OutfitVisualizer from './OutfitVisualizer';
import ProductCarousel from './ProductCarousel';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Shuffle, 
  Undo2, 
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { Category, Product, Outfit } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileBuilderProps {
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onNavigate: (tab: string) => void;
}

export default function MobileBuilder({ onOpenCart, onOpenFavorites, onNavigate }: MobileBuilderProps) {
  const { 
    selectedItems, 
    visualMode, 
    setVisualMode, 
    randomizeOutfit, 
    undo, 
    canUndo,
    getTotalPrice 
  } = useOutfitStore();

  const { addOutfit } = useCartStore();

  // Active Category Swipe Track in Mobile (one shown at a time)
  const [activeCategory, setActiveCategory] = useState<Category>('Tops');
  
  const { total, isBundle, discount } = getTotalPrice();
  const activeProducts = products.filter((p) => p.category === activeCategory);
  
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const handleAddBundleToCart = () => {
    if (selectedCount === 0) return;

    const fitPayload: Outfit = {
      name: 'MOBILE FIT',
      slug: 'mobile-fit',
      share_code: Math.random().toString(36).substring(2, 6).toUpperCase(),
      visibility: 'public',
      items: selectedItems,
    };

    addOutfit(fitPayload);
    onOpenCart();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-background text-foreground relative overflow-hidden select-none">
      
      {/* Mobile Top Bar */}
      <header className="h-14 border-b border-border-subtle flex items-center justify-between px-4 z-40 bg-black/60 backdrop-blur-md">
        <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">
          Street<span className="text-accent">Legal</span>
        </h1>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-white/50 hover:text-foreground transition-colors" title="Search">
            <Search size={16} />
          </button>
          <button onClick={onOpenFavorites} className="p-2 text-white/50 hover:text-foreground transition-colors relative" title="Favorites">
            <Heart size={16} />
          </button>
          <button onClick={onOpenCart} className="p-2 text-white/50 hover:text-foreground transition-colors relative" title="Shopping Bag">
            <ShoppingBag size={16} />
          </button>
        </div>
      </header>

      {/* Center Visualization Stage (60% Height) */}
      <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px]">
        {selectedCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 z-10 max-w-[240px]">
            <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center border border-accent/20 mb-3 animate-pulse">
              <Sparkles size={16} className="text-accent" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-widest text-white/80">DESIGN YOUR IDENTITY</h2>
            <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] leading-relaxed mt-1.5">
              Swipe items below or randomize to construct a look.
            </p>
          </div>
        ) : (
          <OutfitVisualizer
            selectedItems={selectedItems}
            visualMode={visualMode}
            zoom={0.9}
            rotation={0}
          />
        )}

        {/* Orbit mode pills floating on visualizer */}
        <div className="absolute top-4 left-4 z-20 flex gap-1.5">
          {[
            { id: 'flat-lay', label: 'Flat' },
            { id: 'human-model', label: 'Model' },
            { id: 'avatar-3d', label: '3D' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setVisualMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-full text-[7px] uppercase font-black tracking-widest transition-all ${
                visualMode === mode.id
                  ? 'bg-accent text-black shadow-premium'
                  : 'bg-surface-2 border-border-subtle text-white/50 border border-border-subtle'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Floating Shuffle & Undo keys */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="w-8 h-8 rounded-full bg-black/60 border border-border-subtle flex items-center justify-center text-white/40 hover:text-foreground disabled:opacity-20 transition-all backdrop-blur-md"
            title="Undo"
          >
            <Undo2 size={12} />
          </button>
          <button
            onClick={randomizeOutfit}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black shadow-premium hover:scale-105 active:scale-95 transition-all"
            title="Shuffle"
          >
            <Shuffle size={12} />
          </button>
        </div>
      </div>

      {/* Category Horizontal Selector Rail */}
      <div className="w-full bg-surface-1 border-t border-border-subtle pt-1.5 select-none">
        <div className="flex overflow-x-auto no-scrollbar gap-1 px-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'Headgear', label: 'Headwear' },
            { id: 'Tops', label: 'Tops' },
            { id: 'Bottoms', label: 'Bottoms' },
            { id: 'Footgear', label: 'Footwear' },
            { id: 'Accessories', label: 'Accs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as Category)}
              className={`flex-shrink-0 px-4 py-2 text-[9px] uppercase font-black tracking-widest border-b-2 transition-all ${
                activeCategory === tab.id
                  ? 'border-accent text-accent font-black'
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Active Swiper Track (22% Height equivalent) */}
        <div className="w-full h-32 flex items-center border-t border-border-subtle/10 py-1 bg-black">
          <ProductCarousel category={activeCategory} products={activeProducts} />
        </div>
      </div>

      {/* Bottom Sticky Purchase Bar */}
      <div className="w-full p-3 bg-surface border-t border-border-subtle bg-black/85 backdrop-blur-2xl">
        <div className="bg-surface-2 border-border-subtle border border-border p-3 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] uppercase font-black tracking-widest text-white/40">
              {selectedCount} layers selected
            </span>
            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <span className="text-sm font-black tracking-tight italic text-foreground truncate">
                KES {total.toLocaleString()}
              </span>
              {isBundle && (
                <span className="bg-accent text-black text-[6px] font-black uppercase italic px-1 rounded">
                  BUNDLE
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            disabled={selectedCount === 0}
            className="flex-shrink-0 bg-accent disabled:bg-surface-2 border-border-subtle disabled:text-white/20 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-1 hover:scale-105 active:scale-95 transition-all glow-primary"
          >
            Buy look <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
