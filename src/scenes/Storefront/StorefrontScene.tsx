import React, { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StorefrontModel } from '../../components/three/StorefrontModel';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import {
  RotateCcw,
  Play,
  Pause,
  Repeat,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Camera,
  DoorOpen,
  Sparkles,
} from 'lucide-react';

interface StorefrontSceneProps {
  className?: string;
  onEnterInterior?: () => void;
  showControlsOverlay?: boolean;
}

// Camera controller implementing synchronized "slow slight push-in" from the prompt
const StorefrontCameraController: React.FC<{
  isPushInActive: boolean;
  currentTime: number;
}> = ({ isPushInActive, currentTime }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (!isPushInActive) return;
    const t = Math.min(Math.max(currentTime / 10.0, 0), 1.0);
    // Smooth cinematic push-in curve from 5.2 down to 4.35
    const ease = t * (2 - t);
    const z = THREE.MathUtils.lerp(5.2, 4.35, ease);
    const y = THREE.MathUtils.lerp(-0.22, -0.18, ease);
    camera.position.set(0, y, z);
    camera.lookAt(0, -0.22, 0);
  });

  return null;
};

export const StorefrontScene: React.FC<StorefrontSceneProps> = ({
  className = '',
  onEnterInterior,
  showControlsOverlay = true,
}) => {
  const [replayTrigger, setReplayTrigger] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [isNight, setIsNight] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [brandMode, setBrandMode] = useState<'RIGO' | 'AURA'>('RIGO');
  const [isPushInActive, setIsPushInActive] = useState(true);
  const [isAssembled, setIsAssembled] = useState(false);

  const isScrubbingRef = useRef(false);

  // Time update from the 60fps frame loop
  const handleTimeUpdate = useCallback((time: number) => {
    if (!isScrubbingRef.current) {
      setCurrentTime(time);
    }
  }, []);

  const handleReplay = () => {
    setIsAssembled(false);
    setCurrentTime(0);
    setIsPlaying(true);
    setReplayTrigger((prev) => prev + 1);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  // Phase computation based on 10s master reel prompt
  const currentPhase =
    currentTime < 1.0
      ? { step: '01', title: 'Pristine Facade (Blank Sign)', color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20' }
      : currentTime < 6.8
      ? { step: '02', title: 'Kinetic 3D Letters Flying & Bouncing', color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20' }
      : currentTime < 8.0
      ? { step: '03', title: 'Logo Stacking Drop & Snapping Impact', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20' }
      : { step: '04', title: 'Glint Sweep & Full Sign Neon Radiance', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' };

  return (
    <div
      className={`relative w-full h-full min-h-[640px] overflow-hidden rounded-3xl border border-aura-border bg-[#0D131E] select-none ${className}`}
    >
      <div className="absolute inset-0">
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
            camera={{ position: [0, -0.22, 5.2], fov: 44 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
            onPointerDown={() => {
              // Disengage auto push-in when user drags canvas for orbit inspection
              if (isPushInActive) setIsPushInActive(false);
            }}
          >
            {/* Sky & Ambiance lighting */}
            <ambientLight
              intensity={isNight ? 0.4 : 0.75}
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
                currentTime={currentTime}
              />
            ) : (
              <OrbitControls
                target={[0, -0.22, 0]}
                enablePan={false}
                enableDamping
                dampingFactor={0.06}
                minDistance={3.0}
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
              currentTime={isScrubbingRef.current ? currentTime : undefined}
              isPlaying={isPlaying}
              loop={isLooping}
              isNight={isNight}
              brandMode={brandMode}
              soundEnabled={soundEnabled}
              onTimeUpdate={handleTimeUpdate}
              onAssemblyComplete={() => setIsAssembled(true)}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* ================= TOP BRAND BADGE & PHASE STATUS ================= */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs flex items-center gap-2 text-aura-cream shadow-lg">
          <span className="w-2 h-2 rounded-full bg-aura-gold animate-ping" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-aura-gold">
            10s Reel Timeline
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/70">
            {brandMode === 'RIGO' ? 'Café Rigo Facade' : 'AURA ROAST Flagship'}
          </span>
        </div>

        {/* Current Reel Phase Indicator */}
        <div className={`px-3 py-1 rounded-xl backdrop-blur-md border text-[11px] flex items-center gap-2 shadow-md ${currentPhase.badge}`}>
          <Sparkles className={`w-3.5 h-3.5 ${currentPhase.color}`} />
          <span className="font-mono text-white/50">{currentPhase.step}</span>
          <span className={`font-medium ${currentPhase.color}`}>{currentPhase.title}</span>
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

            {/* Brand Switcher: Café Rigo vs Café AURA */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setBrandMode('RIGO')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
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
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  brandMode === 'AURA'
                    ? 'bg-aura-gold text-aura-bg font-semibold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Café AURA
              </button>
            </div>
          </div>

          {/* ================= BOTTOM BAR: 10S DIRECTOR TIMELINE & ACTIONS ================= */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            {/* 10s Scrubber & Playback HUD */}
            <div className="p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
              {/* Play / Pause / Replay Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                  title={isPlaying ? 'Pause Timeline' : 'Play 10s Timeline'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-aura-gold fill-aura-gold" />}
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Replay Assembly"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center gap-1.5"
                  title="Replay Assembly from 0.0s"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline text-xs font-medium">Replay Assembly</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2 rounded-xl transition-all ${
                    isLooping ? 'bg-aura-gold/20 text-aura-gold border border-aura-gold/50' : 'bg-white/10 text-white/50'
                  }`}
                  title="Toggle 10s Auto-Loop"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Timestamp Counter */}
              <div className="font-mono text-xs text-aura-gold font-bold tracking-wider shrink-0 w-28 text-center sm:text-left">
                {currentTime.toFixed(2)}s <span className="text-white/40">/ 10.00s</span>
              </div>

              {/* Timeline Slider Track */}
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.05}
                  value={currentTime}
                  onPointerDown={() => { isScrubbingRef.current = true; }}
                  onPointerUp={() => { isScrubbingRef.current = false; }}
                  onChange={handleScrubberChange}
                  className="w-full accent-aura-gold h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  title="Scrub 10-second timeline"
                />
              </div>

              {/* Right Side Tools: Push-In & Walk Inside CTA */}
              <div className="flex items-center gap-2 shrink-0">
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
                  <span className="hidden lg:inline">{isPushInActive ? 'Push-In: On' : 'Orbit'}</span>
                </button>

                {onEnterInterior && (
                  <button
                    type="button"
                    onClick={onEnterInterior}
                    className="px-4 py-2 rounded-xl bg-aura-gold text-aura-bg font-semibold text-xs flex items-center gap-1.5 shadow-gold-glow hover:bg-aura-goldLight active:scale-95 transition-all shrink-0"
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Walk Inside</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
