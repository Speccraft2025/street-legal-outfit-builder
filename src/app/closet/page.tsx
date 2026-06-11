'use client';

import React, { useEffect, useState } from 'react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { 
  FolderHeart, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  Layers, 
  Compass, 
  ChevronRight, 
  Bookmark, 
  History, 
  Flame, 
  PackageCheck 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category, Product, Outfit } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClosetPage() {
  const router = useRouter();
  const { loadOutfit } = useOutfitStore();
  const { addOutfit } = useCartStore();

  const [activeSubTab, setActiveSubTab] = useState<'fits' | 'likes' | 'history'>('fits');
  const [savedFits, setSavedFits] = useState<Outfit[]>([]);
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadClosetData();
  }, [activeSubTab]);

  const loadClosetData = () => {
    if (typeof window !== 'undefined') {
      const storedFits = localStorage.getItem('street_legal_saved_outfits') || '[]';
      setSavedFits(JSON.parse(storedFits));

      const storedLikes = localStorage.getItem('street_legal_favorites') || '[]';
      setLikedItems(JSON.parse(storedLikes));

      const storedOrders = localStorage.getItem('street_legal_orders') || '[]';
      setOrderHistory(JSON.parse(storedOrders));
    }
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLoadFit = (items: Partial<Record<Category, Product>>) => {
    loadOutfit(items);
    triggerToast('Look loaded in swiper! Redirecting...');
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const handleBuyFit = (name: string, items: Partial<Record<Category, Product>>) => {
    const fitPayload: Outfit = {
      name: `${name} (CLOSET)`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      share_code: Math.random().toString(36).substring(2, 6).toUpperCase(),
      visibility: 'public',
      items,
    };
    addOutfit(fitPayload);
    triggerToast('Look added to Shopping Bag!');
  };

  const handleDeleteFit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
      const parsed = JSON.parse(stored) as Outfit[];
      const filtered = parsed.filter((o) => o.id !== id);
      localStorage.setItem('street_legal_saved_outfits', JSON.stringify(filtered));
      loadClosetData();
      triggerToast('Look deleted from closet');
    }
  };

  const handleEquipLiked = (item: Product) => {
    loadOutfit({ [item.category]: item });
    triggerToast(`${item.name} equipped! Redirecting...`);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const handleRemoveLiked = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_favorites') || '[]';
      const parsed = JSON.parse(stored) as Product[];
      const filtered = parsed.filter((p) => p.id !== productId);
      localStorage.setItem('street_legal_favorites', JSON.stringify(filtered));
      loadClosetData();
      triggerToast('Item removed from liked');
    }
  };

  return (
    <main className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden relative selection:bg-accent selection:text-black">
      
      {/* Toast Popups */}
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
            <Link href="/community" className="hover:text-foreground flex items-center gap-1.5 transition-colors"><Compass size={10} /> Community Feed</Link>
            <Link href="/closet" className="text-accent flex items-center gap-1.5"><FolderHeart size={10} /> Closet Library</Link>
          </nav>
        </div>
      </header>

      {/* Scrollable Layout container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto w-full min-h-0 select-none pb-24 md:pb-8">
        
        {/* Profile Card Summary Banner */}
        <div className="glass rounded-[2.5rem] border border-border-subtle p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-[0_15px_45px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-3xl font-black italic">
              SL
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-foreground tracking-tight">STREET STYLIST</h2>
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Tier Level 1 • Guest Closet Account</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-12 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-12 w-full sm:w-auto text-center sm:text-left">
            <div>
              <p className="text-[18px] font-black italic tracking-tight">{savedFits.length}</p>
              <p className="text-[7px] text-white/30 uppercase font-black tracking-widest mt-1">SAVED FITS</p>
            </div>
            <div>
              <p className="text-[18px] font-black italic tracking-tight">{likedItems.length}</p>
              <p className="text-[7px] text-white/30 uppercase font-black tracking-widest mt-1">LIKED ITEMS</p>
            </div>
            <div>
              <p className="text-[18px] font-black italic tracking-tight">{orderHistory.length}</p>
              <p className="text-[7px] text-white/30 uppercase font-black tracking-widest mt-1">ORDERS</p>
            </div>
          </div>
        </div>

        {/* Navigation Selector Sub Tabs */}
        <div className="flex bg-surface-2 border-border-subtle border border-border-subtle p-1 rounded-2xl max-w-sm mb-6">
          {[
            { id: 'fits' as const, label: 'Saved Fits', icon: <Bookmark size={10} /> },
            { id: 'likes' as const, label: 'Liked Items', icon: <Heart size={10} /> },
            { id: 'history' as const, label: 'Order History', icon: <History size={10} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-[9px] uppercase font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === tab.id 
                  ? 'bg-accent text-black font-black' 
                  : 'text-white/40 hover:text-foreground'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC RENDER OF THE ACTIVE SUB-TAB VIEW --- */}
        <AnimatePresence mode="wait">
          {activeSubTab === 'fits' && (
            <motion.div
              key="sub-fits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {savedFits.length > 0 ? (
                savedFits.map((fit) => {
                  const itemsCount = Object.values(fit.items).filter(Boolean).length;
                  return (
                    <div 
                      key={fit.id}
                      className="glass rounded-3xl border border-border-subtle p-5 flex flex-col justify-between hover:border-border hover:shadow-premium transition-all duration-300 relative group"
                    >
                      <button
                        onClick={(e) => handleDeleteFit(e, fit.id!)}
                        className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-400 text-white/40 transition-all rounded-lg"
                        title="Delete outfit"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div>
                        <span className="text-[7px] text-accent uppercase font-black tracking-widest">
                          Look Code: {fit.share_code}
                        </span>
                        <h3 className="text-md font-black uppercase italic tracking-tight text-white/95 mt-1 pr-6 truncate">
                          {fit.name}
                        </h3>

                        {/* Tiny Horizontal stack */}
                        <div className="grid grid-cols-4 gap-2 bg-black/40 border border-border-subtle p-2.5 rounded-xl my-4">
                          {['Headgear', 'Tops', 'Bottoms', 'Footgear'].map((cat) => {
                            const product = fit.items[cat as Category];
                            return (
                              <div key={cat} className="aspect-square bg-surface-2 border-border-subtle border border-border-subtle rounded-lg flex items-center justify-center p-1 relative">
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
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle">
                        <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">
                          {itemsCount} layers equipped
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleBuyFit(fit.name, fit.items)}
                            className="p-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-xl transition-all"
                            title="Add bundle to cart"
                          >
                            <ShoppingBag size={12} className="text-white/60 hover:text-foreground" />
                          </button>
                          <button 
                            onClick={() => handleLoadFit(fit.items)}
                            className="bg-accent text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase italic hover:scale-103 active:scale-97 transition-all flex items-center gap-1 glow-primary"
                          >
                            Equip fit <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-20 bg-surface-1 border border-dashed border-border-subtle rounded-[2rem] opacity-30">
                  <Bookmark size={36} className="mx-auto mb-4" />
                  <p className="text-[9px] uppercase font-black tracking-[0.25em]">Your Closet is empty. Save looks from the builder homepage_</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSubTab === 'likes' && (
            <motion.div
              key="sub-likes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-6"
            >
              {likedItems.length > 0 ? (
                likedItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleEquipLiked(item)}
                    className="glass rounded-3xl border border-border-subtle p-4 flex flex-col items-center justify-between hover:border-border group cursor-pointer transition-all duration-300 relative text-center"
                  >
                    <button
                      onClick={(e) => handleRemoveLiked(e, item.id)}
                      className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-400 text-white/40 transition-all rounded-lg"
                      title="Remove bookmark"
                    >
                      <Trash2 size={11} />
                    </button>

                    <div className="w-full h-24 flex items-center justify-center p-2 relative my-2">
                      {item.image.startsWith('accessory_') ? (
                        <span className="text-accent text-lg">✦</span>
                      ) : (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>

                    <div className="w-full mt-2">
                      <span className="text-[7px] text-accent uppercase font-black tracking-widest">{item.category}</span>
                      <h4 className="text-[10px] font-black uppercase tracking-tight text-foreground truncate mt-0.5">{item.name}</h4>
                      <p className="text-[9px] text-white/50 font-bold mt-0.5">KES {item.price.toLocaleString()}</p>
                    </div>

                    <button className="w-full bg-surface-2 border-border-subtle group-hover:bg-accent group-hover:text-black py-1.5 rounded-lg text-[7px] uppercase font-black tracking-widest transition-colors mt-3">
                      Equip Item
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 bg-surface-1 border border-dashed border-border-subtle rounded-[2rem] opacity-30">
                  <Heart size={36} className="mx-auto mb-4 animate-pulse" />
                  <p className="text-[9px] uppercase font-black tracking-[0.25em]">No liked single items yet_</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSubTab === 'history' && (
            <motion.div
              key="sub-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {orderHistory.length > 0 ? (
                orderHistory.map((order: any, idx: number) => (
                  <div 
                    key={order.id || idx}
                    className="glass rounded-2xl border border-border-subtle p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 font-mono text-[9px] uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="w-9 h-9 bg-accent/5 border border-accent/20 text-accent rounded-xl flex items-center justify-center shrink-0">
                        <PackageCheck size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/95">Order: {order.id || 'SL-629471'}</p>
                        <p className="text-white/30 font-bold mt-0.5">Paid via {order.payment_method || 'STRIPE'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center sm:text-right w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-border-subtle pt-2 sm:pt-0">
                      <span className="sm:hidden text-white/30">Total spent</span>
                      <div>
                        <p className="text-[10px] font-black text-accent">KES {order.total?.toLocaleString() || '8,500'}</p>
                        <p className="text-[7px] text-white/30 font-bold mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '05/30/2026'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-surface-1 border border-dashed border-border-subtle rounded-[2rem] opacity-30">
                  <History size={36} className="mx-auto mb-4" />
                  <p className="text-[9px] uppercase font-black tracking-[0.25em]">No purchases registered yet. Checkout fits to seed this log_</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
        <Link href="/closet" className="flex flex-col items-center gap-1 text-accent">
          <FolderHeart size={16} />
          <span className="text-[7px] uppercase font-black tracking-widest">Closet</span>
        </Link>
      </footer>
    </main>
  );
}
