import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CafeInteriorModel } from '../../components/three/CafeInteriorModel';
import { CameraController } from '../../components/three/CameraController';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import { CAFE_ZONES } from '../../data/cafeZones';
import { Compass, RotateCcw, Play, Pause, ChevronRight } from 'lucide-react';

interface CafeInteriorSceneProps {
  className?: string;
  showControlsOverlay?: boolean;
}

export const CafeInteriorScene: React.FC<CafeInteriorSceneProps> = ({
  className = '',
  showControlsOverlay = true,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>('espresso-bar');
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const tourIntervalRef = useRef<number | null>(null);

  const activeZone = CAFE_ZONES.find((z) => z.id === activeZoneId) || CAFE_ZONES[0];

  // Auto-tour cycle through zones
  useEffect(() => {
    if (isTourActive) {
      tourIntervalRef.current = window.setInterval(() => {
        setActiveZoneId((curr) => {
          const currentIndex = CAFE_ZONES.findIndex((z) => z.id === curr);
          const nextIndex = (currentIndex + 1) % CAFE_ZONES.length;
          return CAFE_ZONES[nextIndex].id;
        });
      }, 6000);
    } else {
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    }

    return () => {
      if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    };
  }, [isTourActive]);

  const handleResetCamera = () => {
    setIsTourActive(false);
    setActiveZoneId('espresso-bar');
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl border border-aura-border bg-aura-bg ${className}`}>
      <Suspense fallback={<CanvasFallback title="AURA ROAST Sanctuary" subtitle="Loading 3D Café Interior..." />}>
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 6.5], fov: 50 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, Math.min(window.devicePixelRatio, 1.75)]}
        >
          {/* Atmosphere Lighting */}
          <ambientLight intensity={0.4} color="#FFE8D6" />

          {/* Sunlight streaming through arched back windows */}
          <directionalLight
            position={[0, 7, -10]}
            intensity={2.2}
            color="#FFF4E0"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0002}
          />

          {/* Front Warm Ambient Fill */}
          <directionalLight
            position={[0, 4, 10]}
            intensity={0.8}
            color="#C9A46A"
          />

          <CameraController
            activeZoneId={activeZoneId}
            enableParallax={!reducedMotion}
          />

          <CafeInteriorModel
            activeZoneId={activeZoneId}
            onSelectZone={(id) => {
              setIsTourActive(false);
              setActiveZoneId(id);
            }}
          />
        </Canvas>
      </Suspense>

      {/* ================= CONTROLS & ZONE OVERLAY ================= */}
      {showControlsOverlay && (
        <>
          {/* Top Info Pill */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
            <div className="glass-card px-4 py-2.5 rounded-full pointer-events-auto border border-aura-gold/30 shadow-luxury flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-aura-gold animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-aura-gold">
                Interactive 3D Sanctuary
              </span>
              <span className="text-xs text-aura-muted hidden sm:inline">|</span>
              <span className="text-xs text-aura-cream font-medium hidden sm:inline">
                {activeZone.title}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsTourActive(!isTourActive)}
                className="glass-card px-3.5 py-2 rounded-full border border-aura-border text-xs text-aura-cream hover:text-aura-gold hover:border-aura-gold transition-colors flex items-center gap-1.5 shadow-sm"
                title={isTourActive ? 'Pause Guided Tour' : 'Start Guided Tour'}
              >
                {isTourActive ? <Pause className="w-3.5 h-3.5 text-aura-gold" /> : <Play className="w-3.5 h-3.5 text-aura-gold" />}
                <span className="hidden md:inline">{isTourActive ? 'Pause Tour' : 'Guided Tour'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetCamera}
                className="glass-card p-2 rounded-full border border-aura-border text-xs text-aura-cream hover:text-aura-gold hover:border-aura-gold transition-colors shadow-sm"
                title="Reset Camera View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Zone Switcher Strip */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Active Zone Detail Card */}
            <div className="glass-card p-4 rounded-2xl border border-aura-gold/25 max-w-sm pointer-events-auto shadow-luxury backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-aura-gold mb-1">
                {activeZone.subtitle}
              </div>
              <h4 className="text-lg font-serif font-bold text-aura-cream mb-1">
                {activeZone.title}
              </h4>
              <p className="text-xs text-aura-muted leading-relaxed mb-3">
                {activeZone.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeZone.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-aura-coffee/40 text-aura-cream border border-aura-border"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Zone Selector Buttons */}
            <div className="glass-card p-1.5 rounded-2xl border border-aura-border pointer-events-auto flex flex-wrap gap-1 shadow-luxury bg-aura-bg/90 backdrop-blur-md max-w-full overflow-x-auto">
              {CAFE_ZONES.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setIsTourActive(false);
                      setActiveZoneId(zone.id);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                        : 'text-aura-cream/80 hover:text-aura-cream hover:bg-white/5'
                    }`}
                  >
                    <Compass className={`w-3.5 h-3.5 ${isSelected ? 'text-aura-bg' : 'text-aura-gold'}`} />
                    {zone.shortTag}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
