# Project Brief: Street Legal – Outfit Builder

## 1. Project Vision
**Street Legal** is a conversion-optimized, engine-first e-commerce platform designed for the affordable streetwear market. Unlike traditional grid-based stores, Street Legal uses an anatomical "Outfit Builder" as its primary interface, allowing users to swipe through layers to discover and purchase complete looks instantly.

---

## 2. Core Mechanics & UX
### 🧩 The Engine
The core of the application is a vertical stack of four horizontal carousels representing the human silhouette:
1. **Headgear** (18% height)
2. **Tops** (32% height)
3. **Bottoms** (32% height)
4. **Footgear** (18% height)

### 🖱️ Interaction Model
*   **Swipe-to-Choose**: Users swipe left/right on any category to change that specific layer.
*   **Center-Snap Selection**: The item currently snapped to the center of each carousel is automatically selected for the active outfit.
*   **Real-time HUD**: A floating checkout bar tracks the total price and bundle status dynamically as the user interacts with the carousels.

---

## 3. Product & Pricing Strategy
### 💰 Target Price Range
*   **Affordability First**: Items range from **500 KES to 3,500 KES**.
*   **Bundle Incentive**: A mandatory **10% discount** is applied when a user selects an item in all four categories (Headgear + Tops + Bottoms + Footgear).
*   **Outfit Totals**: Average complete outfits range from **KES 5,000 to KES 10,500**.

### 📸 Aesthetic Direction
*   **Online Store Level**: High-end, studio-lit product photography isolated on clean backgrounds.
*   **Premium Minimalist**: Dark-mode interface (`#050505`) with Cyber Lime (`#ccff00`) accents and subtle grain textures.

---

## 4. Technical Architecture
### 🛠️ Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS 4 (CSS-first theme configuration)
*   **State Management**: Zustand (Outfit state, pricing logic, bundle tracking)
*   **Animations**: Framer Motion (Smooth snaps, focus glows, HUD transitions)
*   **Icons**: Lucide React

### 📁 Key Project Structure
*   `src/app/page.tsx`: The primary engine and UI.
*   `src/store/useOutfitStore.ts`: Central state logic for selections and pricing.
*   `src/data/products.ts`: Local product database with metadata and image paths.
*   `public/products/`: Optimized asset storage for product images.

---

## 5. Current Implementation Status
- [x] **Phase 1**: Project scaffold and dependency setup.
- [x] **Phase 2**: Anatomical carousel engine with proportional heights.
- [x] **Phase 3**: Center-snap selection logic and state management.
- [x] **Phase 4**: Affordable pricing update and bundle discount engine.
- [x] **Phase 5**: High-end product photography generation and seeding (12 items).
- [x] **Phase 6**: GitHub Repository deployment.

---

## 6. Future Roadmap
*   **M-Pesa Integration**: Direct checkout via STK Push.
*   **Real Inventory Sync**: Connection to a headless Shopify or MedusaJS backend.
*   **User Favorites**: Ability to save "Fits" to a personal archive.
*   **Social Sharing**: Generate a shareable image of the selected outfit for Instagram/TikTok.
