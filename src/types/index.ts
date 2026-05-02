export type Category = 'Headgear' | 'Tops' | 'Bottoms' | 'Footgear';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  tags: string[];
  color: string;
}

export interface Outfit {
  Headgear?: Product;
  Tops?: Product;
  Bottoms?: Product;
  Footgear?: Product;
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
    Footgear: string;
  };
}
