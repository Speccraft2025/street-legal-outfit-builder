'use client';
import { useOutfitStore } from '../../store/useOutfitStore';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { AuthModal } from '../auth/AuthModal';

export function ShareModal() {
  const [shareUrl, setShareUrl] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const getShareUrl = useOutfitStore(state => state.getShareUrl);
  const { user } = useAuth();

  useEffect(() => {
    // Generate URL based on window.location.origin
    if (typeof window !== 'undefined') {
      setShareUrl(getShareUrl(window.location.origin));
    }
  }, [getShareUrl]);

  const handleCopy = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const text = encodeURIComponent(`Rate my Street Legal fit: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="p-4 bg-void border border-chrome rounded-lg shadow-cyber">
      <h3 className="text-xl font-bold text-cyber-lime mb-4">Share Outfit</h3>
      <input 
        type="text" 
        readOnly 
        value={shareUrl} 
        className="w-full p-2 bg-black text-white border border-gray-700 rounded mb-4"
      />
      <div className="flex gap-4">
        <button onClick={handleCopy} className="px-4 py-2 bg-chrome text-black font-bold rounded">
          Copy Link
        </button>
        <button onClick={handleWhatsAppShare} className="px-4 py-2 bg-[#25D366] text-white font-bold rounded">
          Share to WhatsApp
        </button>
      </div>

      {showAuthModal && (
        <AuthModal 
          onSuccess={() => setShowAuthModal(false)}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
