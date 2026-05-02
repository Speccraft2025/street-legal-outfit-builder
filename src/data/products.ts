import { Product } from '@/types';

export const products: Product[] = [
  // Headgear (500 - 1200 KES)
  { id: 'h1', name: 'Noir Supply Beanie', brand: 'KUUNDA', price: 850, category: 'Headgear', image: '/products/h1.png', tags: ['minimal', 'warm'], color: 'Black' },
  { id: 'h2', name: 'Aura Streetwear Cap', brand: 'JAZA MOTO', price: 1200, category: 'Headgear', image: '/products/h2.png', tags: ['graphic', 'street'], color: 'Neon' },
  { id: 'h3', name: 'Aeon Studio Bucket', brand: 'NYOTA', price: 950, category: 'Headgear', image: '/products/h3.png', tags: ['utility', 'summer'], color: 'Black' },
  
  // Tops (1500 - 3500 KES)
  { id: 't1', name: 'Void Heavy Hoodie', brand: 'KUUNDA', price: 2800, category: 'Tops', image: '/products/t1.png', tags: ['warm', 'premium'], color: 'Charcoal' },
  { id: 't2', name: 'Axon-9 Tech Jacket', brand: 'NYOTA', price: 3500, category: 'Tops', image: '/products/t2.png', tags: ['tech', 'waterproof'], color: 'Black' },
  { id: 't3', name: 'Aether Graphic Tee', brand: 'KASI', price: 1500, category: 'Tops', image: '/products/t3.png', tags: ['minimal', 'cotton'], color: 'White' },

  // Bottoms (1500 - 3500 KES)
  { id: 'b1', name: 'Aether Cargo Jogger', brand: 'NYOTA', price: 2500, category: 'Bottoms', image: '/products/b1.png', tags: ['utility', 'tech'], color: 'Black' },
  { id: 'b2', name: 'Archive Baggy Denim', brand: 'KASI', price: 3200, category: 'Bottoms', image: '/products/b2.png', tags: ['90s', 'raw'], color: 'Indigo' },
  { id: 'b3', name: 'Street Nylon Shorts', brand: 'JAZA MOTO', price: 1800, category: 'Bottoms', image: '/products/b3.png', tags: ['active', 'cool'], color: 'Black' },

  // Footgear (1200 - 3500 KES)
  { id: 'f1', name: 'Apex Neo Runners', brand: 'NYOTA', price: 3500, category: 'Footgear', image: '/products/f1.png', tags: ['cyber', 'neon'], color: 'White/Green' },
  { id: 'f2', name: 'Urban Tactical Boot', brand: 'KUUNDA', price: 3200, category: 'Footgear', image: '/products/f2.png', tags: ['rugged', 'tech'], color: 'Black' },
  { id: 'f3', name: 'Canvas High-Tops', brand: 'KASI', price: 2200, category: 'Footgear', image: '/products/f3.png', tags: ['classic', 'canvas'], color: 'Black/White' },
];
