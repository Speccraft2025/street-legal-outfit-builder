'use client';

import React, { useState, useEffect } from 'react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { products } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { 
  Heart, 
  Repeat2, 
  ShoppingBag, 
  Flame, 
  Compass, 
  Award, 
  Layers, 
  FolderHeart,
  ChevronRight,
  TrendingUp,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category, Product, Outfit } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

// Mock high-end community outfits mapped to real database products
const COMMUNITY_OUTFITS = [
  {
    id: 'c1',
    name: 'VOID STEALTH PROTOCOL',
    creator: '@cyber_ninja',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ninja',
    likes: 1420,
    remixes: 342,
    vibe: 'tech',
    items: {
      Headgear: products.find(p => p.id === 'h1'),
      Tops: products.find(p => p.id === 't2'),
      Bottoms: products.find(p => p.id === 'b1'),
      Footgear: products.find(p => p.id === 'f2'),
      Accessories: products.find(p => p.id === 'a1'),
    }
  },
  {
    id: 'c2',
    name: 'CHRONO AXON WAVE',
    creator: '@stealth_hype',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chrono',
    likes: 980,
    remixes: 124,
    vibe: 'cyber',
    items: {
      Headgear: products.find(p => p.id === 'h2'),
      Tops: products.find(p => p.id === 't1'),
      Bottoms: products.find(p => p.id === 'b2'),
      Footgear: products.find(p => p.id === 'f1'),
      Accessories: products.find(p => p.id === 'a3'),
    }
  },
  {
    id: 'c3',
    name: 'MINIMAL ZENITH CUT',
    creator: '@minimal_core',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=minimal',
    likes: 850,
    remixes: 92,
    vibe: 'minimal',
    items: {
      Headgear: products.find(p => p.id === 'h3'),
      Tops: products.find(p => p.id === 't3'),
      Bottoms: products.find(p => p.id === 'b3'),
      Footgear: products.find(p => p.id === 'f3'),
      Accessories: products.find(p => p.id === 'a2'),
    }
  }
];

export default function CommunityPage() {
  const router = useRouter();
  const { addOutfit } = useCartStore();
  
  const [activeVibe, setActiveVibe] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleRemix = (items: Partial<Record<Category, Product>>) => {
    // Extract IDs from items
    const ids = Object.values(items).map(i => i?.id).filter(Boolean).join(',');

    triggerToast('Outfit loaded in swiper! Redirecting...');
    
    setTimeout(() => {
      router.push(`/?outfit=${ids}`);
    }, 800);
  };

  const handleBuy = (name: string, items: Partial<Record<Category, Product>>) => {
    const cleanedItems: Partial<Record<Category, Product>> = {};
    Object.entries(items).forEach(([cat, prod]) => {
      if (prod) cleanedItems[cat as Category] = prod;
    });

    const fitPayload: Outfit = {
      name: `${name} (REMIX)`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      share_code: Math.random().toString(36).substring(2, 6).toUpperCase(),
      visibility: 'public',
      items: cleanedItems,
    };

    addOutfit(fitPayload);
    triggerToast('Look added to Shopping Bag!');
  };

  const filteredFits = activeVibe === 'all' 
    ? COMMUNITY_OUTFITS 
    : COMMUNITY_OUTFITS.filter(fit => fit.vibe === activeVibe);

  return (
    <main className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden relative selection:bg-accent selection:text-black">
      
      {/* Toast popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 bg-accent text-black text-xs font-black uppercase px-6 py-3 rounded-full glow-primary z-50 flex items-center gap-2 pointer-events-none"
          >
            <Flame size={14} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="h-16 border-b border-border-subtle px-6 flex justify-between items-center z-40 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
              Street<span className="text-accent">Legal</span>
            </h1>
            <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 mt-1">Outfit Operating System</p>
          </div>
          
          <div className="h-6 w-px bg-surface-3 hidden md:block" />
          <nav className="hidden md:flex items-center gap-5 text-[9px] uppercase font-black tracking-widest text-white/40">
            <Link href="/" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><Layers size={10} /> Builder</Link>
            <Link href="/community" className="text-accent flex items-center gap-1.5"><Compass size={10} /> Community Feed</Link>
            <Link href="/closet" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><FolderHeart size={10} /> Closet Library</Link>
          </nav>
        </div>
      </header>

      {/* Main scrolling layout */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full min-h-0 select-none pb-24 md:pb-8">
        
        {/* LEFT COLUMN: Community Feed Feed (65% width) */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-accent text-[8px] font-black uppercase tracking-[0.25em] mb-1">
                <TrendingUp size={10} /> Live Street Feed
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">Trending Outfits</h2>
            </div>

            {/* Vibe search badges */}
            <div className="flex flex-wrap bg-surface-2 border-border-subtle border border-border-subtle p-1 rounded-2xl">
              {[
                { id: 'all', label: 'All fits' },
                { id: 'tech', label: 'Tech' },
                { id: 'cyber', label: 'Cyber' },
                { id: 'minimal', label: 'Minimal' }
              ].map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => setActiveVibe(vibe.id)}
                  className={`px-3 py-1.5 text-[8px] uppercase font-black tracking-wider rounded-xl transition-all ${
                    activeVibe === vibe.id 
                      ? 'bg-accent text-black font-black' 
                      : 'text-white/40 hover:text-foreground'
                  }`}
                >
                  {vibe.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfits Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFits.map((fit) => {
              const outfitItemsList = Object.values(fit.items).filter(Boolean) as Product[];
              const totalVal = outfitItemsList.reduce((sum, item) => sum + item.price, 0);

              return (
                <div 
                  key={fit.id}
                  className="glass rounded-3xl border border-border-subtle p-5 flex flex-col justify-between hover:border-border hover:shadow-premium transition-all duration-300"
                >
                  <div>
                    {/* User profile card header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={fit.avatar} 
                          alt={fit.creator} 
                          className="w-7 h-7 bg-surface-2 border-border-subtle border border-border rounded-full"
                        />
                        <div>
                          <p className="text-[10px] font-black text-white/90">{fit.creator}</p>
                          <p className="text-[7px] text-accent uppercase tracking-widest font-bold">{fit.vibe} streetwear</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-white/30 uppercase">Fit Value: KES {totalVal.toLocaleString()}</span>
                    </div>

                    {/* Outfit Collage layout */}
                    <div className="grid grid-cols-4 gap-2.5 my-4 bg-black/40 border border-border-subtle p-3 rounded-2xl">
                      {['Headgear', 'Tops', 'Bottoms', 'Footgear'].map((cat) => {
                        const product = fit.items[cat as Category];
                        return (
                          <div 
                            key={cat}
                            className="aspect-square bg-surface-2 border-border-subtle border border-border-subtle rounded-xl flex items-center justify-center p-1.5 relative group/thumb"
                          >
                            {product ? (
                              product.image.startsWith('accessory_') ? (
                                <span className="text-accent text-[8px]">✦</span>
                              ) : (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="max-w-full max-h-full object-contain"
                                />
                              )
                            ) : (
                              <span className="text-[8px] text-white/10 font-bold">+</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <h3 className="text-sm font-black uppercase italic tracking-tight text-white/95 mt-2">
                      {fit.name}
                    </h3>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-between items-center border-t border-border-subtle pt-4 mt-4">
                    <div className="flex items-center gap-4 text-xs font-black uppercase text-white/40">
                      <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                        <Heart size={12} className="text-red-500 fill-red-500" /> {fit.likes}
                      </span>
                      <span className="flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                        <Repeat2 size={12} /> {fit.remixes}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleBuy(fit.name, fit.items)}
                        className="p-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-xl transition-all"
                        title="Add bundle to cart"
                      >
                        <ShoppingBag size={12} className="text-white/60 hover:text-foreground" />
                      </button>
                      <button 
                        onClick={() => handleRemix(fit.items)}
                        className="bg-accent text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase italic hover:scale-103 active:scale-97 transition-all flex items-center gap-1 glow-primary"
                      >
                        Remix look <ChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Weekly Stylists Leaderboard (35% width) */}
        <div className="w-full md:w-[320px] shrink-0 space-y-6 border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-6">
          <div>
            <div className="flex items-center gap-1.5 text-accent text-[8px] font-black uppercase tracking-[0.25em] mb-1">
              <Award size={10} /> STYLIST BOARD
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic">Featured Creators</h2>
          </div>

          <div className="space-y-3">
            {[
              { rank: '01', name: '@cyber_ninja', follows: '24.2k', rating: '9.8', active: true },
              { rank: '02', name: '@stealth_hype', follows: '18.5k', rating: '9.4', active: false },
              { rank: '03', name: '@minimal_core', follows: '12.1k', rating: '9.1', active: false },
              { rank: '04', name: '@kicks_juggernaut', follows: '9.8k', rating: '8.8', active: false }
            ].map((stylist) => (
              <div 
                key={stylist.rank}
                className="p-3.5 rounded-2xl border border-border-subtle bg-surface-1 hover:bg-surface-2 border-border-subtle flex justify-between items-center transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-accent font-black tracking-wider">{stylist.rank}</span>
                  <div>
                    <p className="text-[10px] font-black text-white/90 group-hover:text-accent transition-colors">{stylist.name}</p>
                    <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest mt-0.5">{stylist.follows} stylers</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black text-foreground">{stylist.rating}</p>
                  <p className="text-[6px] text-accent uppercase font-black tracking-widest mt-0.5">RATING</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-2 border-border-subtle border border-border-subtle p-4 rounded-3xl text-center">
            <p className="text-[8px] uppercase tracking-widest text-white/30 leading-relaxed">
              Design looks, secure saves, and publish your fits to climb the board and join the elite stylers feed.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab bars */}
      <footer className="h-16 border-t border-border-subtle bg-black/60 backdrop-blur-xl flex justify-around items-center z-40 md:hidden shrink-0">
        <Link href="/" className="flex flex-col items-center gap-1 text-white/40 hover:text-foreground transition-colors">
          <Layers size={16} />
          <span className="text-[7px] uppercase font-black tracking-widest">Builder</span>
        </Link>
        <Link href="/community" className="flex flex-col items-center gap-1 text-accent">
          <Compass size={16} />
          <span className="text-[7px] uppercase font-black tracking-widest">Community</span>
        </Link>
        <Link href="/closet" className="flex flex-col items-center gap-1 text-white/40 hover:text-foreground transition-colors">
          <FolderHeart size={16} />
          <span className="text-[7px] uppercase font-black tracking-widest">Closet</span>
        </Link>
      </footer>
    </main>
  );
}
