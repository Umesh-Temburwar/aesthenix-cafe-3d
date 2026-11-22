import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StorefrontModel } from '../../components/three/StorefrontModel';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import {
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Camera,
  DoorOpen,
} from 'lucide-react';

interface StorefrontSceneProps {
  className?: string;
  onEnterInterior?: () => void;
  showControlsOverlay?: boolean;
}

// Camera controller implementing the "slow slight push-in" from the prompt
const StorefrontCameraController: React.FC<{
  isPushInActive: boolean;
  replayTrigger: number;
}> = ({ isPushInActive, replayTrigger }) => {
  const { camera } = useThree();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    camera.position.set(0, -0.15, 4.8);
    camera.lookAt(0, -0.15, 0);
  }, [replayTrigger, camera]);

  useFrame(({ clock }) => {
    if (!isPushInActive) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime();
    }
    const elapsed = clock.getElapsedTime() - startTimeRef.current;
    const t = Math.min(elapsed / 10.0, 1.0); // 10s duration
    // Gentle cinematic smooth push-in
    const ease = t * (2 - t);
    const z = THREE.MathUtils.lerp(4.8, 3.9, ease);
    const y = THREE.MathUtils.lerp(-0.15, -0.18, ease);
    camera.position.set(0, y, z);
    camera.lookAt(0, -0.18, 0);
  });

  return null;
};

export const StorefrontScene: React.FC<StorefrontSceneProps> = ({
  className = '',
  onEnterInterior,
  showControlsOverlay = true,
}) => {
  const [replayTrigger, setReplayTrigger] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [brandMode, setBrandMode] = useState<'RIGO' | 'AURA'>('RIGO');
  const [isPushInActive, setIsPushInActive] = useState(true);
  const [isAssembled, setIsAssembled] = useState(false);

  const handleReplay = () => {
    setIsAssembled(false);
    setIsPushInActive(true);
    setReplayTrigger((prev) => prev + 1);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[560px] overflow-hidden rounded-3xl border border-aura-border bg-[#0D131E] ${className}`}
    >
      <Suspense
        fallback={
          <CanvasFallback
            title="3D Café Storefront Exterior"
            subtitle="Simulating architectural physics & volumetric lighting..."
          />
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, -0.15, 4.8], fov: 46 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
          onPointerDown={() => {
            // If user interacts, switch off auto push-in so user has free orbit control
            if (isPushInActive) setIsPushInActive(false);
          }}
        >
          {/* Sky & Ambiance lighting */}
          <ambientLight
            intensity={isNight ? 0.35 : 0.65}
            color={isNight ? '#22385C' : '#E8F1F8'}
          />

          {/* Sunlight / Street Skylight */}
          <directionalLight
            position={[5, 8, 6]}
            intensity={isNight ? 0.5 : 2.2}
            color={isNight ? '#6E90BA' : '#FFF6E8'}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0002}
          />

          {/* Front street fill light */}
          <directionalLight
            position={[-4, 3, 7]}
            intensity={isNight ? 0.4 : 0.8}
            color={isNight ? '#47688F' : '#FFEAD0'}
          />

          {/* Cinematic push-in camera controller */}
          {isPushInActive ? (
            <StorefrontCameraController
              isPushInActive={isPushInActive}
              replayTrigger={replayTrigger}
            />
          ) : (
            <OrbitControls
              target={[0, -0.18, 0]}
              enablePan={false}
              enableDamping
              dampingFactor={0.06}
              minDistance={3.2}
              maxDistance={8.5}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 2 - 0.25}
              maxAzimuthAngle={Math.PI / 6}
              minAzimuthAngle={-Math.PI / 6}
            />
          )}

          {/* The Storefront & Assembling 3D Letters */}
          <StorefrontModel
            replayTrigger={replayTrigger}
            isNight={isNight}
            brandMode={brandMode}
            soundEnabled={soundEnabled}
            onAssemblyComplete={() => setIsAssembled(true)}
          />
        </Canvas>
      </Suspense>

      {/* ================= TOP BRAND BADGE ================= */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs flex items-center gap-2 text-aura-cream shadow-lg">
          <span className="w-2 h-2 rounded-full bg-aura-gold animate-ping" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-aura-gold">
            Photoreal 3D Storefront
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/70">
            {brandMode === 'RIGO' ? 'Café Rigo Reel' : 'AURA ROAST Flagship'}
          </span>
        </div>
      </div>

      {/* ================= CONTROLS & EXPERIENCE OVERLAY ================= */}
      {showControlsOverlay && (
        <>
          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all flex items-center gap-1.5 text-xs font-medium ${
                soundEnabled
                  ? 'bg-aura-gold/20 border-aura-gold text-aura-gold'
                  : 'bg-black/50 border-white/10 text-white/70 hover:border-white/30'
              }`}
              title="Toggle Audio Effects (Whooshes, Pops, Clicks, Neon Hum)"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'FX On' : 'FX Off'}</span>
            </button>

            {/* Day / Night Toggle */}
            <button
              type="button"
              onClick={() => setIsNight(!isNight)}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:border-white/30 transition-all flex items-center gap-1.5 text-xs font-medium"
              title="Toggle Day / Night Lighting"
            >
              {isNight ? <Moon className="w-4 h-4 text-blue-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
              <span className="hidden sm:inline">{isNight ? 'Blue Hour' : 'Daylight'}</span>
            </button>

            {/* Replay 3D Assembly */}
            <button
              type="button"
              onClick={handleReplay}
              className="px-3.5 py-2.5 rounded-xl bg-aura-gold text-aura-bg font-semibold text-xs flex items-center gap-1.5 shadow-gold-glow hover:bg-aura-goldLight active:scale-95 transition-all"
              title="Replay 3D Sign Assembly Animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Assembly</span>
            </button>
          </div>

          {/* Bottom Bar: Mode Switcher & Walk Inside CTA */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
            {/* Left Options (Brand Mode + Cinematic Push-in) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Brand Switcher: Café Rigo vs Café AURA */}
              <div className="flex items-center p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setBrandMode('RIGO')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    brandMode === 'RIGO'
                      ? 'bg-aura-gold text-aura-bg font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Café Rigo
                </button>
                <button
                  type="button"
                  onClick={() => setBrandMode('AURA')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    brandMode === 'AURA'
                      ? 'bg-aura-gold text-aura-bg font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Café AURA
                </button>
              </div>

              {/* Push-in toggle */}
              <button
                type="button"
                onClick={() => setIsPushInActive(!isPushInActive)}
                className={`p-2 rounded-xl backdrop-blur-md border text-xs flex items-center gap-1.5 transition-all ${
                  isPushInActive
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-black/50 border-white/10 text-white/50'
                }`}
                title="Toggle Slow Cinematic Push-in"
              >
                <Camera className="w-3.5 h-3.5 text-aura-gold" />
                <span className="hidden md:inline">{isPushInActive ? 'Push-In: On' : 'Push-In: Off'}</span>
              </button>
            </div>

            {/* Right Side: Walk Inside Sanctuary Button */}
            {onEnterInterior && (
              <button
                type="button"
                onClick={onEnterInterior}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-aura-card/90 backdrop-blur-md border border-aura-gold text-aura-gold hover:bg-aura-gold hover:text-aura-bg transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-lg group active:scale-95"
              >
                <DoorOpen className="w-4 h-4 text-aura-gold group-hover:text-aura-bg transition-colors" />
                <span>Walk Inside Sanctuary</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
