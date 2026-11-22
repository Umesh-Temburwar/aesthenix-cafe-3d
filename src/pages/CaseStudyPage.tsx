import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Cpu,
  Layers,
  Zap,
  Volume2,
  Eye,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Code2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const CaseStudyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-aura-bg text-aura-cream font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aura-gold/15 border border-aura-gold/30 text-aura-gold text-[11px] font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AesthenixTech Flagship Portfolio Case Study</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream mb-6 leading-tight">
            Engineering the World's Most{' '}
            <span className="gold-gradient-text italic font-normal">
              Immersive 3D Café
            </span>
          </h1>

          <p className="text-sm sm:text-base text-aura-muted leading-relaxed max-w-2xl mx-auto">
            A comprehensive technical breakdown of how AesthenixTech combined React Three Fiber, procedural Web Audio synthesis, and real-time PBR material shaders to redefine digital luxury hospitality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/experience?view=storefront"
              className="px-6 py-3 rounded-2xl bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:bg-aura-goldLight active:scale-95 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Launch 3D Storefront Reel</span>
            </Link>

            <Link
              to="/menu"
              className="px-6 py-3 rounded-2xl bg-aura-card border border-aura-gold/40 text-aura-cream hover:text-aura-gold hover:border-aura-gold text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
            >
              <span>Explore 3D Cup Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ================= PROJECT METRICS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { metric: '60 FPS', label: 'Silky Smooth Frame Rate', desc: 'Direct Three.js node mutation bypassing React re-renders' },
            { metric: '0 kB', label: 'Audio Asset Bandwidth', desc: '100% procedural real-time Web Audio API synthesis' },
            { metric: '10.0s', label: 'Cinematic Reel Timeline', desc: 'Synchronized kinetic letter fly-in, logo snap & glint sweep' },
            { metric: '100%', label: 'Automated Test Pass', desc: 'Comprehensive Vitest test suite covering logic & state' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-aura-border text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-aura-gold mb-1">
                {item.metric}
              </div>
              <div className="text-xs font-semibold text-aura-cream mb-1">{item.label}</div>
              <div className="text-[11px] text-aura-muted leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* ================= 4 PILLARS OF INNOVATION ================= */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-aura-gold">
              Core Innovations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-aura-cream mt-2">
              Four Technological Breakthroughs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="glass-card p-8 rounded-3xl border border-aura-border relative overflow-hidden group hover:border-aura-gold/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-aura-gold/15 flex items-center justify-center text-aura-gold mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-aura-gold tracking-widest block mb-1">
                Pillar 01 // Kinetic Physics
              </span>
              <h3 className="font-serif text-2xl font-bold text-aura-cream mb-3">
                10-Second Storefront Reel & Stacking Logo
              </h3>
              <p className="text-xs sm:text-sm text-aura-muted leading-relaxed mb-4">
                Faithfully engineered from Instagram master prompts: a royal cobalt blue architectural facade (`#1D3E77`) that begins completely blank, receives extruded 3D block letters flying along randomized vector arcs with spring recoil damping, drops a 2-part stacking coffee emblem that snaps into place, and sweeps a diagonal glint beam across glowing neon typography.
              </p>
              <ul className="text-xs text-aura-cream/80 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Physical spring damping: <code>Math.pow(2, -10t) * sin(...)</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Integrated scrubbable 10s director timeline controller</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Physical transmission glass revealing illuminated café interior</span>
                </li>
              </ul>
              <Link
                to="/experience?view=storefront"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-aura-gold hover:text-aura-goldLight"
              >
                <span>Experience Storefront Reel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="glass-card p-8 rounded-3xl border border-aura-border relative overflow-hidden group hover:border-aura-gold/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-aura-gold/15 flex items-center justify-center text-aura-gold mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-aura-gold tracking-widest block mb-1">
                Pillar 02 // Precision Telemetry
              </span>
              <h3 className="font-serif text-2xl font-bold text-aura-cream mb-3">
                Interactive 3D 9.2-Bar Barista Simulator
              </h3>
              <p className="text-xs sm:text-sm text-aura-muted leading-relaxed mb-4">
                Commercial E61 espresso machine simulation complete with 58mm walnut portafilter, dual analog hydraulic pressure/temperature needles, real-time extraction scales, dynamic microfoam canvas latte art rendering (Heart, Rosetta, Tulip), and live SCA Barista Quality scoring.
              </p>
              <ul className="text-xs text-aura-cream/80 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>55Hz rotary pump acoustic synthesis with mechanical harmonics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Real-time HTML5 canvas dynamic liquid surface texturing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Optimal "God Shot" window detection with celebratory chime</span>
                </li>
              </ul>
              <Link
                to="/experience"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-aura-gold hover:text-aura-goldLight"
              >
                <span>Launch Barista Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="glass-card p-8 rounded-3xl border border-aura-border relative overflow-hidden group hover:border-aura-gold/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-aura-gold/15 flex items-center justify-center text-aura-gold mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-aura-gold tracking-widest block mb-1">
                Pillar 03 // 3D E-Commerce
              </span>
              <h3 className="font-serif text-2xl font-bold text-aura-cream mb-3">
                Real-Time 3D Cup Atelier & Customizer
              </h3>
              <p className="text-xs sm:text-sm text-aura-muted leading-relaxed mb-4">
                Guests customize ceramic glaze finishes (Terracotta, Obsidian, Imperial Porcelain, 24K Gold, Royal Cobalt), cup volumes (Demitasse to Grand Bowl), artisanal toppings (24K edible gold flakes, cinnamon dust, caramel drizzle), and luxury saucers with real-time calculated pricing and one-click cart integration.
              </p>
              <ul className="text-xs text-aura-cream/80 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>MeshPhysicalMaterial clearcoat, roughness, and metalness PBR</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Live price recalculation with custom SKU generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Direct integration with persistent Zustand cart storage</span>
                </li>
              </ul>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-aura-gold hover:text-aura-goldLight"
              >
                <span>Open 3D Cup Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="glass-card p-8 rounded-3xl border border-aura-border relative overflow-hidden group hover:border-aura-gold/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-aura-gold/15 flex items-center justify-center text-aura-gold mb-5">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-aura-gold tracking-widest block mb-1">
                Pillar 04 // Zero-Latency Audio
              </span>
              <h3 className="font-serif text-2xl font-bold text-aura-cream mb-3">
                Procedural Lo-Fi Café Ambiance Soundscape
              </h3>
              <p className="text-xs sm:text-sm text-aura-muted leading-relaxed mb-4">
                A continuous, site-wide audio engine that generates mellow Rhodes electric piano jazz chords, warm pink-noise café murmur, vinyl needle crackle, and periodic steam wand hisses on the fly using native Web Audio API oscillators and biquad filters.
              </p>
              <ul className="text-xs text-aura-cream/80 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>3 curated vibes: Midnight Rhodes, Rainy Shibuya & Milanese Roast</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Interactive 5-band spectrum audio equalizer visualizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Zero MP3/WAV files: immune to network buffering or 404 errors</span>
                </li>
              </ul>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-aura-gold">
                <span>Active Site-Wide via Floating Acoustic Pill</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ARCHITECTURE SPECIFICATION ================= */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-aura-border mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-aura-gold tracking-widest block mb-1">
                Engineering Stack
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-aura-cream">
                Technical Architecture & Standards
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Production Grade</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-aura-gold uppercase tracking-wider mb-2 font-mono text-[11px]">
                Frontend Core
              </h4>
              <ul className="space-y-1.5 text-aura-muted">
                <li>• React 18 & TypeScript</li>
                <li>• Vite 6 Build Tooling</li>
                <li>• React Router v6 SPA</li>
                <li>• Tailwind CSS Design System</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-aura-gold uppercase tracking-wider mb-2 font-mono text-[11px]">
                3D & WebGL Engine
              </h4>
              <ul className="space-y-1.5 text-aura-muted">
                <li>• Three.js r128+</li>
                <li>• React Three Fiber (R3F)</li>
                <li>• @react-three/drei</li>
                <li>• Contact Shadows & PBR</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-aura-gold uppercase tracking-wider mb-2 font-mono text-[11px]">
                Acoustics & Motion
              </h4>
              <ul className="space-y-1.5 text-aura-muted">
                <li>• Procedural Web Audio API</li>
                <li>• Biquad Filtering & LFOs</li>
                <li>• GSAP & Framer Motion</li>
                <li>• Spring Recoil Physics</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-aura-gold uppercase tracking-wider mb-2 font-mono text-[11px]">
                State & Persistence
              </h4>
              <ul className="space-y-1.5 text-aura-muted">
                <li>• Zustand State Stores</li>
                <li>• LocalStorage Persistence</li>
                <li>• React Hook Form + Zod</li>
                <li>• Automated Vitest Test Suite</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ================= AGENCY FOOTER CALL TO ACTION ================= */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-aura-card via-[#1A1410] to-aura-card border border-aura-gold/40 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-aura-gold block mb-2">
              Agency Portfolio
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-aura-cream mb-4">
              Crafted by AesthenixTech
            </h3>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed mb-6">
              AesthenixTech designs and develops flagship interactive 3D digital experiences, web applications, and creative technology products for luxury global brands.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/reservations"
                className="px-6 py-3 rounded-2xl bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:bg-aura-goldLight transition-all"
              >
                Reserve Sanctuary Table
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Contact Agency
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
