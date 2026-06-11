'use client';

import React, { useState, useRef } from 'react';
import { useOutfitStore, VisualMode } from '@/store/useOutfitStore';
import OutfitVisualizer from './OutfitVisualizer';
import { Outfit } from '@/types';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Shuffle, 
  Undo2, 
  Redo2, 
  Sparkles,
  Maximize2,
  RefreshCw,
  Bookmark,
  Share2,
  Flame
} from 'lucide-react';

export default function CenterStage() {
  const { 
    selectedItems, 
    visualMode, 
    setVisualMode, 
    randomizeOutfit, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useOutfitStore();

  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  // New states for Save & Share
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Zoom limits
  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, prev + 0.1));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.7, prev - 0.1));

  // Rotation limits
  const handleRotateLeft = () => setRotation((prev) => Math.max(-45, prev - 15));
  const handleRotateRight = () => setRotation((prev) => Math.min(45, prev + 15));

  const resetCamera = () => {
    setZoom(1.0);
    setRotation(0);
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSaveFit = () => {
    if (selectedCount === 0) {
      triggerToast('No items selected to save');
      return;
    }

    const brandName = Object.values(selectedItems)[0]?.brand || 'Street';
    const fitName = `${brandName} Look #${Math.floor(Math.random() * 1000)}`;
    const shareCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const fitPayload: Outfit = {
      id: Date.now().toString(),
      name: fitName,
      slug: fitName.toLowerCase().replace(/\s+/g, '-'),
      share_code: shareCode,
      visibility: 'public',
      items: selectedItems,
    };

    const stored = localStorage.getItem('street_legal_saved_outfits') || '[]';
    const parsed = JSON.parse(stored) as Outfit[];
    localStorage.setItem('street_legal_saved_outfits', JSON.stringify([fitPayload, ...parsed]));
    
    triggerToast('Fit saved to Closet!');
  };

  const handleShare = async () => {
    if (!visualizerRef.current || selectedCount === 0) {
       triggerToast('Nothing to share yet!');
       return;
    }
    
    try {
      setIsCapturing(true);
      triggerToast('Generating image...');
      
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await htmlToImage.toPng(visualizerRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: 'var(--background)',
      });
      
      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent || '')) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'street-legal-fit.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Street Legal Fit',
          text: 'Check out the fit I built on Street Legal!',
          files: [file],
        });
        triggerToast('Shared successfully!');
      } else {
        const link = document.createElement('a');
        link.download = 'street-legal-fit.png';
        link.href = dataUrl;
        link.click();
        triggerToast('Image downloaded!');
      }
    } catch (err) {
      console.error('Error sharing image:', err);
      triggerToast('Failed to generate image');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 relative overflow-hidden select-none bg-background">
      
      {/* Toast Popups */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-20 left-1/2 bg-accent text-black text-xs font-black uppercase px-6 py-3 rounded-full glow-primary z-50 flex items-center gap-2 pointer-events-none"
          >
            <Flame size={14} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--glow-hover)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Header Selector: Switchable Visual Modes */}
      <div className="w-full flex justify-between items-center z-20">
        <div className="flex bg-surface-2 border-border-subtle border border-border-subtle p-1 rounded-2xl backdrop-blur-xl">
          {[
            { id: 'flat-lay' as VisualMode, label: 'Flat Lay' },
            { id: 'human-model' as VisualMode, label: 'Model Flat' },
            { id: 'avatar-3d' as VisualMode, label: '3D Holo' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setVisualMode(mode.id)}
              className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest rounded-xl transition-all ${
                visualMode === mode.id
                  ? 'bg-accent text-black font-black glow-primary'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Undo/Redo Engine hud */}
        <div className="flex items-center gap-1.5 bg-surface-2 border-border-subtle border border-border-subtle p-1.5 rounded-2xl">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded-xl text-white/50 hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
            title="Undo"
          >
            <Undo2 size={12} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded-xl text-white/50 hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
            title="Redo"
          >
            <Redo2 size={12} />
          </button>
        </div>
      </div>

      {/* Central Viewport Area */}
      <div ref={visualizerRef} className={`flex-1 w-full flex items-center justify-center relative my-4 ${isCapturing ? 'bg-background' : ''}`}>
        {selectedCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-[280px] z-10">
            <div className="w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center border border-accent/20 mb-4 animate-pulse">
              <Sparkles size={20} className="text-accent" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white/80 italic">BUILD YOUR STREET IDENTITY</h2>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] leading-relaxed mt-2">
              Swipe products in the tracks on the right, or randomize below to construct a look.
            </p>
          </div>
        ) : (
          <OutfitVisualizer
            selectedItems={selectedItems}
            visualMode={visualMode}
            zoom={zoom}
            rotation={rotation}
          />
        )}
      </div>

      {/* Bottom Interface Controls Panel */}
      <div className="w-full flex justify-between items-center z-20">
        
        {/* Rotation & Zoom Orbit hud */}
        <div className="flex items-center gap-2 bg-surface-2 border-border-subtle border border-border-subtle p-1.5 rounded-2xl backdrop-blur-xl">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={12} />
          </button>
          <span className="text-[8px] font-mono text-white/20 uppercase w-7 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={12} />
          </button>

          <div className="w-px h-4 bg-surface-3 mx-1" />

          <button
            onClick={handleRotateLeft}
            className="p-2 rounded-xl hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
            title="Rotate Left"
          >
            <RotateCcw size={12} />
          </button>
          <span className="text-[8px] font-mono text-white/20 uppercase w-7 text-center">
            {rotation}°
          </span>
          <button
            onClick={handleRotateRight}
            className="p-2 rounded-xl hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
            title="Rotate Right"
          >
            <RotateCw size={12} />
          </button>

          <div className="w-px h-4 bg-surface-3 mx-1" />

          <button
            onClick={resetCamera}
            className="p-2 rounded-xl hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
            title="Reset Camera"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-2 z-20">
          <button
            onClick={handleSaveFit}
            disabled={selectedCount === 0}
            className="p-3.5 rounded-2xl bg-surface-2 border-border-subtle border border-border-subtle hover:bg-surface-3 text-white/60 hover:text-foreground disabled:opacity-30 transition-all flex items-center justify-center"
            title="Save Fit to Closet"
          >
            <Bookmark size={12} />
          </button>
          
          <button
            onClick={handleShare}
            disabled={selectedCount === 0 || isCapturing}
            className="p-3.5 rounded-2xl bg-surface-2 border-border-subtle border border-border-subtle hover:bg-surface-3 text-white/60 hover:text-foreground disabled:opacity-30 transition-all flex items-center justify-center"
            title="Share or Download Image"
          >
            <Share2 size={12} className={isCapturing ? 'animate-pulse' : ''} />
          </button>

          {/* Cyber Lime Shuffle trigger */}
          <button
            onClick={randomizeOutfit}
            className="bg-accent text-black p-3.5 px-6 rounded-2xl text-[10px] font-black uppercase italic flex items-center gap-2 hover:scale-105 active:scale-95 transition-all glow-primary group ml-2"
          >
            SHUFFLE LOOK <Shuffle size={12} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
