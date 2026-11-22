import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CoffeeHeroScene } from '../scenes/CoffeeHero/CoffeeHeroScene';
import { CafeInteriorScene } from '../scenes/CafeInterior/CafeInteriorScene';
import { StorefrontScene } from '../scenes/Storefront/StorefrontScene';
import { BrewingExperience } from '../components/brewing/BrewingExperience';
import { TerroirCompass } from '../components/home/TerroirCompass';
import { ProductDetailModal } from '../components/menu/ProductDetailModal';
import { ReservationForm } from '../components/reservations/ReservationForm';
import { PRODUCTS } from '../data/products';
import { GALLERY_ITEMS } from '../data/gallery';
import { TESTIMONIALS } from '../data/testimonials';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import { useCartStore } from '../stores/useCartStore';
import {
  Sparkles,
  ArrowRight,
  Coffee,
  Compass,
  Star,
  Plus,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Flame,
  Award,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const signatureProducts = PRODUCTS.slice(0, 8);
  const dessertProducts = PRODUCTS.filter((p) => p.category === 'desserts' || p.category === 'bakery');
  const galleryPreview = GALLERY_ITEMS.slice(0, 6);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, product.sizes[0], 1);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden">
      {/* ================= 01. CINEMATIC HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-aura-coffee/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-aura-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left pt-6 lg:pt-0">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aura-card border border-aura-gold/40 shadow-gold-glow mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-aura-gold" />
              <span className="text-xs uppercase font-bold tracking-widest text-aura-gold">
                Artisanal 3D Roastery Experience
              </span>
            </div>

            {/* Editorial Headlines */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-aura-cream leading-[1.08] mb-4">
              Where Every Sip <br />
              <span className="gold-gradient-text italic font-normal">
                Becomes an Experience.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-aura-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Discover the art of exceptional coffee in a space crafted for extraordinary moments. From rare Ethiopian microlots extracted under 9 bars to hand-laminated Viennoiserie, welcome to AURA ROAST.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/experience"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <Compass className="w-4 h-4 text-aura-bg group-hover:rotate-45 transition-transform" />
                <span>Explore 3D Sanctuary</span>
                <ArrowRight className="w-4 h-4 text-aura-bg group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-card border border-aura-border hover:border-aura-gold text-aura-cream hover:text-aura-gold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Coffee className="w-4 h-4 text-aura-gold" />
                <span>Discover Our Roasts</span>
              </Link>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-aura-border/60 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="font-serif text-2xl font-bold text-aura-cream">9.2 Bar</div>
                <div className="text-[11px] text-aura-muted">Hydraulic Extraction</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-aura-cream">88.5+</div>
                <div className="text-[11px] text-aura-muted">SCA Specialty Score</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-aura-cream">24 Hr</div>
                <div className="text-[11px] text-aura-muted">Slow Kyoto Steeping</div>
              </div>
            </div>
          </div>

          {/* Right 3D Coffee Cup Column (6 cols) */}
          <div className="lg:col-span-6 relative min-h-[460px] lg:min-h-[580px] flex items-center justify-center">
            {/* 3D Canvas Scene */}
            <div className="w-full h-full min-h-[460px]">
              <CoffeeHeroScene />
            </div>

            {/* Interactive hint floating card */}
            <div className="absolute bottom-6 right-6 glass-card px-4 py-2.5 rounded-2xl border border-aura-border text-xs text-aura-muted flex items-center gap-2 pointer-events-none backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-aura-gold animate-ping" />
              <span>Interactive 3D • Drag to rotate & inspect</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-widest uppercase text-aura-gold">Scroll to Discover</span>
          <ChevronDown className="w-4 h-4 text-aura-gold animate-bounce" />
        </div>
      </section>

      {/* ================= 02. OUR STORY SECTION ================= */}
      <section className="py-24 bg-aura-surface relative border-y border-aura-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Imagery */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-aura-border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80"
                  alt="Artisanal Roasting Craft"
                  className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl border border-aura-gold/30 backdrop-blur-md">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-aura-gold mb-1">
                    Direct Origin Trade
                  </div>
                  <div className="text-sm font-serif font-bold text-aura-cream">
                    Yirgacheffe, Huila & Boquete Terroirs
                  </div>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-card border border-aura-gold/30 text-xs text-aura-gold">
                <Award className="w-3.5 h-3.5" />
                <span className="uppercase font-semibold tracking-wider">The Philosophy of AURA</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream leading-tight">
                Born from the Obsession <br />
                <span className="gold-gradient-text italic font-normal">
                  With The Perfect Extraction.
                </span>
              </h2>

              <p className="text-sm text-aura-muted leading-relaxed font-light">
                At AURA ROAST, coffee is elevated from a morning routine into an architectural and sensory ritual. We source exclusively from small-holder farms perched above 1,800 meters, where volcanic soil and cool mountain mist produce dense, intensely aromatic cherries.
              </p>

              <p className="text-sm text-aura-muted leading-relaxed font-light">
                Every batch is roasted in small 12-kilogram drums, monitored through precise thermal conductivity curves, ensuring that delicate notes of wild honeysuckle, dark cocoa, and bergamot blossom are preserved without a hint of ash.
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-card p-4 rounded-2xl border border-aura-border">
                  <Flame className="w-5 h-5 text-aura-gold mb-2" />
                  <h4 className="font-serif text-base font-bold text-aura-cream mb-1">
                    Small-Batch Roasting
                  </h4>
                  <p className="text-xs text-aura-muted">
                    Custom profiles tailored to seasonal harvest moisture and density.
                  </p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-aura-border">
                  <Layers className="w-5 h-5 text-aura-gold mb-2" />
                  <h4 className="font-serif text-base font-bold text-aura-cream mb-1">
                    Sensory Sanctuary
                  </h4>
                  <p className="text-xs text-aura-muted">
                    Designed with acoustic intimacy, Italian marble, and natural olive groves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 03. 3D STOREFRONT & SIGN ASSEMBLY SECTION ================= */}
      <section className="py-24 bg-aura-bg relative border-t border-aura-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 text-[10px] uppercase font-bold tracking-widest text-aura-gold mb-3">
              <Sparkles className="w-3 h-3 text-aura-gold" />
              <span>Flagship Storefront Cinematography</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-4">
              The Architectural Facade & <br />
              <span className="gold-gradient-text italic font-normal">3D Sign Assembly</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
              Watch the extruded 3D typography fly in with physics recoil, elastic bounce, and an illuminated light sweep across the royal blue facade. Look directly into the warm illuminated café interior through the ground-floor plate glass window.
            </p>
          </div>

          {/* Interactive 3D Storefront Canvas */}
          <div className="w-full h-[600px] sm:h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-aura-gold/30 mb-8 relative">
            <StorefrontScene showControlsOverlay={true} />
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-aura-border">
              <div className="w-9 h-9 rounded-xl bg-aura-gold/10 flex items-center justify-center text-aura-gold mb-3 font-serif font-bold text-base">
                01
              </div>
              <h4 className="font-serif text-base font-bold text-aura-cream mb-1">
                Kinetic Spring Physics
              </h4>
              <p className="text-xs text-aura-muted leading-relaxed">
                Extruded 3D characters swoop along multi-axis rotational arcs with elastic dampening and contact flash beacons upon landing.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-aura-border">
              <div className="w-9 h-9 rounded-xl bg-aura-gold/10 flex items-center justify-center text-aura-gold mb-3 font-serif font-bold text-base">
                02
              </div>
              <h4 className="font-serif text-base font-bold text-aura-cream mb-1">
                Warm Interior Look-In
              </h4>
              <p className="text-xs text-aura-muted leading-relaxed">
                Volumetric plate glass reveals glowing globe pendants, illuminated menu chalkboard, chrome espresso machinery, and golden pastries.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-aura-border">
              <div className="w-9 h-9 rounded-xl bg-aura-gold/10 flex items-center justify-center text-aura-gold mb-3 font-serif font-bold text-base">
                03
              </div>
              <h4 className="font-serif text-base font-bold text-aura-cream mb-1">
                Procedural Sound Synthesis
              </h4>
              <p className="text-xs text-aura-muted leading-relaxed">
                Zero external audio assets: Web Audio API synthesizes flight whooshes, tactile impact thuds, glint chimes, and 60Hz neon hum in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 04. IMMERSIVE CAFÉ TOUR SECTION ================= */}
      <section className="py-24 bg-aura-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Spatial Architecture
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-4">
              Step Inside The <span className="gold-gradient-text italic font-normal">3D Sanctuary</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
              Explore our physical flagship café through an interactive digital canvas. Click hotspots to glide between our Grand Espresso Bar, Velvet Mezzanine, and Sunlit Atrium.
            </p>
          </div>

          {/* 3D Interior Interactive Canvas */}
          <div className="w-full h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-aura-gold/30">
            <CafeInteriorScene showControlsOverlay={true} />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/experience"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-card border border-aura-gold hover:bg-aura-gold hover:text-aura-bg text-aura-cream transition-all shadow-gold-glow"
            >
              <Compass className="w-4 h-4 text-aura-gold" />
              <span>Open Fullscreen 3D Spatial Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 04. SIGNATURE COFFEE COLLECTION ================= */}
      <section className="py-24 bg-aura-surface border-t border-aura-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
                Curated Roasts
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream">
                Signature <span className="gold-gradient-text italic font-normal">Coffee Collection</span>
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs uppercase font-semibold tracking-wider text-aura-gold hover:text-aura-cream transition-colors flex items-center gap-1.5"
            >
              <span>View All 14 Creations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group glass-card rounded-3xl border border-aura-border overflow-hidden cursor-pointer transition-all duration-300 hover:border-aura-gold/50 hover:shadow-gold-glow flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden bg-aura-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent opacity-75" />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-aura-bg/80 text-aura-gold border border-aura-gold/30 backdrop-blur-md">
                        {product.badge}
                      </span>
                    )}

                    {/* 3D Inspect Cue */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-full bg-aura-gold text-aura-bg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>3D Preview</span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-aura-muted mb-1.5">
                      <span className="uppercase tracking-wider text-[10px] font-semibold text-aura-gold">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold text-aura-cream">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-aura-cream group-hover:text-aura-gold transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-aura-muted line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Price & Add to Cart button */}
                <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase text-aura-muted block">Starts from</span>
                    <span className="font-serif text-lg font-bold text-aura-gold">
                      {formatINR(product.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`p-2.5 rounded-full transition-all ${
                      addedItemNotice === product.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-aura-card border border-aura-border hover:border-aura-gold text-aura-cream hover:text-aura-gold hover:bg-aura-cardHover'
                    }`}
                    title="Quick Add to Bag"
                  >
                    {addedItemNotice === product.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 05. COFFEE BREWING EXPERIENCE ================= */}
      <section className="py-24 bg-aura-bg relative border-t border-aura-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Master Barista Science
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-3">
              Interactive <span className="gold-gradient-text italic font-normal">Brewing Rituals</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
              Step through our four core extraction methods. Observe exact water temperatures, coffee-to-water ratios, and multi-stage extraction times.
            </p>
          </div>

          <BrewingExperience />
        </div>
      </section>

      {/* ================= GLOBAL TERROIR COMPASS (Inspired by %Arabica & kape) ================= */}
      <section className="py-24 bg-aura-surface relative border-t border-aura-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Direct Origin Terroirs
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-3">
              See The World <span className="gold-gradient-text italic font-normal">Through Coffee</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
              Explore our four direct-trade farming partners. We cultivate single-origin relationships above 1,800 MASL, paying premium ethical prices directly to harvest cooperatives.
            </p>
          </div>

          <TerroirCompass />
        </div>
      </section>

      {/* ================= 07. FEATURED DESSERTS & VIENNOISERIE ================= */}
      <section className="py-24 bg-aura-surface border-t border-aura-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Artisan Patisserie
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-3">
              Curated <span className="gold-gradient-text italic font-normal">French Viennoiserie</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed">
              Baked fresh three times daily. Laminated with Normandy cultured butter to complement the natural acidity of our single-origin coffees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dessertProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="glass-card rounded-3xl border border-aura-border p-6 flex flex-col sm:flex-row gap-6 items-center cursor-pointer hover:border-aura-gold/40 hover:shadow-gold-glow transition-all"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-44 h-44 rounded-2xl object-cover shrink-0 border border-aura-border"
                />
                <div className="flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-aura-gold mb-1">
                    {item.badge || item.category}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-aura-cream mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-aura-muted leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-aura-gold">
                      {formatINR(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(item, e)}
                      className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-aura-gold text-aura-bg hover:bg-aura-goldLight shadow-sm transition-colors"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 08. OUR ATMOSPHERE & ACOUSTICS ================= */}
      <section className="py-24 bg-aura-bg border-t border-aura-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block">
                Architectural Sanctuary
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream leading-tight">
                Designed for Stillness, <br />
                <span className="gold-gradient-text italic font-normal">
                  Conversation & Wonder.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-aura-muted leading-relaxed font-light">
                Every corner of AURA ROAST is engineered for restorative presence. From sound-absorbing velvet ceiling baffles that preserve conversational privacy to warm 2700K brass pendant illumination, time slows down the moment you step through our arched thresholds.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 text-aura-cream">
                  <span className="w-2 h-2 rounded-full bg-aura-gold" />
                  <span>Acoustic timber wall ribs tuned to eliminate reverberation</span>
                </div>
                <div className="flex items-center gap-3 text-aura-cream">
                  <span className="w-2 h-2 rounded-full bg-aura-gold" />
                  <span>Indoor centenary potted olive trees bringing organic oxygen and greenery</span>
                </div>
                <div className="flex items-center gap-3 text-aura-cream">
                  <span className="w-2 h-2 rounded-full bg-aura-gold" />
                  <span>Subtle evening jazz vinyl sessions played on vintage tube amplifiers</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                alt="Café Booths"
                className="rounded-3xl object-cover h-64 w-full border border-aura-border"
              />
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                alt="Glasshouse Sun"
                className="rounded-3xl object-cover h-64 w-full mt-6 border border-aura-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 09. GALLERY PREVIEW ================= */}
      <section className="py-24 bg-aura-surface border-t border-aura-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
                Visual Chronicle
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream">
                The Atmosphere <span className="gold-gradient-text italic font-normal">Gallery</span>
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs uppercase font-semibold tracking-wider text-aura-gold hover:text-aura-cream transition-colors flex items-center gap-1.5"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPreview.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-aura-border h-64"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aura-bg via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-aura-gold">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-aura-cream">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 10. TESTIMONIALS ================= */}
      <section className="py-24 bg-aura-bg border-t border-aura-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Critical Acclaim (Demonstration Concept)
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream">
              Voices of <span className="gold-gradient-text italic font-normal">Discernment</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="glass-card p-8 rounded-3xl border border-aura-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-aura-gold mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-aura-cream/90 italic leading-relaxed mb-6 font-light">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover border border-aura-gold/30"
                  />
                  <div>
                    <h5 className="font-serif text-sm font-bold text-aura-cream">
                      {t.author}
                    </h5>
                    <p className="text-[10px] text-aura-muted">
                      {t.role} • {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 11. TABLE RESERVATION PREVIEW ================= */}
      <section id="reserve" className="py-24 bg-aura-surface border-t border-aura-border relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-aura-gold px-3 py-1 rounded-full bg-aura-gold/15 border border-aura-gold/30 inline-block mb-3">
              Bespoke Hospitality
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-aura-cream mb-3">
              Reserve Your <span className="gold-gradient-text italic font-normal">Table Ritual</span>
            </h2>
            <p className="text-xs sm:text-sm text-aura-muted leading-relaxed max-w-lg mx-auto">
              Whether joining us for an intimate cupping session or an evening meeting in the Velvet Mezzanine, secure your seating in advance.
            </p>
          </div>

          <div className="glass-card p-6 md:p-10 rounded-3xl border border-aura-gold/30 shadow-2xl">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
