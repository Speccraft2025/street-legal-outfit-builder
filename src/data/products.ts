import { Product } from '@/types';

const rawProducts = [
  // ===== Headgear (thrift range: 100 - 500 KES) =====
  { id: 'h1', name: 'Noir Supply Beanie', brand: 'KUUNDA', price: 200, category: 'Headgear' as const, image: '/products/h1.png', tags: ['minimal', 'warm'], color: 'Black' },
  { id: 'h2', name: 'Aura Streetwear Cap', brand: 'JAZA MOTO', price: 350, category: 'Headgear' as const, image: '/products/h2.png', tags: ['graphic', 'street'], color: 'Neon' },
  { id: 'h3', name: 'Aeon Studio Bucket', brand: 'NYOTA', price: 250, category: 'Headgear' as const, image: '/products/h3.png', tags: ['utility', 'summer'], color: 'Black' },
  { id: 'h4', name: 'Kito Ribbed Beanie', brand: 'KASI', price: 180, category: 'Headgear' as const, image: 'icon:beanie', tags: ['minimal', 'warm'], color: 'Olive' },
  { id: 'h5', name: 'Ghost Snapback', brand: 'KUUNDA', price: 300, category: 'Headgear' as const, image: 'icon:cap', tags: ['graphic', 'street'], color: 'Grey' },
  { id: 'h6', name: 'Rafiki Denim Bucket', brand: 'NYOTA', price: 280, category: 'Headgear' as const, image: 'icon:bucket', tags: ['90s', 'summer'], color: 'Indigo' },
  { id: 'h7', name: 'Jua Kali Trucker Cap', brand: 'JAZA MOTO', price: 320, category: 'Headgear' as const, image: 'icon:cap', tags: ['utility', 'graphic'], color: 'Khaki' },
  { id: 'h8', name: 'Vex Wool Headband', brand: 'KASI', price: 150, category: 'Headgear' as const, image: 'icon:headband', tags: ['minimal', 'warm'], color: 'Black' },
  { id: 'h9', name: 'Nairobi Nights Beanie', brand: 'KUUNDA', price: 220, category: 'Headgear' as const, image: 'icon:beanie', tags: ['warm', 'street'], color: 'Charcoal' },

  // ===== Tops (thrift range: 400 - 2000 KES) =====
  { id: 't1', name: 'Void Heavy Hoodie', brand: 'KUUNDA', price: 1500, category: 'Tops' as const, image: '/products/t1.png', tags: ['warm', 'premium'], color: 'Charcoal' },
  { id: 't2', name: 'Axon-9 Tech Jacket', brand: 'NYOTA', price: 2000, category: 'Tops' as const, image: '/products/t2.png', tags: ['tech', 'waterproof'], color: 'Black' },
  { id: 't3', name: 'Aether Graphic Tee', brand: 'KASI', price: 500, category: 'Tops' as const, image: '/products/t3.png', tags: ['minimal', 'cotton'], color: 'White' },
  { id: 't4', name: 'Kanga Print Overshirt', brand: 'JAZA MOTO', price: 900, category: 'Tops' as const, image: 'icon:jacket', tags: ['graphic', 'heritage'], color: 'Multicolor' },
  { id: 't5', name: 'Blockout Crewneck', brand: 'KUUNDA', price: 1100, category: 'Tops' as const, image: 'icon:sweatshirt', tags: ['minimal', 'warm'], color: 'Grey' },
  { id: 't6', name: 'Matatu Route Tee', brand: 'NYOTA', price: 450, category: 'Tops' as const, image: 'icon:tee', tags: ['graphic', 'local'], color: 'Yellow' },
  { id: 't7', name: 'Ridge Denim Jacket', brand: 'KASI', price: 1800, category: 'Tops' as const, image: 'icon:jacket', tags: ['90s', 'raw'], color: 'Indigo' },
  { id: 't8', name: 'Utility Puffer Vest', brand: 'JAZA MOTO', price: 1600, category: 'Tops' as const, image: 'icon:vest', tags: ['utility', 'warm'], color: 'Black' },
  { id: 't9', name: 'Zero Gravity Longsleeve', brand: 'KUUNDA', price: 700, category: 'Tops' as const, image: 'icon:tee', tags: ['minimal', 'cotton'], color: 'White' },
  { id: 't10', name: 'Rugged Flannel Overshirt', brand: 'KASI', price: 950, category: 'Tops' as const, image: 'icon:jacket', tags: ['90s', 'warm'], color: 'Red Plaid' },
  { id: 't11', name: 'Signal Zip Hoodie', brand: 'NYOTA', price: 1400, category: 'Tops' as const, image: 'icon:hoodie', tags: ['tech', 'warm'], color: 'Black' },

  // ===== Bottoms (thrift range: 500 - 1800 KES) =====
  { id: 'b1', name: 'Aether Cargo Jogger', brand: 'NYOTA', price: 1200, category: 'Bottoms' as const, image: '/products/b1.png', tags: ['utility', 'tech'], color: 'Black' },
  { id: 'b2', name: 'Archive Baggy Denim', brand: 'KASI', price: 1500, category: 'Bottoms' as const, image: '/products/b2.png', tags: ['90s', 'raw'], color: 'Indigo' },
  { id: 'b3', name: 'Street Nylon Shorts', brand: 'JAZA MOTO', price: 700, category: 'Bottoms' as const, image: '/products/b3.png', tags: ['active', 'cool'], color: 'Black' },
  { id: 'b4', name: 'Dust Track Pants', brand: 'KUUNDA', price: 900, category: 'Bottoms' as const, image: 'icon:joggers', tags: ['active', 'street'], color: 'Grey' },
  { id: 'b5', name: 'Straight Leg Chino', brand: 'NYOTA', price: 1100, category: 'Bottoms' as const, image: 'icon:jeans', tags: ['minimal', 'smart'], color: 'Khaki' },
  { id: 'b6', name: 'Vintage Wash Jeans', brand: 'KASI', price: 1600, category: 'Bottoms' as const, image: 'icon:jeans', tags: ['90s', 'raw'], color: 'Light Blue' },
  { id: 'b7', name: 'Ripstop Cargo Shorts', brand: 'JAZA MOTO', price: 650, category: 'Bottoms' as const, image: 'icon:shorts', tags: ['utility', 'active'], color: 'Olive' },
  { id: 'b8', name: 'Loose Fit Sweatpants', brand: 'KUUNDA', price: 800, category: 'Bottoms' as const, image: 'icon:joggers', tags: ['warm', 'street'], color: 'Black' },

  // ===== Footgear (thrift range: 800 - 3000 KES) =====
  { id: 'f1', name: 'Apex Neo Runners', brand: 'NYOTA', price: 3000, category: 'Footgear' as const, image: '/products/f1.png', tags: ['cyber', 'neon'], color: 'White/Green' },
  { id: 'f2', name: 'Urban Tactical Boot', brand: 'KUUNDA', price: 2500, category: 'Footgear' as const, image: '/products/f2.png', tags: ['rugged', 'tech'], color: 'Black' },
  { id: 'f3', name: 'Canvas High-Tops', brand: 'KASI', price: 1200, category: 'Footgear' as const, image: '/products/f3.png', tags: ['classic', 'canvas'], color: 'Black/White' },
  { id: 'f4', name: 'Dala Court Sneakers', brand: 'JAZA MOTO', price: 1800, category: 'Footgear' as const, image: 'icon:sneaker', tags: ['classic', 'street'], color: 'White' },
  { id: 'f5', name: 'Kibo Trail Boot', brand: 'KUUNDA', price: 2200, category: 'Footgear' as const, image: 'icon:boot', tags: ['rugged', 'utility'], color: 'Brown' },
  { id: 'f6', name: 'Coast Slide Sandals', brand: 'NYOTA', price: 900, category: 'Footgear' as const, image: 'icon:sandal', tags: ['summer', 'cool'], color: 'Black' },
  { id: 'f7', name: 'Retro Hi-Top Sneaker', brand: 'KASI', price: 1600, category: 'Footgear' as const, image: 'icon:hightop', tags: ['90s', 'classic'], color: 'Red/White' },
  { id: 'f8', name: 'Flux Runner', brand: 'JAZA MOTO', price: 2000, category: 'Footgear' as const, image: 'icon:sneaker', tags: ['tech', 'street'], color: 'Grey' },

  // ===== Accessories (thrift range: 150 - 900 KES) =====
  { id: 'a1', name: 'Axon Tech Shield', brand: 'NYOTA', price: 400, category: 'Accessories' as const, image: 'icon:glasses', tags: ['cyber', 'eyewear'], color: 'Gloss Black' },
  { id: 'a2', name: 'Vandal Tactical Sling', brand: 'KUUNDA', price: 600, category: 'Accessories' as const, image: 'icon:bag', tags: ['utility', 'bag'], color: 'Matt Olive' },
  { id: 'a3', name: 'Onyx Hybrid Watch', brand: 'JAZA MOTO', price: 900, category: 'Accessories' as const, image: 'icon:watch', tags: ['smart', 'wristwear'], color: 'Stealth Black' },
  { id: 'a4', name: 'Retro Sun Shades', brand: 'KASI', price: 350, category: 'Accessories' as const, image: 'icon:glasses', tags: ['90s', 'eyewear'], color: 'Amber' },
  { id: 'a5', name: 'Kito Chain Necklace', brand: 'NYOTA', price: 250, category: 'Accessories' as const, image: 'icon:chain', tags: ['cyber', 'jewelry'], color: 'Silver' },
  { id: 'a6', name: 'Utility Web Belt', brand: 'KUUNDA', price: 300, category: 'Accessories' as const, image: 'icon:belt', tags: ['utility'], color: 'Black' },
  { id: 'a7', name: 'Canvas Tote Sling', brand: 'JAZA MOTO', price: 500, category: 'Accessories' as const, image: 'icon:bag', tags: ['utility', 'bag'], color: 'Sand' },
  { id: 'a8', name: 'Field Analog Watch', brand: 'KASI', price: 700, category: 'Accessories' as const, image: 'icon:watch', tags: ['smart', 'wristwear'], color: 'Olive' },
];

// Helper to fill out full Product details and keep types exact
export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  sku: `SL-${p.category.substring(0, 2).toUpperCase()}-${p.id.toUpperCase()}`,
  slug: p.name.toLowerCase().replace(/\s+/g, '-'),
  description: `${p.name} by ${p.brand}. A premium streetwear-focused item optimized for comfort, utility, and premium fits. Part of the latest collection.`,
  currency: 'KES',
  inventory: 15,
  status: 'active',
  images: [p.image],
  metadata: {
    tags: p.tags,
    color: p.color,
  }
}));
