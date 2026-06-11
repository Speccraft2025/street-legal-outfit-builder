'use client';

import React, { useEffect, useState } from 'react';
import { X, Heart, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useOutfitStore } from '@/store/useOutfitStore';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { selectItem } = useOutfitStore();

  useEffect(() => {
    loadFavorites();
  }, [isOpen]);

  const loadFavorites = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_favorites') || '[]';
      setFavorites(JSON.parse(stored));
    }
  };

  const handleRemoveFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('street_legal_favorites') || '[]';
      const parsed = JSON.parse(stored) as Product[];
      const filtered = parsed.filter((p) => p.id !== productId);
      localStorage.setItem('street_legal_favorites', JSON.stringify(filtered));
      loadFavorites();
    }
  };

  const handleUseItem = (product: Product) => {
    selectItem(product.category, product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Panel Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-background border-l border-border-subtle z-50 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-accent fill-accent" />
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground italic">
                  Liked Products ({favorites.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {favorites.length > 0 ? (
                favorites.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleUseItem(product)}
                    className="p-3.5 rounded-2xl border border-border-subtle bg-surface-1 hover:bg-surface-2 border-border-subtle cursor-pointer flex gap-4 items-center group transition-all"
                  >
                    <div className="w-12 h-12 bg-surface-2 border-border-subtle rounded-xl flex items-center justify-center border border-border-subtle">
                      {product.image.startsWith('accessory_') ? (
                        <span className="text-accent text-[8px]">✦</span>
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-[80%] max-h-[80%] object-contain"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[7px] uppercase font-black tracking-widest text-accent">
                        {product.category}
                      </span>
                      <h3 className="text-[11px] font-black uppercase tracking-tight text-white/90 truncate">
                        {product.name}
                      </h3>
                      <p className="text-[9px] font-bold text-white/40 mt-0.5">
                        {product.brand} • KES {product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-auto">
                      <button
                        onClick={(e) => handleRemoveFavorite(e, product.id)}
                        className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ArrowRight size={12} className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 opacity-20">
                  <Heart size={30} className="mb-4" />
                  <p className="text-[9px] uppercase font-black tracking-[0.2em]">No liked products yet_</p>
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="p-6 border-t border-border-subtle bg-black/40 text-center">
              <p className="text-[8px] uppercase tracking-widest text-white/30 flex items-center justify-center gap-1">
                <Sparkles size={10} className="text-accent" /> Click any liked item to equip it in the builder
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
