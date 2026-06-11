import { create } from 'zustand';
import { Product, Outfit } from '@/types';

export interface CartEntry {
  id: string; // Unique entry ID
  type: 'single' | 'outfit';
  product?: Product;
  outfit?: Outfit;
  quantity: number;
}

interface CartState {
  entries: CartEntry[];
  
  // Actions
  addProduct: (product: Product) => void;
  addOutfit: (outfit: Outfit) => void;
  removeEntry: (entryId: string) => void;
  updateQuantity: (entryId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Getters
  getTotals: () => {
    subtotal: number;
    discount: number;
    total: number;
    itemCount: number;
    hasOutfitBundle: boolean;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  entries: [],

  addProduct: (product) => set((state) => {
    const existingIndex = state.entries.findIndex(
      (e) => e.type === 'single' && e.product?.id === product.id
    );

    if (existingIndex !== -1) {
      const updatedEntries = [...state.entries];
      updatedEntries[existingIndex].quantity += 1;
      return { entries: updatedEntries };
    }

    const newEntry: CartEntry = {
      id: `cart-single-${product.id}-${Date.now()}`,
      type: 'single',
      product,
      quantity: 1,
    };
    return { entries: [...state.entries, newEntry] };
  }),

  addOutfit: (outfit) => set((state) => {
    // Generate a unique ID for this specific look bundle in the cart
    const newEntry: CartEntry = {
      id: `cart-fit-${outfit.share_code || 'temp'}-${Date.now()}`,
      type: 'outfit',
      outfit,
      quantity: 1,
    };
    return { entries: [...state.entries, newEntry] };
  }),

  removeEntry: (entryId) => set((state) => ({
    entries: state.entries.filter((e) => e.id !== entryId),
  })),

  updateQuantity: (entryId, quantity) => set((state) => ({
    entries: state.entries
      .map((e) => (e.id === entryId ? { ...e, quantity: Math.max(1, quantity) } : e)),
  })),

  clearCart: () => set({ entries: [] }),

  getTotals: () => {
    const entries = get().entries;
    let subtotal = 0;
    let discount = 0;
    let itemCount = 0;
    let hasOutfitBundle = false;

    entries.forEach((entry) => {
      if (entry.type === 'single' && entry.product) {
        subtotal += entry.product.price * entry.quantity;
        itemCount += entry.quantity;
      } else if (entry.type === 'outfit' && entry.outfit) {
        hasOutfitBundle = true;
        const outfitItems = Object.values(entry.outfit.items).filter(Boolean) as Product[];
        const outfitSubtotal = outfitItems.reduce((sum, item) => sum + item.price, 0);
        
        // Bundle Incentive: 10% discount if the outfit contains all 4 major categories
        const isFullBundle = 
          entry.outfit.items.Headgear &&
          entry.outfit.items.Tops &&
          entry.outfit.items.Bottoms &&
          entry.outfit.items.Footgear;

        const bundleDiscount = isFullBundle ? outfitSubtotal * 0.1 : 0;
        
        subtotal += outfitSubtotal * entry.quantity;
        discount += bundleDiscount * entry.quantity;
        itemCount += outfitItems.length * entry.quantity;
      }
    });

    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      total,
      itemCount,
      hasOutfitBundle,
    };
  },
}));
