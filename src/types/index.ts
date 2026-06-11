export type Category = 'Headgear' | 'Tops' | 'Bottoms' | 'Footgear' | 'Accessories';

export interface Profile {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  description?: string;
  category: Category;
  price: number;
  currency: string;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  image: string; // compatibility with existing view
  images: string[];
  tags: string[];
  color: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface Outfit {
  id?: string;
  name: string;
  slug: string;
  share_code: string;
  thumbnail?: string;
  created_by?: string;
  visibility: 'public' | 'private';
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
  items: Partial<Record<Category, Product>>;
}

export interface SavedOutfit {
  id: string;
  user_id: string;
  outfit_id: string;
  status: 'saved' | 'draft' | 'shared';
  created_at?: string;
  outfits?: Outfit; // Joined from Supabase
}

export interface Order {
  id: string;
  user_id?: string;
  email?: string;
  total: number;
  discount: number;
  status: 'pending' | 'paid' | 'failed' | 'fulfilled';
  payment_method: 'stripe' | 'mpesa';
  payment_reference?: string;
  created_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
  product?: Product;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  vibe: string;
  items: {
    Headgear: string;
    Tops: string;
    Bottoms: string;
    Footgear?: string;
    Footwear?: string;
  };
}
