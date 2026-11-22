# AURA ROAST — Luxury 3D Café Digital Experience
> **"Where Every Sip Becomes an Experience."**  
> A flagship interactive 3D digital café experience engineered by **AesthenixTech**.

[![CI/CD Pipeline](https://github.com/aesthenixtech/aesthenix-cafe-3d/actions/workflows/deploy.yml/badge.svg)](https://github.com/aesthenixtech/aesthenix-cafe-3d/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.17-orange.svg)](https://docs.pmnd.rs/react-three-fiber/)
[![Tests](https://img.shields.io/badge/Vitest-23%20Passed-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

---

## ☕ Project Overview

**AURA ROAST** is an ultra-premium, cinematic 3D digital café experience designed and engineered as a showcase flagship project for **AesthenixTech**. The application merges cutting-edge Three.js WebGL graphics with editorial luxury web design, allowing visitors to explore a spatial 3D café sanctuary, assemble kinetic storefront facades, extract espresso in an interactive 3D barista station, customize bespoke ceramic coffee cups in real-time, and listen to procedural lo-fi jazz ambiance.

---

## 🏛️ The Five Core Flagship Experiences

### 1. 🎬 Photoreal 10-Second Storefront Reel & Director Timeline
- **Architectural Facade**: Royal Cobalt Blue facade (`#1D3E77`) with crown mouldings, fluted pilasters, granite sidewalk slabs, and clear ground-floor plate-glass window ($0.96$ transmission).
- **Kinetic Letter Stagger**: 8 procedural 3D block letters fly in along randomized 3D trajectory vectors with an elastic landing recoil settling function and impact flash.
- **Stacking Logo Emblem**: 2-part coffee emblem drops from above, stacks, and latches with mechanical audio feedback and a $45^\circ$ diagonal glint sweep.
- **Illuminated Interior Glimpse**: Looking through the plate glass window reveals glowing pendant globes, wooden espresso counter, and chalkboard menu.
- **Director HUD**: 0–10s timeline scrubber slider, Phase HUD badges, Daylight/Blue Hour environment toggle, Brand Switcher ("Café Rigo" ↔ "Café AURA"), and Camera Push-In toggle.

### 2. ☕ Interactive 3D Barista Extraction & Latte Art Simulator
- **Commercial Espresso Rig**: Procedural E61 brass grouphead, dual analog hydraulic pressure and temperature needles, 58mm walnut portafilter, and rotary pump audio synthesis.
- **Extraction Dynamics**: Animated espresso stream transitions from dark initial drip to thick golden hazelnut crema, rising volumetrically in the demitasse cup.
- **Dynamic HTML5 Canvas Latte Art**: Real-time procedural canvas textures supporting *Heart*, *Rosetta*, and *Tulip* patterns.
- **SCA Sensory Scoring**: Real-time scoring calculation (e.g., 96.5/100) based on flow rate, pre-infusion time, pressure stability, and microfoam temperature.

### 3. 🎵 Procedural Lo-Fi Café Ambiance Soundscape (0 kB CDN Bandwidth)
- **Polyphonic Rhodes 9th Synthesizer**: Generates smooth jazz chords (`Cmaj9`, `Am9`, `Dm9`, `G13`) using additive dual-sine oscillators with frequency modulation (FM) tines and stereo ping-pong tremolo.
- **Acoustic Ambiance Layers**: Stereophonic pink noise café room murmur, Poisson vinyl crackle, and periodic steam wand hisses / ceramic cup clinks.
- **Floating Acoustic Pill**: Live 5-band spectrum audio equalizer visualizer, volume slider, and vibe presets (*Midnight Rhodes*, *Rainy Shibuya*, *Milanese Roast*).

### 4. 🏺 Real-Time 3D Cup Atelier & Customizer
- **PBR Ceramic Glaze Finishes**: Terracotta Earth, Obsidian Matte, Imperial Porcelain, Antique 24K Gold, Royal Cobalt Blue.
- **Volumetric Sizing**: Demitasse (80 ml), Tulip (220 ml), Grand Bowl (380 ml).
- **Artisanal Toppings**: Microfoam Crema, Cinnamon & Nutmeg Dust, 24K Edible Gold Leaf, Fleur de Sel Caramel Drizzle.
- **Luxury Saucers**: Matching Ceramic, Carrara Marble, Dark Walnut, Brushed Brass.
- **Direct Cart Integration**: Live price computation engine that dispatches bespoke cup orders into the global cart.

### 5. 📦 Live Barista Order Tracker & Terroir Flavor Radar
- **Live Barista Order Tracker**: 4-phase preparation tracker with live progress meter, order code `#AURA-XXXX`, station designations, and customer pickup confirmation.
- **Terroir Flavor Radar**: 5-axis SVG radar polygon (Acidity, Body, Sweetness, Aroma, Finish) plotted against the Specialty Coffee Association (SCA) 100-point cupping matrix.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework & Core** | React 18, TypeScript 5.5, Vite 5.4, React Router v6 |
| **3D & WebGL Engine** | Three.js (r174), React Three Fiber (R3F), @react-three/drei |
| **Audio Synthesis** | Native Web Audio API (100% procedural, 0 kB MP3/WAV download) |
| **Animations & UI** | GSAP, Framer Motion, Lucide React, Tailwind CSS |
| **State Management** | Zustand (with persistent localStorage middleware) |
| **Forms & Validation** | React Hook Form, Zod, @hookform/resolvers |
| **Automated Testing** | Vitest, React Testing Library, JSDOM (23 Tests Passing) |
| **Deployment** | Vercel, Netlify, GitHub Actions CI/CD |

---

## 📁 Directory Structure

```text
aesthenix-cafe-3d/
├── .github/workflows/
│   └── deploy.yml                  # Automated GitHub Actions CI/CD pipeline
├── docs/
│   ├── ARCHITECTURE.md             # In-depth architectural blueprint
│   ├── reference-analysis.md       # Technical analysis of reference repositories
│   └── screenshots/                # Visual verification captures
├── public/
│   ├── manifest.json               # PWA Web App Manifest
│   ├── robots.txt                  # Search engine crawl directives
│   └── sitemap.xml                 # XML sitemap index
├── src/
│   ├── components/
│   │   ├── audio/                  # Ambient Lo-Fi Soundscape Player & Visualizer
│   │   ├── brewing/                # Interactive brewing method simulator
│   │   ├── cart/                   # Cart drawer & Live Barista Order Tracker
│   │   ├── common/                 # Loading screen, Back-to-Top, fallbacks
│   │   ├── layout/                 # Luxury Navbar & Footer
│   │   ├── menu/                   # Product detail modal & Terroir Flavor Radar
│   │   ├── reservations/           # Zod-validated reservation booking form
│   │   └── three/                  # StorefrontModel, BaristaStationModel, CupCustomizerModel, CafeInteriorModel
│   ├── data/                       # Typed products, brewing steps, zones, gallery, testimonials
│   ├── pages/                      # Home, Menu, 3D Experience, Case Study, Gallery, Reservations, Contact, 404
│   ├── scenes/                     # StorefrontScene, BaristaStationScene, CupCustomizerScene, CafeInteriorScene
│   ├── services/                   # Reservation API service abstraction & mock persistence
│   ├── stores/                     # useCartStore, useAmbientAudioStore (Zustand)
│   ├── test/                       # Vitest integration & features test suites
│   ├── types/                      # TypeScript domain models
│   ├── utils/                      # ambientAudio, baristaAudio, storefrontAudio, formatINR
│   ├── App.tsx                     # Route orchestration & global providers
│   └── main.tsx                    # React DOM entry point
├── netlify.toml                    # Netlify production redirect headers
├── vercel.json                     # Vercel SPA routing rewrite rules
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/aesthenixtech/aesthenix-cafe-3d.git

# Enter project directory
cd aesthenix-cafe-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Automated Tests
```bash
npm test
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🏆 Agency Showcase & Portfolio Verification

To explore the interactive agency case study presentation, navigate to:
```
http://localhost:4173/case-study
```
Or click **"Agency Case Study"** directly in the top navigation bar or footer.

---

*Designed and engineered by **AesthenixTech**.*
