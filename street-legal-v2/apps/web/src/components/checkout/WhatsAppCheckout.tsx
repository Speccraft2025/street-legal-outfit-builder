'use client';
import { useOutfitStore } from '../../store/useOutfitStore';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';

// Assuming a central WhatsApp Number for the test
const STREET_LEGAL_WA_NUMBER = '1234567890'; // Placeholder

export function WhatsAppCheckout() {
  const selectedItems = useOutfitStore(state => state.selectedItems);
  const getTotalPrice = useOutfitStore(state => state.getTotalPrice);
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleBuyIntent = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const itemsList = Object.values(selectedItems)
      .filter(Boolean)
      .map(item => `- ${item!.name} ($${(item!.price / 100).toFixed(2)}) [ID: ${item!.id}]`)
      .join('\n');
      
    const total = `$${(getTotalPrice() / 100).toFixed(2)}`;
    
    const message = `🚨 *STREET LEGAL ORDER REQUEST* 🚨\n\nI want to buy this outfit:\n${itemsList}\n\n*Total Estimate:* ${total}\n\nPlease confirm availability!`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${STREET_LEGAL_WA_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const hasItems = Object.values(selectedItems).length > 0;

  if (!hasItems) return null;

  return (
    <>
      <button 
        onClick={handleBuyIntent}
        className="w-full py-4 mt-8 bg-cyber-lime text-black font-extrabold text-xl rounded shadow-cyber hover:bg-white transition-colors"
      >
        BUY THIS FIT (via WhatsApp)
      </button>

      {showAuthModal && (
        <AuthModal 
          onSuccess={() => setShowAuthModal(false)}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
