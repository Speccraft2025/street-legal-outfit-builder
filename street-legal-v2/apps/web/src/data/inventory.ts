export type LayerType = 'HEADWEAR' | 'TOP' | 'BOTTOM' | 'FOOTWEAR' | 'ACCESSORY';

export interface ThriftItem {
  id: string;
  name: string;
  supplierName: string;
  price: number; // in cents
  layer: LayerType;
  imageUrl: string;
  size: string;
}

export const REALITY_INVENTORY: ThriftItem[] = [
  // HEADWEAR
  { id: 'h1', name: 'Vintage Faded Yankees Cap', supplierName: 'ThriftGod_NYC', price: 2500, layer: 'HEADWEAR', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400', size: 'OS' },
  { id: 'h2', name: 'Distressed Cyber Beanie', supplierName: 'Void.Archive', price: 1800, layer: 'HEADWEAR', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=400', size: 'OS' },
  
  // TOPS
  { id: 't1', name: 'Y2K Tribal Print Zip-Up', supplierName: 'Archive.VTG', price: 6500, layer: 'TOP', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400', size: 'L' },
  { id: 't2', name: 'Faded Carhartt Detroit Jacket', supplierName: 'Workwear_Supply', price: 12000, layer: 'TOP', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400', size: 'XL' },
  
  // BOTTOMS
  { id: 'b1', name: 'Baggy JNCO Denim', supplierName: 'Y2K_Vault', price: 8500, layer: 'BOTTOM', imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=400', size: '34x32' },
  { id: 'b2', name: 'Nylon Parachute Pants', supplierName: 'Techwear_Drop', price: 4500, layer: 'BOTTOM', imageUrl: 'https://images.unsplash.com/photo-1555689986-2605f6458514?auto=format&fit=crop&q=80&w=400', size: 'M' },
  
  // FOOTWEAR
  { id: 'f1', name: 'Beat Up ASICS Gel-Kayano 14', supplierName: 'Sneaker_Archive', price: 11000, layer: 'FOOTWEAR', imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=400', size: 'US 10' },
  { id: 'f2', name: 'Chunky Skater Shoes (Osiris)', supplierName: 'Y2K_Vault', price: 9500, layer: 'FOOTWEAR', imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400', size: 'US 9.5' },
];
