import React from 'react';

// Minimal line-art icon set used whenever a product has no real photo.
// Products opt in by setting `image` to `icon:<type>` (e.g. 'icon:hoodie').
const ICON_PATHS: Record<string, string[]> = {
  // Headgear
  beanie: ['M4 13a8 8 0 0 1 16 0v3H4v-3z', 'M4 16h16', 'M8 16c0-1 .5-2 1-2s1 1 1 2', 'M14 16c0-1 .5-2 1-2s1 1 1 2'],
  cap: ['M4 14c0-4 3.5-7 8-7s8 3 8 7', 'M4 14h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z', 'M20 13c2 0 3 .8 3 1.7S22 16 20 16'],
  bucket: ['M6 10l-2 8h16l-2-8', 'M6 10a6 6 0 0 1 12 0'],
  headband: ['M4 13a8 8 0 0 1 16 0', 'M3 13h2M19 13h2'],

  // Tops
  hoodie: ['M8 4c0 2-2 2-2 5v13h12V9c0-3-2-3-2-5', 'M8 4a4 4 0 0 1 8 0', 'M6 10l-3 6 3 1', 'M18 10l3 6-3 1'],
  jacket: ['M7 4l5 2 5-2 3 4-3 3v11H7V11L4 8z', 'M12 6v14'],
  tee: ['M8 4l4 2 4-2 4 4-3 3v11H7V11L4 8z'],
  sweatshirt: ['M8 4c0 2-2 2-2 5v13h12V9c0-3-2-3-2-5', 'M8 4a4 4 0 0 1 8 0'],
  vest: ['M9 4l3 2 3-2 2 5-2 13H7L5 9z'],

  // Bottoms
  cargo: ['M8 3h8l1 18h-4l-1-9-1 9H7z', 'M6 9h3M15 9h3'],
  jeans: ['M7 3h10l1 18h-5l-1-8-1 8H6z'],
  shorts: ['M6 3h12l1 9H14l-1-4-1 4H6z'],
  joggers: ['M8 3h8l1 17c0 1-1 2-2 2h-1l-1-9-1 9H8c-1 0-2-1-2-2z'],

  // Footgear
  sneaker: ['M3 17c0-2 2-3 4-4l6-4 2 2 5 1c2 .5 3 2 3 4v1H3v-1z', 'M3 17h18'],
  boot: ['M8 3v9l-5 3v2h16v-3c0-2-1-3-3-4l-4-2V3z'],
  sandal: ['M3 15h18l-2 3H5z', 'M8 15V9M14 15V9'],
  hightop: ['M3 17c0-2 2-3 4-4l6-6 2 2 5 3c2 .8 3 2.4 3 4.3V17H3z', 'M3 17h18'],

  // Accessories
  glasses: ['M2 10h3l1.5-3h11l1.5 3h3v2c0 3-2 5-5 5H8.5c-3 0-5-2-5-5v-2zm4.5 0c-1 0-1.5.5-1.5 1.5S5.5 13 6.5 13h2c1 0 1.5-.5 1.5-1.5S9.5 10 8.5 10h-2zm9 0c-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5h2c1 0 1.5-.5 1.5-1.5s-.5-1.5-1.5-1.5h-2z'],
  bag: ['M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M3 10h18v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8zm5 0V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3'],
  watch: ['M12 2v4M12 18v4M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-3 6h3.5L14 9.5'],
  chain: ['M8 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M16 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M8 10v3a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-3'],
  belt: ['M3 10h18v4H3z', 'M10 10v4M14 10v4', 'M11 11h2v2h-2z'],
};

export function isIconImage(image: string): boolean {
  return image.startsWith('icon:') || image.startsWith('accessory_');
}

export function getIconType(image: string): string {
  return image.replace('icon:', '').replace('accessory_', '');
}

interface ItemGraphicProps {
  image: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function ItemGraphic({ image, className, strokeWidth = 1.5, style }: ItemGraphicProps) {
  const type = getIconType(image);
  const paths = ICON_PATHS[type] ?? ICON_PATHS.tee;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
