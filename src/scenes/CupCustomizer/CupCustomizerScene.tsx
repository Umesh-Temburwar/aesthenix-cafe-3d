import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import {
  CupCustomizerModel,
  CupCustomizerConfig,
  CupFinish,
  CupSize,
  CupTopping,
  SaucerMaterial,
} from '../../components/three/CupCustomizerModel';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import { useCartStore } from '../../stores/useCartStore';
import { Product, ProductSize } from '../../types';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Flame,
  Layers,
  Award,
} from 'lucide-react';

interface CupCustomizerSceneProps {
  className?: string;
  onAddedToCart?: () => void;
}

export const CupCustomizerScene: React.FC<CupCustomizerSceneProps> = ({
  className = '',
  onAddedToCart,
}) => {
  const { addItem } = useCartStore();

  const [config, setConfig] = useState<CupCustomizerConfig>({
    finish: 'royal-cobalt',
    size: 'tulip',
    topping: 'crema',
    saucer: 'matching',
    hasSpoon: true,
    autoRotate: true,
  });

  const [addedToast, setAddedToast] = useState(false);

  // Price Calculation Engine
  const priceCalculation = useMemo(() => {
    let base = 190; // Base Flat White price

    // Size multiplier
    if (config.size === 'demitasse') base = 140;
    else if (config.size === 'latte-bowl') base = 230;

    // Topping extra
    let toppingAdd = 0;
    if (config.topping === 'cinnamon') toppingAdd = 20;
    else if (config.topping === 'gold-flakes') toppingAdd = 70;
    else if (config.topping === 'caramel') toppingAdd = 30;

    // Saucer extra
    let saucerAdd = 0;
    if (config.saucer === 'marble') saucerAdd = 40;
    else if (config.saucer === 'brass') saucerAdd = 50;
    else if (config.saucer === 'walnut') saucerAdd = 25;

    // Luxury material extra
    let finishAdd = 0;
    if (config.finish === 'antique-gold') finishAdd = 60;
    else if (config.finish === 'porcelain') finishAdd = 20;

    const total = base + toppingAdd + saucerAdd + finishAdd;
    return { base, toppingAdd, saucerAdd, finishAdd, total };
  }, [config]);

  // Finish definitions
  const finishes: { id: CupFinish; name: string; color: string; desc: string }[] = [
    { id: 'royal-cobalt', name: 'Royal Cobalt', color: '#1B3B73', desc: 'Storefront Blue Glaze' },
    { id: 'antique-gold', name: 'Antique 24K Gold', color: '#D4AF37', desc: 'Brushed Luxury Metal' },
    { id: 'porcelain', name: 'Imperial Porcelain', color: '#F8F9FA', desc: 'Pure High-Gloss White' },
    { id: 'obsidian', name: 'Matte Obsidian', color: '#1E1E22', desc: 'Satin Stealth Black' },
    { id: 'terracotta', name: 'Terracotta Earth', color: '#B25D34', desc: 'Warm Organic Clay' },
  ];

  // Size definitions
  const sizes: { id: CupSize; label: string; volume: string }[] = [
    { id: 'demitasse', label: 'Demitasse', volume: '90ml Espresso' },
    { id: 'tulip', label: 'Artisan Tulip', volume: '180ml Flat White' },
    { id: 'latte-bowl', label: 'Grand Bowl', volume: '350ml Café Latte' },
  ];

  // Topping definitions
  const toppings: { id: CupTopping; name: string; extra: string }[] = [
    { id: 'crema', name: 'Velvet Crema', extra: 'Included' },
    { id: 'cinnamon', name: 'Cinnamon & Nutmeg', extra: '+₹20' },
    { id: 'gold-flakes', name: '24K Edible Gold', extra: '+₹70' },
    { id: 'caramel', name: 'Caramel Spiral', extra: '+₹30' },
  ];

  // Saucer definitions
  const saucers: { id: SaucerMaterial; name: string; extra: string }[] = [
    { id: 'matching', name: 'Matching Ceramic', extra: 'Included' },
    { id: 'marble', name: 'Carrara Marble', extra: '+₹40' },
    { id: 'walnut', name: 'Dark Walnut Wood', extra: '+₹25' },
    { id: 'brass', name: 'Polished Brass', extra: '+₹50' },
  ];

  const handleAddToCart = () => {
    const finishObj = finishes.find((f) => f.id === config.finish);
    const sizeObj = sizes.find((s) => s.id === config.size);
    const toppingObj = toppings.find((t) => t.id === config.topping);

    const bespokeName = `Bespoke ${finishObj?.name || ''} ${sizeObj?.label || 'Cup'}`;
    const bespokeTagline = `${toppingObj?.name} on ${config.saucer} Saucer`;

    const customProduct: Product = {
      id: `bespoke-${config.finish}-${config.size}-${config.topping}-${config.saucer}`,
      name: bespokeName,
      tagline: bespokeTagline,
      category: 'specialty',
      price: priceCalculation.total,
      description: `Artisanal bespoke coffee hand-poured into a custom 3D ${finishObj?.name} cup with ${toppingObj?.name} and a ${config.saucer} saucer.`,
      longDescription: `Individually crafted by master baristas at AURA ROAST. Custom ceramic glaze: ${finishObj?.name}. Surface topping: ${toppingObj?.name}. Saucer: ${config.saucer}. Hand-ground and extracted at 9.2-bars.`,
      rating: 5.0,
      reviewCount: 38,
      calories: 140,
      prepTime: '4-5 min',
      origin: 'Bespoke Atelier Roastery',
      ingredients: ['Specialty Arabica Blend', 'Microfoamed Whole Milk', toppingObj?.name || 'Crema'],
      image: '/images/products/espresso.png',
      sizes: [
        {
          name: sizeObj?.label || 'Standard',
          label: sizeObj?.label || 'Standard',
          volume: sizeObj?.volume || '180ml',
          priceMultiplier: 1.0,
        },
      ],
      model3D: {
        cupColor: finishObj?.color || '#1B3B73',
        saucerColor: '#C5A059',
        liquidColor: '#3D1C06',
        cremaColor: '#C68E4E',
        hasIce: false,
      },
    };

    const targetSize: ProductSize = {
      name: sizeObj?.label || 'Standard',
      label: sizeObj?.label || 'Standard',
      volume: sizeObj?.volume || '180ml',
      priceMultiplier: 1.0,
    };

    addItem(customProduct, targetSize, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
    onAddedToCart?.();
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-aura-border bg-[#100D0B] shadow-2xl flex flex-col lg:flex-row ${className}`}>
      {/* ================= 1. 3D STUDIO CANVAS (LEFT/TOP) ================= */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[500px] lg:min-h-[640px] bg-gradient-to-b from-[#18120E] via-[#0F0B09] to-[#0A0706]">
        {/* Top Studio Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs flex items-center gap-2 text-aura-cream shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-aura-gold animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-aura-gold">
              3D Bespoke Studio
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/70">Real-Time PBR Materials</span>
          </div>
        </div>

        {/* Orbit Hint & Auto-Rotate Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfig((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
            className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs flex items-center gap-1.5 transition-all ${
              config.autoRotate
                ? 'bg-aura-gold/20 border-aura-gold text-aura-gold'
                : 'bg-black/50 border-white/10 text-white/60'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${config.autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">{config.autoRotate ? 'Auto-Spin: On' : 'Auto-Spin: Off'}</span>
          </button>
        </div>

        <Suspense fallback={<CanvasFallback title="3D Cup Atelier" subtitle="Rendering PBR ceramic glaze & reflections..." />}>
          <Canvas
            shadows
            camera={{ position: [1.2, 1.5, 3.0], fov: 40 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
          >
            {/* Studio Key Light */}
            <directionalLight
              position={[4, 6, 4]}
              intensity={2.4}
              color="#FFF8EE"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0001}
            />

            {/* Soft Fill Light */}
            <directionalLight
              position={[-4, 3, 2]}
              intensity={0.9}
              color="#B0C8E8"
            />

            {/* Backlight / Rim Light */}
            <directionalLight
              position={[0, 4, -4]}
              intensity={1.8}
              color="#FFD29D"
            />

            {/* Soft Warm Ambient */}
            <ambientLight intensity={0.5} color="#FFEEDE" />

            {/* The 3D Cup Model */}
            <CupCustomizerModel config={config} />

            {/* Contact Floor Shadow */}
            <ContactShadows
              position={[0, -0.4, 0]}
              opacity={0.65}
              scale={6}
              blur={1.8}
              far={3}
            />

            {/* Orbit Controls */}
            <OrbitControls
              enablePan={false}
              minDistance={2.0}
              maxDistance={5.5}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2 + 0.05}
              dampingFactor={0.06}
            />
          </Canvas>
        </Suspense>

        {/* Bottom Interactive Drag Helper */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
            Drag to Rotate 360° • Scroll to Zoom
          </span>
          <span className="text-[11px] font-mono font-bold text-aura-gold">
            ₹{priceCalculation.total}
          </span>
        </div>
      </div>

      {/* ================= 2. CUSTOMIZER CONTROLS DRAWER (RIGHT) ================= */}
      <div className="w-full lg:w-[420px] p-6 lg:p-7 bg-[#140F0D] border-t lg:border-t-0 lg:border-l border-aura-border flex flex-col justify-between overflow-y-auto max-h-[640px]">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-aura-gold font-mono uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Artisanal Specification</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-aura-cream">
              Design Your Signature Cup
            </h3>
            <p className="text-xs text-aura-muted mt-1 leading-relaxed">
              Customize ceramic glaze, cup volume, artisanal foam toppings, and luxury saucers in real-time 3D.
            </p>
          </div>

          {/* 1. Ceramic Glaze Finish */}
          <div>
            <label className="text-[11px] uppercase font-mono tracking-wider text-aura-cream font-semibold flex items-center justify-between mb-2">
              <span>1. Ceramic Glaze</span>
              <span className="text-aura-gold text-[10px]">
                {finishes.find((f) => f.id === config.finish)?.name}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {finishes.map((f) => {
                const isSelected = config.finish === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, finish: f.id }))}
                    className={`relative p-1.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'border-aura-gold bg-aura-gold/15 shadow-gold-glow scale-105'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                    title={`${f.name} - ${f.desc}`}
                  >
                    <span
                      className="w-7 h-7 rounded-full shadow-inner border border-white/20 block"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="text-[9px] font-medium text-white/80 leading-tight text-center truncate w-full">
                      {f.name.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-aura-gold text-aura-bg flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Cup Volume & Silhouette */}
          <div>
            <label className="text-[11px] uppercase font-mono tracking-wider text-aura-cream font-semibold block mb-2">
              2. Cup Volume & Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => {
                const isSelected = config.size === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, size: s.id }))}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-aura-gold bg-aura-gold/15 text-aura-gold shadow-sm'
                        : 'border-white/10 hover:border-white/30 bg-white/5 text-white/70'
                    }`}
                  >
                    <span className="text-xs font-bold block">{s.label}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">{s.volume}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Surface Topping */}
          <div>
            <label className="text-[11px] uppercase font-mono tracking-wider text-aura-cream font-semibold block mb-2">
              3. Artisanal Surface Topping
            </label>
            <div className="grid grid-cols-2 gap-2">
              {toppings.map((t) => {
                const isSelected = config.topping === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, topping: t.id }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-aura-gold bg-aura-gold/15 text-aura-gold'
                        : 'border-white/10 hover:border-white/30 bg-white/5 text-white/70'
                    }`}
                  >
                    <span className="text-xs font-medium">{t.name}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-aura-gold' : 'text-white/40'}`}>
                      {t.extra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Saucer & Accents */}
          <div>
            <label className="text-[11px] uppercase font-mono tracking-wider text-aura-cream font-semibold block mb-2">
              4. Saucer Material & Accessories
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {saucers.map((sc) => {
                const isSelected = config.saucer === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, saucer: sc.id }))}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'border-aura-gold bg-aura-gold/15 text-aura-gold'
                        : 'border-white/10 hover:border-white/30 bg-white/5 text-white/70'
                    }`}
                  >
                    <span className="text-xs font-medium">{sc.name}</span>
                    <span className="text-[10px] font-mono text-white/40">{sc.extra}</span>
                  </button>
                );
              })}
            </div>

            {/* Spoon toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-white/80 font-medium">Polished Brass Teaspoon</span>
              <button
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, hasSpoon: !prev.hasSpoon }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  config.hasSpoon ? 'bg-aura-gold' : 'bg-white/20'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-aura-bg absolute top-1 transition-transform ${
                    config.hasSpoon ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Total & Add to Cart */}
        <div className="pt-5 border-t border-white/10 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-aura-muted block">
                Total Price (Inc. Taxes)
              </span>
              <div className="font-serif text-2xl font-bold text-aura-gold">
                ₹{priceCalculation.total}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-aura-gold/10 text-aura-gold border border-aura-gold/20">
                <Award className="w-3 h-3" />
                <span>Single-Origin Roast</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-aura-gold to-aura-goldLight text-aura-bg font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
          >
            <ShoppingBag className="w-4 h-4 fill-aura-bg" />
            <span>Add Bespoke Cup to Order</span>
          </button>

          {addedToast && (
            <div className="mt-2 text-center text-xs text-emerald-400 font-semibold animate-pulse">
              ✓ Custom 3D cup added to your cart!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
