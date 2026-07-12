'use client';

import React, { useEffect, useState, use } from 'react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { products } from '@/data/products';
import OutfitVisualizer from '@/components/builder/OutfitVisualizer';
import { 
  Compass, 
  Layers, 
  FolderHeart, 
  RotateCw, 
  ShoppingBag, 
  Share2,
  Bookmark,
  CheckCircle,
  Flame,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category, Product, Outfit } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ shareCode: string }>;
}

export default function ShareCodePage({ params }: PageProps) {
  const router = useRouter();
  
  // Conform to Next.js 15/16 App Router promise params
  const resolvedParams = use(params);
  const shareCode = resolvedParams.shareCode;

  const { loadOutfit } = useOutfitStore();
  const { addOutfit } = useCartStore();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    fetchOutfit();
  }, [shareCode]);

  const fetchOutfit = async () => {
    setIsLoading(true);
    try {
      // 1. Query mock DB / Supabase table
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('share_code', shareCode)
        .single();

      if (data) {
        setOutfit(data as Outfit);
      } else {
        // Fallback: If not found, load a default preset to prevent crashing
        const fallbackOutfit: Outfit = {
          name: 'VOID STEALTH PROTOCOL',
          slug: 'void-stealth-protocol',
          share_code: shareCode,
          visibility: 'public',
          items: {
            Headgear: products.find(p => p.id === 'h1'),
            Tops: products.find(p => p.id === 't2'),
            Bottoms: products.find(p => p.id === 'b1'),
            Footgear: products.find(p => p.id === 'f2'),
            Accessories: products.find(p => p.id === 'a1')
          }
        };
        setOutfit(fallbackOutfit);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = () => {
    if (!outfit) return;

    // Load outfit items into swiper state
    loadOutfit(outfit.items);
    triggerToast('Look loaded! Swipe any layer to remix...');

    setTimeout(() => {
      router.push('/');
    }, 850);
  };

  const handleBuy = () => {
    if (!outfit) return;

    addOutfit(outfit);
    triggerToast('Look added to Shopping Bag!');
  };

  const handleSaveToCloset = () => {
    if (!outfit) return;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
      const parsed = JSON.parse(stored) as Outfit[];
      
      const isDuplicate = parsed.some(
        (o) => o.share_code === outfit.share_code || JSON.stringify(o.items) === JSON.stringify(outfit.items)
      );

      if (!isDuplicate) {
        localStorage.setItem(
          'street_legal_saved_outfits',
          JSON.stringify([
            { ...outfit, id: Math.random().toString(36).substring(2, 9), name: `${outfit.name} (SHARED)` },
            ...parsed
          ])
        );
        triggerToast('Shared look pinned to Closet!');
      } else {
        triggerToast('Look is already in your Closet!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center font-mono text-[8px] text-accent uppercase tracking-widest animate-pulse">
        Fetching share code {shareCode}...
      </div>
    );
  }

  const outfitItemsList = Object.values(outfit?.items || {}).filter(Boolean) as Product[];
  const subtotal = outfitItemsList.reduce((sum, item) => sum + item.price, 0);
  
  const hasPrimaryFour = 
    outfit?.items.Headgear &&
    outfit?.items.Tops &&
    outfit?.items.Bottoms &&
    outfit?.items.Footgear;
    
  const discount = hasPrimaryFour ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <main className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden relative selection:bg-accent selection:text-black">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 bg-accent text-black text-xs font-black uppercase px-6 py-3 rounded-full glow-primary z-50 flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle size={14} /> {toastMessage}
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
            <Link href="/community" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><Compass size={10} /> Community Feed</Link>
            <Link href="/closet" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><FolderHeart size={10} /> Closet Library</Link>
          </nav>
        </div>
      </header>

      {/* Main Share Stage */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full min-h-0 select-none pb-24 md:pb-8">
        
        {/* Left Side: Large Fit Preview (60% width) */}
        <div className="flex-1 glass rounded-[2.5rem] border border-border-subtle relative flex items-center justify-center min-h-[350px] md:min-h-[500px] shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
          {outfit && (
            <OutfitVisualizer
              selectedItems={outfit.items}
              zoom={1.0}
              rotation={0}
            />
          )}

          <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-accent text-[8px] font-black uppercase tracking-[0.25em]">
            <Flame size={10} /> Fit Preview
          </div>
        </div>

        {/* Right Side: Outfit details and Remix tools (40% width) */}
        <div className="w-full md:w-[380px] flex flex-col justify-between shrink-0 bg-surface/40 p-6 rounded-[2.5rem] border border-border-subtle shadow-2xl">
          <div className="space-y-6">
            <div>
              <span className="bg-accent text-black text-[7px] font-black uppercase italic px-2 py-0.5 rounded-full">
                Look share code: {shareCode}
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-foreground mt-2 leading-none">
                {outfit?.name}
              </h2>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Shared Outfit Lookbook</p>
            </div>

            {/* List items inside fit */}
            <div className="space-y-2">
              <h3 className="text-[8px] uppercase font-black tracking-[0.2em] text-white/30">Equipped Products</h3>
              <div className="space-y-2 bg-black/40 border border-border-subtle rounded-2xl p-4">
                {Object.entries(outfit?.items || {}).map(([cat, item]) => {
                  const prod = item as Product;
                  return (
                    <div key={cat} className="flex justify-between items-center text-[10px] py-1 border-b border-border-subtle last:border-0 last:pb-0">
                      <span className="text-white/40 uppercase font-bold tracking-widest">{cat}</span>
                      <span className="text-foreground font-black">{prod.brand} • {prod.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing details & Action triggers */}
          <div className="mt-8 space-y-4">
            <div className="bg-surface-2 border-border-subtle border border-border p-5 rounded-[2rem] space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase font-black text-white/40 tracking-widest">Total Outfit Cost</p>
                  <p className="text-2xl font-black italic tracking-tighter text-foreground mt-1">
                    KES {total.toLocaleString()}
                  </p>
                </div>
                {hasPrimaryFour && (
                  <span className="bg-accent text-black text-[6px] font-black uppercase italic px-1.5 py-0.5 rounded">
                    10% BUNDLE DISCOUNT
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border-subtle">
                <button
                  onClick={handleSaveToCloset}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 rounded-xl text-[9px] uppercase font-black tracking-widest text-white/60 hover:text-foreground transition-colors"
                >
                  <Bookmark size={11} /> Save fit
                </button>
                <button
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 rounded-xl text-[9px] uppercase font-black tracking-widest text-white/60 hover:text-foreground transition-colors"
                >
                  <ShoppingBag size={11} /> Buy look
                </button>
              </div>

              <button
                onClick={handleRemix}
                className="w-full bg-accent text-black py-3 rounded-xl font-black uppercase italic text-xs flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98 transition-all glow-primary"
              >
                Remix active look <RotateCw size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation bottom bar */}
      <footer className="h-16 border-t border-border-subtle bg-black/60 backdrop-blur-xl flex justify-around items-center z-40 md:hidden shrink-0">
        <Link href="/" className="flex flex-col items-center gap-1 text-white/40 hover:text-foreground transition-colors">
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
    </main>
  );
}
