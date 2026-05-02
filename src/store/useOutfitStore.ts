import { create } from 'zustand';
import { Product, Category, Outfit } from '@/types';

interface OutfitState {
  selectedItems: Outfit;
  cart: Product[];
  vibe: string | null;
  
  // Actions
  selectItem: (category: Category, product: Product) => void;
  removeItem: (category: Category) => void;
  setVibe: (vibe: string | null) => void;
  addToCart: (items: Product[]) => void;
  clearOutfit: () => void;
  
  // Derived values (computed in the component or via getters)
  getTotalPrice: () => { subtotal: number; discount: number; total: number; isBundle: boolean };
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  selectedItems: {},
  cart: [],
  vibe: null,

  selectItem: (category, product) => set((state) => ({
    selectedItems: { ...state.selectedItems, [category]: product }
  })),

  removeItem: (category) => set((state) => {
    const newItems = { ...state.selectedItems };
    delete newItems[category];
    return { selectedItems: newItems };
  }),

  setVibe: (vibe) => set({ vibe }),

  addToCart: (items) => set((state) => ({
    cart: [...state.cart, ...items]
  })),

  clearOutfit: () => set({ selectedItems: {} }),

  getTotalPrice: () => {
    const items = Object.values(get().selectedItems).filter(Boolean) as Product[];
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const isBundle = items.length === 4;
    const discount = isBundle ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return { subtotal, discount, total, isBundle };
  }
}));
