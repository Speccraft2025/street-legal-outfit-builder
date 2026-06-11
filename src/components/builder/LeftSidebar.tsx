'use client';

import React, { useState, useEffect } from 'react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { Share2, Bookmark, Flame, CheckCircle, Trash2, Heart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Outfit } from '@/types';

export default function LeftSidebar() {
  const { selectedItems, getTotalPrice, randomizeOutfit, loadOutfit } = useOutfitStore();
  const { addOutfit } = useCartStore();
  
  const [fitName, setFitName] = useState('UNLEASHED FITS');
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [recentOutfits, setRecentOutfits] = useState<Outfit[]>([]);

  const { subtotal, discount, total, isBundle } = getTotalPrice();
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  // Load recently saved outfits from localStorage on mount
  useEffect(() => {
    loadLocalOutfits();
  }, [selectedItems]);

  const loadLocalOutfits = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
      setRecentOutfits(JSON.parse(stored).slice(0, 3)); // show top 3
    }
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Generate share code and copy link
  const handleShare = async () => {
    if (selectedCount === 0) {
      triggerToast('Please select at least 1 item first!');
      return;
    }

    // Generate unique short share code (4-6 alphanumeric)
    const shareCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Save outfit to DB/LocalStorage
    const outfitPayload = {
      name: fitName,
      slug: fitName.toLowerCase().replace(/\s+/g, '-'),
      share_code: shareCode,
      visibility: 'public' as const,
      items: selectedItems
    };

    // Store in Supabase / Mock DB
    await supabase.from('outfits').insert(outfitPayload);
    
    const host = typeof window !== 'undefined' ? window.location.origin : 'streetlegal.com';
    const link = `${host}/o/${shareCode}`;
    setShareLink(link);

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
      triggerToast(`Fit Code ${shareCode} copied to clipboard!`);
    } else {
      triggerToast(`Link created: ${link}`);
    }
  };

  // Save outfit to Closet
  const handleSave = async () => {
    if (selectedCount === 0) {
      triggerToast('Outfit is empty! Add items first.');
      return;
    }

    setIsSaving(true);
    const shareCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newOutfit: Outfit = {
      id: Math.random().toString(36).substring(2, 9),
      name: fitName,
      slug: fitName.toLowerCase().replace(/\s+/g, '-'),
      share_code: shareCode,
      visibility: 'public',
      items: selectedItems,
      created_at: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
      const parsed = JSON.parse(stored) as Outfit[];
      
      // Prevent duplicates of identical items
      const isDuplicate = parsed.some(
        (o) => JSON.stringify(o.items) === JSON.stringify(selectedItems)
      );

      if (!isDuplicate) {
        localStorage.setItem(
          'street_legal_saved_outfits', 
          JSON.stringify([newOutfit, ...parsed])
        );
        triggerToast('Look saved to Closet!');
        loadLocalOutfits();
      } else {
        triggerToast('This look is already in your Closet!');
      }
    }
    setIsSaving(false);
  };

  // Delete saved outfit
  const handleDeleteOutfit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
      const parsed = JSON.parse(stored) as Outfit[];
      const filtered = parsed.filter((o) => o.id !== id);
      localStorage.setItem('street_legal_saved_outfits', JSON.stringify(filtered));
      loadLocalOutfits();
      triggerToast('Look deleted from closet');
    }
  };

  // Add the active loaded layout to the cart
  const handleAddOutfitToCart = () => {
    if (selectedCount === 0) {
      triggerToast('Fit is empty! Add items first.');
      return;
    }

    const fitPayload: Outfit = {
      name: fitName,
      slug: fitName.toLowerCase().replace(/\s+/g, '-'),
      share_code: Math.random().toString(36).substring(2, 6).toUpperCase(),
      visibility: 'public',
      items: selectedItems,
    };

    addOutfit(fitPayload);
    triggerToast('Outfit Bundle added to cart!');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-surface/50 border-r border-border-subtle backdrop-blur-2xl relative select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-6 left-1/2 bg-accent text-black text-xs font-black uppercase px-6 py-3 rounded-full glow-primary z-50 flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle size={14} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section: Fit Name & Stock Check */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-accent text-[8px] font-black uppercase tracking-[0.25em] mb-1">
            <Flame size={10} /> Active Look
          </div>
          <input
            type="text"
            value={fitName}
            onChange={(e) => setFitName(e.target.value.toUpperCase())}
            className="w-full bg-transparent border-b border-transparent focus:border-accent/40 font-black text-xl md:text-2xl tracking-tighter uppercase italic py-1 outline-none text-foreground transition-colors placeholder:text-white/20"
            placeholder="NAME THIS FIT"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-[9px] uppercase font-black tracking-[0.2em] text-white/30">Anatomical Stock Scan</h3>
          <div className="space-y-2 bg-white/[0.02] border border-border-subtle rounded-2xl p-3.5">
            {['Headgear', 'Tops', 'Bottoms', 'Footgear'].map((cat) => {
              const selectedItem = (selectedItems as any)[cat];
              return (
                <div key={cat} className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40 uppercase font-bold tracking-widest">{cat}</span>
                  {selectedItem ? (
                    <span className="text-accent font-black uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                      {selectedItem.brand} (IN STOCK)
                    </span>
                  ) : (
                    <span className="text-white/10 italic">EMPTY SCAN_</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Section: Price HUD & Add Bundle */}
      <div className="my-6">
        <div className="bg-surface-2 border-border-subtle border border-border p-5 rounded-[2rem] flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] uppercase font-black text-white/40 tracking-widest mb-1">Look Price</p>
              <h2 className="text-3xl font-black tracking-tighter italic text-foreground">
                KES {total.toLocaleString()}
              </h2>
            </div>
            {isBundle && (
              <span className="bg-accent text-black text-[7px] font-black uppercase italic px-2 py-0.5 rounded-full mb-1">
                Bundle Dis. -10%
              </span>
            )}
          </div>

          {isBundle && (
            <div className="flex justify-between text-[10px] border-t border-border-subtle pt-3">
              <span className="text-white/40 font-bold uppercase tracking-wider">Subtotal: KES {subtotal.toLocaleString()}</span>
              <span className="text-accent font-black">You Saved KES {discount.toLocaleString()}</span>
            </div>
          )}

          <button 
            onClick={handleAddOutfitToCart}
            disabled={selectedCount === 0}
            className="w-full bg-accent disabled:bg-surface-2 border-border-subtle disabled:text-white/20 disabled:scale-100 disabled:shadow-none text-black py-3.5 rounded-xl font-black uppercase italic text-xs flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all glow-primary"
          >
            Add Bundle to Cart
          </button>
        </div>

        {/* Save & Share Toolbar */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 py-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-xl transition-all text-[9px] uppercase font-black tracking-widest text-white/60 hover:text-foreground"
          >
            <Bookmark size={12} /> Save Fit
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border-subtle hover:border-border rounded-xl transition-all text-[9px] uppercase font-black tracking-widest text-white/60 hover:text-foreground"
          >
            <Share2 size={12} /> Share Fit
          </button>
        </div>
      </div>

      {/* Bottom Section: Closet Quick-View */}
      <div className="flex flex-col gap-4 border-t border-border-subtle pt-5">
        <div className="flex justify-between items-center">
          <h3 className="text-[9px] uppercase font-black tracking-[0.2em] text-white/30 flex items-center gap-1.5">
            <Award size={10} /> Closet Quick fits
          </h3>
          <span className="text-[7px] text-white/20 font-black uppercase">Recent 3</span>
        </div>

        <div className="space-y-2">
          {recentOutfits.length > 0 ? (
            recentOutfits.map((outfit) => {
              const activeItems = Object.values(outfit.items).filter(Boolean) as Product[];
              return (
                <div
                  key={outfit.id}
                  onClick={() => loadOutfit(outfit.items)}
                  className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 border-border-subtle cursor-pointer transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase font-black text-white/80 group-hover:text-accent transition-colors truncate">
                      {outfit.name}
                    </p>
                    <p className="text-[7px] text-white/30 font-bold uppercase mt-0.5">
                      {activeItems.length} layers • code: {outfit.share_code}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteOutfit(e, outfit.id!)}
                    className="p-1 opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-400 transition-all ml-2"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 bg-surface-1 border border-dashed border-border-subtle rounded-2xl">
              <p className="text-[8px] text-white/20 uppercase tracking-widest">No fits saved yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
