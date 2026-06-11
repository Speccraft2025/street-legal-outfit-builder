export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export type FetchOutfitsResponse = APIResponse<{ outfits: any[] }>;

// INVENTORY TYPES
export enum ItemState {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD'
}

export enum LayerType {
  HEADWEAR = 'HEADWEAR',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  FOOTWEAR = 'FOOTWEAR',
  ACCESSORY = 'ACCESSORY'
}

export interface ProductUploadPayload {
  name: string;
  basePrice: number;
  layer: LayerType;
  brand?: string;
  imageUrl: string;
}

export interface SupplierInventoryResponse {
  products: {
    id: string;
    name: string;
    basePrice: number;
    status: ItemState;
    imageUrl: string;
    createdAt: string;
  }[];
}
