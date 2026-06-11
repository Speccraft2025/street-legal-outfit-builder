'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Product, Category } from '@/types';
import { useOutfitStore } from '@/store/useOutfitStore';
import { motion } from 'framer-motion';

interface ProductCarouselProps {
  category: Category;
  products: Product[];
}

export default function ProductCarousel({ category, products }: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedItems, selectItem } = useOutfitStore();
  const selectedProduct = selectedItems[category];
  
  // Track scroll settling for selection
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Scroll active item into view on mount or if external change happens (e.g. randomizer)
  useEffect(() => {
    if (!containerRef.current || !selectedProduct) return;
    const activeCard = containerRef.current.querySelector(
      `[data-product-id="${selectedProduct.id}"]`
    );
    if (activeCard) {
      // Check if it's already centered before scrolling to prevent layout jumps on initial render
      const container = containerRef.current;
      const card = activeCard as HTMLElement;
      const currentCenter = container.scrollLeft + container.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      
      if (Math.abs(currentCenter - cardCenter) > 20) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedProduct?.id]);

  // Analyze carousel cards to find which is centered and select it
  const selectCenterItem = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestProduct: Product | null = null;
    let minDistance = Infinity;

    const cards = container.querySelectorAll('[data-product-id]');
    cards.forEach((cardNode) => {
      const card = cardNode as HTMLElement;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        const id = card.getAttribute('data-product-id');
        closestProduct = products.find((p) => p.id === id) || null;
      }
    });

    if (closestProduct && (!selectedProduct || selectedProduct.id !== (closestProduct as Product).id)) {
      selectItem(category, closestProduct);
    }
  };

  // Scroll listener with settle timeout
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Throttled scan for immediate visual updates during swiping is handled by CSS,
    // but we write a settling timer to commit the item select and record it in undo history.
    scrollTimeoutRef.current = setTimeout(() => {
      selectCenterItem();
    }, 120);
  };

  // Modern browsers support 'scrollend', which is much cleaner!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      selectCenterItem();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add scrollend support if available
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', handleScrollEnd);
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if ('onscrollend' in window) {
        container.removeEventListener('scrollend', handleScrollEnd);
      }
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [products, selectedProduct?.id]);

  // Click on item to center scroll and select immediately
  const handleCardClick = (product: Product, event: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;
    
    selectItem(category, product);
    
    const card = event.currentTarget;
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  // Desktop drag-to-scroll support
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = false;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDraggingRef.current = true;
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed modifier
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Auto-snap and select center item after drag settles
      setTimeout(() => {
        selectCenterItem();
      }, 50);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full h-full flex items-center group/track overflow-hidden">
      {/* Visual Track Indicators */}
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Horizontal Carousel Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="w-full h-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center gap-6 px-[35vw] md:px-[40%] scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          
          return (
            <div
              key={product.id}
              data-product-id={product.id}
              onClick={(e) => handleCardClick(product, e)}
              className="flex-shrink-0 w-[42vw] md:w-[220px] h-[85%] snap-center flex items-center justify-center relative cursor-pointer"
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-2xl relative transition-transform duration-500">
                {/* Product Image Overlay and Container */}
                <div className="relative w-full h-[70%] flex items-center justify-center transition-transform duration-500">
                  {product.image.startsWith('accessory_') ? (
                    // Beautiful custom SVG/gradient render for Phase 2 accessories
                    <AccessoryVectorIcon type={product.image} isSelected={isSelected} />
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className={`max-w-full max-h-full object-contain transition-all duration-700 select-none ${
                        isSelected 
                          ? 'scale-110 rotate-[-1deg] drop-shadow-[0_15px_30px_var(--glow-primary)]' 
                          : 'scale-90 opacity-20 blur-[1px] hover:opacity-40 filter grayscale duration-300'
                      }`}
                    />
                  )}

                  {/* Focus Aura Glow */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-accent/5 blur-[45px] -z-10 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Subtitle brand metadata */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-1 w-full text-center pointer-events-none"
                  >
                    <p className="text-[7px] uppercase font-black text-accent tracking-[0.2em]">{product.brand}</p>
                    <p className="text-[10px] font-black uppercase tracking-tight text-white/90 truncate max-w-[90%] mx-auto mt-0.5">{product.name}</p>
                    <p className="text-[9px] font-black text-white/50 mt-0.5">KES {product.price.toLocaleString()}</p>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Sub-component to render gorgeous dark cyberpunk vector cards for Accessories
function AccessoryVectorIcon({ type, isSelected }: { type: string; isSelected: boolean }) {
  let svgPath = '';
  let viewbox = '0 0 24 24';
  
  if (type === 'accessory_glasses') {
    // Futuristic glasses path
    svgPath = 'M2 10h3l1.5-3h11l1.5 3h3v2c0 3-2 5-5 5H8.5c-3 0-5-2-5-5v-2zm4.5 0c-1 0-1.5.5-1.5 1.5S5.5 13 6.5 13h2c1 0 1.5-.5 1.5-1.5S9.5 10 8.5 10h-2zm9 0c-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5h2c1 0 1.5-.5 1.5-1.5s-.5-1.5-1.5-1.5h-2z';
  } else if (type === 'accessory_sling') {
    // Tactical backpack / sling bag path
    svgPath = 'M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M3 10h18v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8zm5 0V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3';
  } else {
    // Chronograph smart watch path
    svgPath = 'M12 2v4M12 18v4M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-3 6h3.5L14 9.5';
  }

  return (
    <div className={`w-[70px] h-[70px] rounded-2xl flex flex-col items-center justify-center transition-all duration-700 ${
      isSelected 
        ? 'bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 glow-active scale-110' 
        : 'bg-surface-2 border-border-subtle border border-border-subtle opacity-20 scale-90'
    }`}>
      <svg
        viewBox={viewbox}
        fill="none"
        stroke={isSelected ? 'var(--accent)' : 'var(--foreground)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d={svgPath} />
      </svg>
      <span className={`text-[6px] uppercase tracking-widest font-black mt-2 ${isSelected ? 'text-accent' : 'text-white/40'}`}>
        {type.replace('accessory_', '')}
      </span>
    </div>
  );
}
