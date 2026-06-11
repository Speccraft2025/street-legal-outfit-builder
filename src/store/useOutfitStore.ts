import { create } from 'zustand';
import { Product, Category, Outfit } from '@/types';
import { products } from '@/data/products';

export type VisualMode = 'flat-lay' | 'human-model' | 'avatar-3d';

interface OutfitState {
  selectedItems: Partial<Record<Category, Product>>;
  visualMode: VisualMode;
  vibe: string | null;
  
  // History tracking (Undo/Redo)
  undoStack: Partial<Record<Category, Product>>[];
  redoStack: Partial<Record<Category, Product>>[];

  // Actions
  selectItem: (category: Category, product: Product) => void;
  removeItem: (category: Category) => void;
  setVisualMode: (mode: VisualMode) => void;
  setVibe: (vibe: string | null) => void;
  randomizeOutfit: () => void;
  clearOutfit: () => void;
  loadOutfit: (outfitItems: Partial<Record<Category, Product>>) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Derived values
  getTotalPrice: () => { subtotal: number; discount: number; total: number; isBundle: boolean };
}

// Helper to push to history
const pushToHistory = (
  state: {
    selectedItems: Partial<Record<Category, Product>>;
    undoStack: Partial<Record<Category, Product>>[];
    redoStack: Partial<Record<Category, Product>>[];
  }
) => {
  // Limit stack size to 20 for memory efficiency
  const newUndo = [...state.undoStack, { ...state.selectedItems }];
  if (newUndo.length > 20) newUndo.shift();
  return {
    undoStack: newUndo,
    redoStack: [], // Clear redo on new action
  };
};

export const useOutfitStore = create<OutfitState>((set, get) => ({
  selectedItems: {},
  visualMode: 'flat-lay',
  vibe: null,
  undoStack: [],
  redoStack: [],

  selectItem: (category, product) => set((state) => {
    // Prevent duplicate states in history
    if (state.selectedItems[category]?.id === product.id) return state;
    
    const historyUpdate = pushToHistory(state);
    return {
      ...historyUpdate,
      selectedItems: { ...state.selectedItems, [category]: product }
    };
  }),

  removeItem: (category) => set((state) => {
    if (!state.selectedItems[category]) return state;

    const historyUpdate = pushToHistory(state);
    const newItems = { ...state.selectedItems };
    delete newItems[category];
    return {
      ...historyUpdate,
      selectedItems: newItems
    };
  }),

  setVisualMode: (visualMode) => set({ visualMode }),
  
  setVibe: (vibe) => set({ vibe }),

  randomizeOutfit: () => set((state) => {
    const historyUpdate = pushToHistory(state);
    
    // Pick one random item for each of the 4 major categories
    const categories: Category[] = ['Headgear', 'Tops', 'Bottoms', 'Footgear'];
    const newItems: Partial<Record<Category, Product>> = { ...state.selectedItems };

    categories.forEach((cat) => {
      const catProducts = products.filter((p) => p.category === cat);
      if (catProducts.length > 0) {
        const randomIdx = Math.floor(Math.random() * catProducts.length);
        newItems[cat] = catProducts[randomIdx];
      }
    });

    // Optionally pick accessories 50% of the time
    if (Math.random() > 0.5) {
      const accessoryProducts = products.filter((p) => p.category === 'Accessories');
      if (accessoryProducts.length > 0) {
        const randomIdx = Math.floor(Math.random() * accessoryProducts.length);
        newItems['Accessories'] = accessoryProducts[randomIdx];
      } else {
        delete newItems['Accessories'];
      }
    } else {
      delete newItems['Accessories'];
    }

    return {
      ...historyUpdate,
      selectedItems: newItems
    };
  }),

  clearOutfit: () => set((state) => {
    const historyUpdate = pushToHistory(state);
    return {
      ...historyUpdate,
      selectedItems: {}
    };
  }),

  loadOutfit: (outfitItems) => set({
    selectedItems: outfitItems,
    undoStack: [],
    redoStack: []
  }),

  undo: () => set((state) => {
    if (state.undoStack.length === 0) return state;

    const newUndoStack = [...state.undoStack];
    const previousState = newUndoStack.pop()!;
    
    return {
      undoStack: newUndoStack,
      redoStack: [...state.redoStack, { ...state.selectedItems }],
      selectedItems: previousState
    };
  }),

  redo: () => set((state) => {
    if (state.redoStack.length === 0) return state;

    const newRedoStack = [...state.redoStack];
    const nextState = newRedoStack.pop()!;

    return {
      undoStack: [...state.undoStack, { ...state.selectedItems }],
      redoStack: newRedoStack,
      selectedItems: nextState
    };
  }),

  canUndo: () => get().undoStack.length > 0,
  
  canRedo: () => get().redoStack.length > 0,

  getTotalPrice: () => {
    const items = Object.values(get().selectedItems).filter(Boolean) as Product[];
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    
    // Bundle incentive only applies when all 4 primary pieces are selected
    const hasPrimaryFour = 
      get().selectedItems.Headgear &&
      get().selectedItems.Tops &&
      get().selectedItems.Bottoms &&
      get().selectedItems.Footgear;

    const isBundle = !!hasPrimaryFour;
    const discount = isBundle ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return { subtotal, discount, total, isBundle };
  }
}));
