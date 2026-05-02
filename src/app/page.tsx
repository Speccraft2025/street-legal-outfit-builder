'use client';

import { products } from '@/data/products';
import { useOutfitStore } from '@/store/useOutfitStore';
import { Category, Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, RotateCcw } from 'lucide-react';
import { useRef } from 'react';

const CATEGORIES: { name: Category; weight: number }[] = [
  { name: 'Headgear', weight: 18 },
  { name: 'Tops', weight: 32 },
  { name: 'Bottoms', weight: 32 },
  { name: 'Footgear', weight: 18 },
];

export default function Home() {
  const { selectedItems, selectItem, clearOutfit, getTotalPrice } = useOutfitStore();
  const { total, isBundle, discount } = getTotalPrice();

  return (
    <main className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden relative selection:bg-accent selection:text-black">
      {/* Premium Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      {/* HUD / Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
            Street<span className="text-accent">Legal</span>
          </h1>
          <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 mt-1">Outfit Engine v1.0</p>
        </div>
        
        <div className="pointer-events-auto">
          <button 
            onClick={clearOutfit} 
            className="group flex items-center gap-2 p-2 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all backdrop-blur-xl"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 group-hover:text-white transition-colors">Reset Fit</span>
            <RotateCcw size={14} className="text-white/40 group-hover:rotate-[-180deg] transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* The Engine: Vertical Stack of Carousels */}
      <div className="flex-1 flex flex-col pt-16 pb-44 min-h-0">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.name} 
            style={{ flex: `${cat.weight} 1 0%` }} 
            className="w-full relative border-b border-white/5 last:border-b-0 flex items-center group/row overflow-hidden"
          >
            {/* Category Label */}
            <div className="absolute left-6 z-20 pointer-events-none">
              <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/10 group-hover/row:text-accent transition-colors duration-500">
                {cat.name}
              </span>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex-1 h-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center px-[35vw] md:px-[42vw] gap-8">
              {products.filter(p => p.category === cat.name).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isSelected={selectedItems[cat.name]?.id === product.id}
                  onSelect={() => selectItem(cat.name, product)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Center Selection Frame (Static Overlay) */}
      <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 w-[72vw] md:w-[470px] h-[72vh] border border-accent/20 rounded-[3rem] pointer-events-none z-10 shadow-[0_0_100px_rgba(204,255,0,0.03)]">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-black text-[8px] font-black uppercase tracking-widest rounded-full opacity-50">
          Selection Focus
        </div>
      </div>

      {/* Footer / Checkout */}
      <footer className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-3xl border border-white/10 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <p className="text-[9px] uppercase font-black text-white/40 tracking-widest mb-1">Total Value</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-black tracking-tighter italic">KES {total.toLocaleString()}</span>
                  <AnimatePresence>
                    {isBundle && (
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="bg-accent text-black text-[8px] px-2 py-0.5 rounded-full font-black uppercase italic"
                      >
                        -10% Bundle
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
             </div>
             
             {isBundle && (
               <div className="hidden md:block h-10 w-px bg-white/10" />
             )}
             
             {isBundle && (
               <div className="hidden md:block">
                  <p className="text-[9px] uppercase font-black text-accent tracking-widest">You Saved</p>
                  <p className="text-lg font-black text-white/80 tracking-tight">KES {discount.toLocaleString()}</p>
               </div>
             )}
          </div>
          
          <button className="w-full md:w-auto bg-accent text-black px-10 py-4 rounded-xl md:rounded-2xl font-black uppercase italic text-xs md:text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_rgba(204,255,0,0.15)] group">
            Checkout Full Fit <ShoppingBag size={18} className="group-hover:translate-y-[-2px] transition-transform" />
          </button>
        </div>
        
        <div className="mt-3 flex justify-center gap-6 md:gap-8">
           {['Free Shipping', 'Instant Delivery', 'Original Items'].map(tag => (
             <span key={tag} className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-white/20 font-bold">{tag}</span>
           ))}
        </div>
      </footer>
    </main>
  );
}

function ProductCard({ product, isSelected, onSelect }: { product: Product; isSelected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      whileTap={{ scale: 0.95 }}
      className={`flex-shrink-0 w-[55vw] md:w-[360px] h-[85%] snap-center relative transition-all duration-700 cursor-pointer group ${
        isSelected ? 'z-20' : 'z-0 opacity-10'
      }`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center">
           <img 
              src={product.image} 
              alt={product.name}
              className={`max-w-full max-h-full object-contain transition-all duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${
                isSelected ? 'scale-105 rotate-[-1deg]' : 'scale-90 blur-sm'
              }`}
           />
           
           {/* Glow behind selected */}
           {isSelected && (
             <div className="absolute inset-0 bg-accent/5 blur-[60px] -z-10 rounded-full animate-pulse" />
           )}
        </div>

        {/* Floating Info (Only on Selected) */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center px-4"
            >
              <p className="text-[8px] uppercase font-bold text-accent tracking-[0.2em] mb-1">{product.brand}</p>
              <h3 className="text-xs font-black uppercase italic tracking-tight truncate">{product.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                 <span className="text-[10px] font-black text-white">KES {product.price.toLocaleString()}</span>
                 <div className="h-2 w-px bg-white/20" />
                 <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">{product.color}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
