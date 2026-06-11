'use client';

import React from 'react';
import { Product, Category } from '@/types';
import { VisualMode } from '@/store/useOutfitStore';
import { motion, AnimatePresence } from 'framer-motion';

interface OutfitVisualizerProps {
  selectedItems: Partial<Record<Category, Product>>;
  visualMode: VisualMode;
  zoom: number;
  rotation: number;
}

export default function OutfitVisualizer({
  selectedItems,
  visualMode,
  zoom,
  rotation
}: OutfitVisualizerProps) {
  // Setup standard dimensions
  const hasItems = Object.keys(selectedItems).length > 0;

  // Base animation variants for layering
  const layerVariants = {
    initial: { opacity: 0, scale: 0.8, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500"
      style={{
        transform: `scale(${zoom}) rotateY(${rotation}deg)`,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <AnimatePresence mode="wait">
        {visualMode === 'flat-lay' && (
          <motion.div 
            key="flat-lay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 md:gap-8 p-6 md:p-12 items-center justify-center max-w-[500px] max-h-[500px]"
          >
            {/* Flat Lay: Editorial grid style */}
            <FlatLayCard category="Headgear" product={selectedItems.Headgear} index={0} />
            <FlatLayCard category="Tops" product={selectedItems.Tops} index={1} />
            <FlatLayCard category="Bottoms" product={selectedItems.Bottoms} index={2} />
            <FlatLayCard category="Footgear" product={selectedItems.Footgear} index={3} />
            {selectedItems.Accessories && (
              <div className="col-span-2 flex justify-center -mt-2 pointer-events-none">
                <FlatLayCard category="Accessories" product={selectedItems.Accessories} index={4} isMini />
              </div>
            )}
          </motion.div>
        )}

        {visualMode === 'human-model' && (
          <motion.div 
            key="human-model"
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
                    className={selectedItems.Accessories.image === 'accessory_glasses' ? 'top-[9%] h-[8%] z-50' : 'top-[22%] h-[20%] z-40 scale-x-90 opacity-90'} 
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
        )}

        {visualMode === 'avatar-3d' && (
          <motion.div 
            key="avatar-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center min-h-[400px] md:min-h-[550px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* holographic matrix background */}
            <HoloGrid />

            {/* Glowing levitating clothing stack */}
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence>
                {/* Headgear Layer (Glowing Hologram) */}
                <ModelLayer key={`holo-h-${selectedItems.Headgear?.id}`} category="Headgear" product={selectedItems.Headgear} className="top-[3%] h-[18%] z-40 filter drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]" isHolo zOffset={120} />
                
                {/* Accessories Layer */}
                {selectedItems.Accessories && (
                  <ModelLayer key={`holo-a-${selectedItems.Accessories.id}`} category="Accessories" product={selectedItems.Accessories} className="top-[18%] h-[25%] z-50 filter drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]" isHolo zOffset={150} />
                )}
                
                {/* Tops Layer */}
                <ModelLayer key={`holo-t-${selectedItems.Tops?.id}`} category="Tops" product={selectedItems.Tops} className="top-[18%] h-[32%] z-30 filter drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]" isHolo zOffset={80} />
                
                {/* Bottoms Layer */}
                <ModelLayer key={`holo-b-${selectedItems.Bottoms?.id}`} category="Bottoms" product={selectedItems.Bottoms} className="top-[44%] h-[34%] z-20 filter drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]" isHolo zOffset={40} />
                
                {/* Footgear Layer */}
                <ModelLayer key={`holo-f-${selectedItems.Footgear?.id}`} category="Footgear" product={selectedItems.Footgear} className="top-[73%] h-[22%] z-10 filter drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" isHolo zOffset={0} />
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flat Lay cards
function FlatLayCard({ category, product, index, isMini = false }: { category: Category; product?: Product; index: number; isMini?: boolean }) {
  const rotation = [2, -3, -1, 3, -1][index];
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, type: 'spring' }}
      className={`glass rounded-3xl p-4 flex flex-col items-center justify-center border relative transition-all duration-300 ${
        isMini ? 'w-[140px] h-[100px]' : 'w-full h-[140px] md:h-[180px]'
      } ${product ? 'border-border hover:border-accent/40 shadow-premium' : 'border-dashed border-border-subtle bg-surface-1'}`}
      style={{ rotate: `${rotation}deg` }}
    >
      <span className="absolute top-2 left-3 text-[7px] uppercase font-black tracking-widest text-white/20">
        {category}
      </span>
      {product ? (
        <div className="w-full h-full flex flex-col items-center justify-center mt-2">
          {product.image.startsWith('accessory_') ? (
            <div className="w-12 h-12 flex items-center justify-center text-accent text-lg">✦</div>
          ) : (
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-[75%] max-h-[75%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
            />
          )}
          {!isMini && (
            <div className="absolute bottom-2 text-center w-full px-2">
              <h4 className="text-[9px] font-black uppercase text-white/90 truncate">{product.name}</h4>
              <p className="text-[8px] font-black text-accent mt-0.5">KES {product.price.toLocaleString()}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center opacity-25">
          <span className="text-xl">+</span>
          <span className="text-[6px] uppercase tracking-wider mt-1">Empty Slot</span>
        </div>
      )}
    </motion.div>
  );
}

// Layer overlay for Anatomical Silhouette
function ModelLayer({ category, product, className, isHolo = false, zOffset = 0 }: { category: Category; product?: Product; className?: string; isHolo?: boolean; zOffset?: number }) {
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
      {product.image.startsWith('accessory_') ? (
        // Custom graphic element placement for accessories (e.g. shades or bags)
        <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/30 ${isHolo ? 'animate-pulse' : ''}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            className="w-8 h-8"
          >
            {product.image === 'accessory_glasses' && (
              <path d="M2 10h3l1.5-3h11l1.5 3h3v2c0 3-2 5-5 5H8.5c-3 0-5-2-5-5v-2z" />
            )}
            {product.image === 'accessory_sling' && (
              <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M3 10h18v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8zm5 0V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
            )}
            {product.image === 'accessory_watch' && (
              <path d="M12 2v4M12 18v4M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-3 6h3.5L14 9.5" />
            )}
          </svg>
        </div>
      ) : (
        <img 
          src={product.image} 
          alt={product.name} 
          className={`max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] ${
            isHolo ? 'hue-rotate-[85deg] saturate-200 opacity-80 mix-blend-screen' : ''
          }`}
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

// Neon 3D mesh background grid
function HoloGrid() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden select-none" style={{ transform: 'translateZ(-50px)' }}>
      {/* Cyberpunk matrix circles and vertical lines */}
      <div className="absolute w-[300px] h-[300px] border border-dashed border-accent rounded-full animate-[spin_40s_linear_infinite]" />
      <div className="absolute w-[450px] h-[450px] border border-accent/40 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
      <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent left-1/2" />
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent top-1/2" />
      
      {/* Dynamic tech readout numbers */}
      <div className="absolute top-10 left-10 text-[6px] text-accent font-mono uppercase tracking-[0.3em]">
        SYSTEM: ACTIVE<br />
        RENDER: 3D_MATRIX_HOLO<br />
        FOV: 45DEG
      </div>
      <div className="absolute bottom-10 right-10 text-[6px] text-accent/80 font-mono uppercase tracking-[0.3em]">
        NODE_X: 74.02<br />
        NODE_Y: -22.9<br />
        GRID: SEC_4
      </div>
    </div>
  );
}
