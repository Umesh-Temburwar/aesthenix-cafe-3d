# Reference Repositories Architectural Analysis

**Project**: AURA ROAST — Luxury 3D Café Website  
**Agency**: AesthenixTech  
**Date**: November 2026  

---

## 1. Reference Repositories Evaluated

### Reference 1: `kemenGeek/Kemen-Coffee`
* **Focus Area**: 3D Coffee Cup Hero & Scroll-Driven Parallax
* **Architectural Insights**:
  - Leverages Three.js canvas embedded within a sticky viewport container, allowing scroll progress to govern cup rotation, steam dissipation, and camera zoom.
  - Utilizes smooth damping (Lerp / GSAP tick sync) so mouse movement provides organic perspective shift without snapping.
  - Demonstrates floating micro-elements (coffee beans, aroma ribbons) to build ambient depth around the focal cup.
* **Adopted Concepts**:
  - Implemented interactive multi-axis mouse parallax and scroll-linked rotation in `CoffeeHeroScene`.
  - Added instanced floating coffee bean meshes around the cup with gentle rotational oscillations.
  - Built custom procedural steam particle geometry with billboarding and upward thermal drift.

---

### Reference 2: `yaminshakil/coffee_shop`
* **Focus Area**: Café Product Presentation, Menu Filtering & Cart State
* **Architectural Insights**:
  - Highlights clean category separation (Hot Coffee, Cold Brew, Specialties, Bakery, Desserts) with immediate visual feedback.
  - Demonstrates smooth modal inspection of product ingredients, roast profiles, and size options.
  - Emphasizes lightweight client-side state persistence for the shopping bag.
* **Adopted Concepts**:
  - Built a comprehensive typed coffee catalogue with realistic INR pricing, origin tasting notes, caffeine levels, and allergens.
  - Zustand-powered persistent cart store (`useCartStore`) with local storage hydration, item quantity toggling, and clean subtotal computation.
  - Fast search indexing with instant multi-category filters and detail modal.

---

### Reference 3: `krisvasoya/cafe-webui`
* **Focus Area**: Luxury Atmosphere, Editorial Typography & Table Reservation UX
* **Architectural Insights**:
  - Uses an editorial aesthetic: deep roast obsidian backgrounds (`#100C0A`), aged bronze and gold accents (`#C9A46A`), warm cream typography (`#F5EBDD`), and generous whitespace.
  - Emphasizes atmospheric lifestyle imagery paired with interactive reservation booking and location storytelling.
  - Clean form handling with clear validation states and responsive layouts.
* **Adopted Concepts**:
  - Crafted the luxury "AURA ROAST" visual identity with high-contrast serif typography (`Playfair Display`, `Cormorant Garamond`) and modern sans-serif body copy (`Inter`).
  - Implemented robust client-side validated reservation flow using `react-hook-form` and `zod` with clean demo service abstractions ready for Supabase or REST API backend hooks.
  - Added an interactive 3D Café Interior Explorer with clickable hotspots (Espresso Bar, Private Lounge, Roastery Shelf, Terrace Seating) and seamless camera fly-throughs.

---

## 2. Originality & Licensing Compliance
- All 3D procedural geometries, shaders, materials, and React components are originally engineered specifically for AURA ROAST and AesthenixTech.
- Royalty-free, high-resolution imagery from Unsplash CDN is selected with strict aesthetic curation (latte art, dark espresso machines, minimalist café architecture).
- Zero proprietary assets or copyrighted code were copied from external repositories.
