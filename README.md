# AURA ROAST — Luxury 3D Café Website
> **"Where Every Sip Becomes an Experience."**  
> A flagship interactive 3D digital café experience crafted by **AesthenixTech**.

---

## ☕ Project Overview

**AURA ROAST** is an ultra-premium, cinematic 3D digital café experience designed and engineered as a showcase portfolio piece for **AesthenixTech**. The website merges cutting-edge Three.js WebGL graphics with editorial luxury web design, allowing visitors to explore a spatial 3D café sanctuary, inspect artisanal coffees in rotatable 3D, simulate master brewing methods, and place reservations.

---

## 🏛️ The Three Connected Experiences

### 1. Spatial 3D Café Interior Sanctuary
- **Interactive Architectural Environment**: Complete procedural 3D café interior featuring monolithic quartzite counters, Italian 3-group brass espresso machine, bean hoppers, dark fluted walnut tables, velvet alcoves, amber glass microlot jars, indoor centenary olive trees, and sunlit arched glass facades.
- **Cinematic Zone Navigation**: Seamless camera fly-through transitions between:
  - *The Grand Roastery & Bar* (Espresso choreography)
  - *The Velvet Mezzanine* (Acoustic intimate seating)
  - *The Reserve Cupping Table* (Sensory microlot jars & siphon towers)
  - *The Glasshouse Atrium* (Sunlit architectural olive grove)
- **Controls & Accessibility**: Interactive glowing 3D hotspot beacons, auto-playing guided tour cycle, return-to-origin camera reset, and reduced-motion fallback.

### 2. Interactive 3D Coffee Showcase
- **Dynamic 3D Drink Viewer**: Realistic 3D ceramic mugs, glass cold brew tumblers, and martini affogato glassware.
- **Custom Coffee Materials**: Dynamic liquid colors, rich crema rings, microfoam swirls, ice cubes, and rising animated steam particle simulations.
- **Toppings Engine**: Cocoa dusting, caramel drizzle ribbons, floating whole roasted coffee beans, and mint accents.
- **Orbital Camera Clamps**: Controlled interactive rotation with clamped polar angles and zoom limits to ensure a comfortable experience.

### 3. Luxury Café Web Application
- **Artisan Menu & Search**: 14+ handcrafted offerings categorized by Hot Coffee, Cold Brews, Specialty Reserve, Matcha, Desserts, and Viennoiserie with realistic INR pricing (₹260 – ₹520).
- **Persistent Shopping Cart**: Powered by Zustand with local storage persistence, item size multipliers (Regular 8oz, Grande 12oz, Venti 16oz), 5% Café GST computation, complimentary care packaging thresholds, and a clearly labeled sandbox demo checkout.
- **Interactive Brewing Experience**: Step-by-step interactive simulator for Espresso (9-bar extraction), V60 Pour Over, French Press immersion, and 24-hr Kyoto Cold Brew with live timers and animated progress bars.
- **Table Reservation System**: Validated using React Hook Form & Zod with real-time feedback, future date enforcement, seating zone selection, and reference code generation (e.g., `AURA-1122-8492`).
- **Atmosphere Gallery**: Masonry layout with category filters and keyboard-accessible fullscreen lightbox modal.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework & Core** | React 18, TypeScript, Vite, React Router v6 |
| **3D & WebGL Engine** | Three.js, React Three Fiber (R3F), @react-three/drei |
| **Animations & UI** | GSAP, Framer Motion, Lucide React, Tailwind CSS |
| **State Management** | Zustand (with persistent localStorage middleware) |
| **Forms & Validation** | React Hook Form, Zod, @hookform/resolvers |
| **Automated Testing** | Vitest, React Testing Library, JSDOM |
| **Deployment** | Vercel (with SPA rewrite configuration) |

---

## 📁 Project Directory Structure

```text
aesthenix-cafe-3d/
├── docs/
│   └── reference-analysis.md       # Technical analysis of reference repositories
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── brewing/                # Interactive brewing method simulator
│   │   ├── cart/                   # Shopping cart slide-over drawer & demo checkout
│   │   ├── common/                 # Loading screen, Back-to-Top, fallbacks
│   │   ├── layout/                 # Luxury Navbar (with scroll progress) & Footer
│   │   ├── menu/                   # Product detail modal with 3D/photo toggle
│   │   ├── reservations/           # Zod-validated reservation booking form
│   │   └── three/                  # Procedural CupModel, Steam, FloatingBeans, CafeInterior
│   ├── data/                       # Typed products, brewing steps, zones, gallery, testimonials
│   ├── pages/                      # Home, Menu, 3D Experience, Gallery, Reservations, Contact, 404
│   ├── scenes/                     # CoffeeHeroScene, CafeInteriorScene, CoffeeShowcaseScene
│   ├── services/                   # Reservation API service abstraction & local mock persistence
│   ├── stores/                     # useCartStore (Zustand)
│   ├── styles/                     # Tailwind directives, custom scrollbars, gold utilities
│   ├── test/                       # Vitest setup & mocks
│   ├── types/                      # TypeScript domain models
│   ├── utils/                      # cn (Tailwind merge), formatINR
│   ├── App.tsx                     # Route orchestration & providers
│   ├── main.tsx                    # React DOM entry point
│   └── vite-env.d.ts               # Vite environment type declarations
├── tailwind.config.js              # Custom luxury coffee & gold palette tokens
├── tsconfig.json                   # TypeScript compiler configuration
├── vercel.json                     # Vercel SPA routing rewrite rules
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/aesthenixtech/aesthenix-cafe-3d.git

# Navigate to project directory
cd aesthenix-cafe-3d

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to experience the website.

### Running Automated Tests
```bash
npm test
```
Executes Vitest unit tests covering menu filtering, cart operations, pricing math, and reservation validation.

### Production Build & Preview
```bash
# Compile TypeScript and bundle production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Vercel Deployment Guide

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `aesthenix-cafe-3d` repository.
4. Verify project configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. The included `vercel.json` ensures client-side routes (`/menu`, `/experience`, `/gallery`, `/reservations`, `/contact`) resolve directly to `index.html` without 404 errors.

---

## ⚖️ Asset Attribution & Licensing

- **Code & 3D Shaders**: Originally authored for AesthenixTech under MIT License.
- **Atmospheric Photography**: Unsplash License (Royalty-free for commercial & personal digital projects).
- **Icons**: Lucide Icons (ISC License).
- **Typography**: Google Fonts (Playfair Display, Cormorant Garamond, Inter — Open Font License).

---

## 🏆 Agency Credit

**Digital Experience Designed & Developed by [AesthenixTech](https://github.com/aesthenixtech)**  
*Crafting immersive, high-performance digital flagship solutions.*
