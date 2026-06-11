'use client';

import React, { useState, useEffect } from 'react';
import LeftSidebar from '@/components/builder/LeftSidebar';
import CenterStage from '@/components/builder/CenterStage';
import RightSidebar from '@/components/builder/RightSidebar';
import MobileBuilder from '@/components/builder/MobileBuilder';
import CartDrawer from '@/components/commerce/CartDrawer';
import FavoritesDrawer from '@/components/commerce/FavoritesDrawer';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, RotateCcw, Heart, Layers, Flame, Compass, FolderHeart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const { selectedItems, clearOutfit } = useOutfitStore();
  const { entries } = useCartStore();

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const cartCount = entries.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center relative select-none">
        <div className="w-12 h-12 bg-accent/5 border border-accent/20 rounded-full flex items-center justify-center animate-ping mb-4">
          <span className="w-3 h-3 bg-accent rounded-full" />
        </div>
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white/80 italic">STREET LEGAL</h1>
        <p className="text-[7px] uppercase tracking-[0.25em] text-accent font-mono mt-1.5 animate-pulse">Initializing OS v1.2_</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden relative selection:bg-accent selection:text-black">
      
      {/* Dynamic Background Noise Texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      {/* --- 1. DESKTOP MAIN THREE-COLUMN UI --- */}
      <div className="hidden md:flex flex-col h-full w-full">
        {/* Desktop Top Header Bar */}
        <header className="h-16 border-b border-border-subtle px-6 flex justify-between items-center z-40 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                Street<span className="text-accent">Legal</span>
              </h1>
              <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 mt-1">Outfit Operating System</p>
            </div>

            {/* Quick SEO Directory Navigation links */}
            <div className="h-6 w-px bg-surface-3" />
            <nav className="flex items-center gap-5 text-[9px] uppercase font-black tracking-widest text-white/40">
              <Link href="/" className="text-accent flex items-center gap-1.5"><Layers size={10} /> Builder</Link>
              <Link href="/community" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><Compass size={10} /> Community Feed</Link>
              <Link href="/closet" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><FolderHeart size={10} /> Closet Library</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Reset current styling selection */}
            <button 
              onClick={clearOutfit} 
              disabled={selectedCount === 0}
              className="group flex items-center gap-2 p-2 px-4 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-full transition-all disabled:opacity-20 disabled:pointer-events-none"
            >
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 group-hover:text-foreground transition-colors">Reset Fit</span>
              <RotateCcw size={11} className="text-white/40 group-hover:rotate-[-180deg] transition-transform duration-500" />
            </button>

            {/* Likes Drawer Quick Trigger */}
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="p-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-full text-white/50 hover:text-foreground transition-all relative"
            >
              <Heart size={13} />
            </button>

            {/* Shopping Cart Quick Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 bg-accent text-black rounded-full font-black flex items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all relative glow-primary"
            >
              <ShoppingBag size={13} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[7px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Three Column Grid layout */}
        <div className="flex-1 grid grid-cols-[340px_1fr_440px] min-h-0">
          <LeftSidebar />
          <CenterStage />
          <RightSidebar />
        </div>
      </div>

      {/* --- 2. MOBILE-FIRST APP BUILDER INTERFACE --- */}
      <div className="flex md:hidden flex-col h-full w-full">
        <MobileBuilder 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onNavigate={(tab) => {}} 
        />

        {/* Mobile Sticky App Bottom Tabs navigation */}
        <footer className="h-16 border-t border-border-subtle bg-black/60 backdrop-blur-xl flex justify-around items-center z-40">
          <Link href="/" className="flex flex-col items-center gap-1 text-accent">
            <Layers size={16} />
            <span className="text-[7px] uppercase font-black tracking-widest">Builder</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center gap-1 text-white/40 hover:text-foreground transition-colors">
            <Compass size={16} />
            <span className="text-[7px] uppercase font-black tracking-widest">Community</span>
          </Link>
          <Link href="/closet" className="flex flex-col items-center gap-1 text-white/40 hover:text-foreground transition-colors">
            <FolderHeart size={16} />
            <span className="text-[7px] uppercase font-black tracking-widest">Closet</span>
          </Link>
        </footer>
      </div>

      {/* --- 3. COMMERCE OVERLAYS / PORTAL DRAWERS --- */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </main>
  );
}
