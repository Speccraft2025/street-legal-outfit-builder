import { create } from 'zustand';
import { ThriftItem, LayerType, REALITY_INVENTORY } from '../data/inventory';

interface OutfitState {
  selectedItems: Partial<Record<LayerType, ThriftItem>>;
  
  // Actions
  selectItem: (layer: LayerType, item: ThriftItem) => void;
  removeItem: (layer: LayerType) => void;
  clearOutfit: () => void;
  
  // URL Loading
  loadFromUrl: (queryParamStr: string) => void;
  
  // Derived
  getTotalPrice: () => number;
  getShareUrl: (baseUrl: string) => string;
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  selectedItems: {},

  selectItem: (layer, item) => set((state) => {
    const newItems = { ...state.selectedItems, [layer]: item };
    return { selectedItems: newItems };
  }),

  removeItem: (layer) => set((state) => {
    const newItems = { ...state.selectedItems };
    delete newItems[layer];
    return { selectedItems: newItems };
  }),

  clearOutfit: () => set({ selectedItems: {} }),

  loadFromUrl: (queryParamStr: string) => {
    const params = new URLSearchParams(queryParamStr);
    const itemIds = params.get('outfit')?.split(',') || [];
    
    if (itemIds.length === 0) return;

    const loadedItems: Partial<Record<LayerType, ThriftItem>> = {};
    
    itemIds.forEach(id => {
      const foundItem = REALITY_INVENTORY.find(item => item.id === id);
      if (foundItem) {
        loadedItems[foundItem.layer] = foundItem;
      }
    });

    set({ selectedItems: loadedItems });
  },

  getTotalPrice: () => {
    const items = Object.values(get().selectedItems).filter(Boolean) as ThriftItem[];
    return items.reduce((sum, item) => sum + item.price, 0);
  },

  getShareUrl: (baseUrl: string) => {
    const items = Object.values(get().selectedItems).filter(Boolean) as ThriftItem[];
    if (items.length === 0) return baseUrl;
    
    const ids = items.map(i => i.id).join(',');
    return `${baseUrl}?outfit=${ids}`;
  }
}));
