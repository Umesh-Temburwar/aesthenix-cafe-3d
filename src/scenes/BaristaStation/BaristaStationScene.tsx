import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BaristaStationModel } from '../../components/three/BaristaStationModel';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import { baristaAudio } from '../../utils/baristaAudio';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Gauge,
  Droplets,
  Award,
  ChevronRight,
  Flame,
  Coffee,
  Heart,
  Feather,
  Flower2,
  Pencil,
} from 'lucide-react';

interface BaristaStationSceneProps {
  className?: string;
  showControlsOverlay?: boolean;
}

// Camera controller that glides between the Extraction station view and the Latte Art top-down angle
const BaristaCameraController: React.FC<{
  mode: 'extraction' | 'latte-art';
}> = ({ mode }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.45, 2.6));
  const targetLook = useRef(new THREE.Vector3(0, 0.25, 0));

  useEffect(() => {
    if (mode === 'extraction') {
      targetPos.current.set(0, 0.45, 2.6);
      targetLook.current.set(0, 0.25, 0);
    } else {
      // Elevated 45-degree angle looking directly into the latte bowl
      targetPos.current.set(0, 1.45, 1.85);
      targetLook.current.set(0, 0, 0);
    }
  }, [mode]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
    camera.lookAt(targetLook.current);
  });

  return null;
};

export const BaristaStationScene: React.FC<BaristaStationSceneProps> = ({
  className = '',
  showControlsOverlay = true,
}) => {
  const [mode, setMode] = useState<'extraction' | 'latte-art'>('extraction');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionTime, setExtractionTime] = useState<number>(0);
  const [pressureBar, setPressureBar] = useState<number>(0);
  const [liquidYieldGrams, setLiquidYieldGrams] = useState<number>(0);

  // Latte art state
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [pourProgress, setPourProgress] = useState<number>(0);
  const [selectedPattern, setSelectedPattern] = useState<'heart' | 'rosetta' | 'tulip' | 'freehand'>('rosetta');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [baristaScore, setBaristaScore] = useState<number | null>(null);

  // Extraction timer loop
  useEffect(() => {
    let interval: number | null = null;
    if (isExtracting) {
      interval = window.setInterval(() => {
        setExtractionTime((t) => {
          const nextTime = Math.min(t + 0.1, 35.0);

          // Pressure ramp-up curve (0 to 9.2 Bar in 4 seconds)
          if (nextTime < 2.0) {
            setPressureBar(nextTime * 1.8); // Pre-infusion 0-3.6 Bar
          } else if (nextTime < 4.0) {
            setPressureBar(3.6 + (nextTime - 2.0) * 2.8); // Ramp to 9.2 Bar
          } else {
            // Main extraction pressure with micro-oscillation
            setPressureBar(9.2 + (Math.random() - 0.5) * 0.2);
          }

          // Liquid yield calculation (target 36g at 27s)
          if (nextTime > 3.0) {
            const flowRate = 1.45; // g/sec
            setLiquidYieldGrams((nextTime - 3.0) * flowRate);
          }

          if (nextTime >= 35.0) {
            setIsExtracting(false);
          }

          return nextTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExtracting]);

  // Handle Extraction toggle
  const toggleExtraction = () => {
    if (!isExtracting) {
      baristaAudio.playPortafilterLock();
      setIsExtracting(true);
    } else {
      setIsExtracting(false);
      setPressureBar(0);
      // Evaluate shot quality
      if (extractionTime >= 24 && extractionTime <= 30 && liquidYieldGrams >= 32 && liquidYieldGrams <= 40) {
        baristaAudio.playGodShotChime();
      }
    }
  };

  const resetExtraction = () => {
    setIsExtracting(false);
    setExtractionTime(0);
    setPressureBar(0);
    setLiquidYieldGrams(0);
  };

  // Latte art pour timer loop
  useEffect(() => {
    let pourInterval: number | null = null;
    if (isPouring) {
      pourInterval = window.setInterval(() => {
        setPourProgress((p) => {
          const nextP = p + 0.02;
          if (nextP >= 1.0) {
            setIsPouring(false);
            setBaristaScore(Math.floor(92 + Math.random() * 6)); // 92-98 score
            baristaAudio.playGodShotChime();
            return 1.0;
          }
          return nextP;
        });
      }, 50);
    }

    return () => {
      if (pourInterval) clearInterval(pourInterval);
    };
  }, [isPouring]);

  const resetPour = () => {
    setIsPouring(false);
    setPourProgress(0);
    setBaristaScore(null);
  };

  // Shot quality analysis
  const getExtractionStatus = () => {
    if (extractionTime === 0) return { label: 'Ready to Pull', color: 'text-aura-muted', badge: 'bg-white/5' };
    if (extractionTime < 22) return { label: 'Under-Extracting (Sour/Acrid)', color: 'text-amber-400', badge: 'bg-amber-500/15' };
    if (extractionTime <= 30) return { label: 'Optimal "God Shot" (Sweet / Crema Rich)', color: 'text-emerald-400', badge: 'bg-emerald-500/15' };
    return { label: 'Over-Extracting (Bitter / Channeling)', color: 'text-rose-400', badge: 'bg-rose-500/15' };
  };

  const status = getExtractionStatus();

  return (
    <div
      className={`relative w-full h-full min-h-[580px] overflow-hidden rounded-3xl border border-aura-border bg-[#0E1117] ${className}`}
    >
      <Suspense
        fallback={
          <CanvasFallback
            title="3D Commercial Barista Station"
            subtitle="Calibrating E61 grouphead & hydraulic 9.2-bar pressure dynamics..."
          />
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.45, 2.6], fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
        >
          <ambientLight intensity={0.55} color="#F3E5D8" />
          <directionalLight
            position={[3, 5, 4]}
            intensity={2.2}
            color="#FFF4E0"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-3, 2, 3]} intensity={0.8} color="#85A3C4" />

          {/* Smooth camera transition between Extraction & Latte Art */}
          <BaristaCameraController mode={mode} />

          {/* User Orbit Controls with constraints */}
          <OrbitControls
            target={mode === 'extraction' ? [0, 0.25, 0] : [0, 0, 0]}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            minDistance={1.4}
            maxDistance={4.2}
            maxPolarAngle={Math.PI / 2 + 0.05}
            minPolarAngle={Math.PI / 6}
          />

          <BaristaStationModel
            mode={mode}
            isExtracting={isExtracting}
            extractionProgress={Math.min(extractionTime / 28.0, 1.0)}
            pressureBar={pressureBar}
            isPouring={isPouring}
            pourProgress={pourProgress}
            selectedPattern={selectedPattern}
            soundEnabled={soundEnabled}
          />
        </Canvas>
      </Suspense>

      {/* ================= TOP HUD: MODE SWITCHER & AUDIO ================= */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setMode('extraction')}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              mode === 'extraction'
                ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>9.2-Bar Extraction</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('latte-art')}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              mode === 'latte-art'
                ? 'bg-aura-gold text-aura-bg font-semibold shadow-gold-glow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latte Art Pouring</span>
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3.5 py-2 rounded-xl backdrop-blur-md border transition-all flex items-center gap-1.5 text-xs font-medium ${
            soundEnabled
              ? 'bg-aura-gold/20 border-aura-gold text-aura-gold'
              : 'bg-black/60 border-white/10 text-white/60 hover:text-white'
          }`}
          title="Toggle Barista Audio Effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-aura-gold" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Acoustics On' : 'Muted'}</span>
        </button>
      </div>

      {/* ================= BOTTOM HUD: INTERACTIVE CONTROLS ================= */}
      {showControlsOverlay && (
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
          {mode === 'extraction' ? (
            /* ================= EXTRACTION STATION CONTROLS ================= */
            <div className="p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center mb-4">
                {/* Metric 1: Pressure */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-aura-muted mb-0.5">
                    Pump Pressure
                  </div>
                  <div className="font-serif text-2xl font-bold text-aura-cream flex items-baseline gap-1">
                    <span>{pressureBar.toFixed(1)}</span>
                    <span className="text-xs font-sans text-aura-gold">BAR</span>
                  </div>
                </div>

                {/* Metric 2: Shot Time */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-aura-muted mb-0.5">
                    Shot Time
                  </div>
                  <div className="font-serif text-2xl font-bold text-aura-cream flex items-baseline gap-1">
                    <span>{extractionTime.toFixed(1)}</span>
                    <span className="text-xs font-sans text-aura-gold">SEC</span>
                  </div>
                </div>

                {/* Metric 3: Liquid Yield */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-aura-muted mb-0.5">
                    Liquid Yield (1:2)
                  </div>
                  <div className="font-serif text-2xl font-bold text-aura-cream flex items-baseline gap-1">
                    <span>{liquidYieldGrams.toFixed(1)}</span>
                    <span className="text-xs font-sans text-aura-gold">G</span>
                  </div>
                </div>

                {/* Metric 4: Shot Quality Status */}
                <div className={`p-3 rounded-xl border border-white/10 ${status.badge}`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-aura-muted mb-0.5">
                    Extraction Status
                  </div>
                  <div className={`text-xs font-bold ${status.color} truncate`}>
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Pull / Stop Lever Button */}
                  <button
                    type="button"
                    onClick={toggleExtraction}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isExtracting
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                        : 'bg-aura-gold hover:bg-aura-goldLight text-aura-bg shadow-gold-glow'
                    }`}
                  >
                    {isExtracting ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Stop Pull</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Pull 9.2-Bar Shot</span>
                      </>
                    )}
                  </button>

                  {/* Reset Shot Button */}
                  <button
                    type="button"
                    onClick={resetExtraction}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
                    title="Reset Shot Glass"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Transition to Latte Art */}
                {liquidYieldGrams >= 25 && (
                  <button
                    type="button"
                    onClick={() => setMode('latte-art')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-aura-card border border-aura-gold text-aura-gold hover:bg-aura-gold hover:text-aura-bg transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow animate-bounce"
                  >
                    <span>Proceed to Pour Latte Art</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ================= LATTE ART STUDIO CONTROLS ================= */
            <div className="p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl">
              {/* Pattern Selector Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-aura-muted hidden sm:inline">
                    Pattern:
                  </span>
                  <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => { setSelectedPattern('heart'); resetPour(); }}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                        selectedPattern === 'heart' ? 'bg-aura-gold text-aura-bg font-semibold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Heart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedPattern('rosetta'); resetPour(); }}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                        selectedPattern === 'rosetta' ? 'bg-aura-gold text-aura-bg font-semibold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Rosetta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedPattern('tulip'); resetPour(); }}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                        selectedPattern === 'tulip' ? 'bg-aura-gold text-aura-bg font-semibold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Flower2 className="w-3.5 h-3.5" />
                      <span>Tulip</span>
                    </button>
                  </div>
                </div>

                {/* Barista Score Display */}
                {baristaScore && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-aura-gold/20 border border-aura-gold text-aura-gold text-xs flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="font-bold">Barista Score: {baristaScore}/100 (SCA Master Grade)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Pour Microfoam Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPouring && pourProgress < 1.0) {
                        setIsPouring(true);
                      } else if (pourProgress >= 1.0) {
                        resetPour();
                        setIsPouring(true);
                      }
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-aura-gold hover:bg-aura-goldLight text-aura-bg font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-gold-glow active:scale-95"
                  >
                    <Droplets className="w-4 h-4 text-aura-bg" />
                    <span>{pourProgress >= 1.0 ? 'Re-Pour Microfoam' : isPouring ? 'Pouring Velvet Milk...' : 'Pour Latte Art'}</span>
                  </button>

                  {/* Reset Pour Button */}
                  <button
                    type="button"
                    onClick={resetPour}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
                    title="Clear Cup"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Back to Extraction */}
                <button
                  type="button"
                  onClick={() => setMode('extraction')}
                  className="text-xs text-aura-muted hover:text-aura-gold transition-colors flex items-center gap-1.5"
                >
                  <span>← Return to Espresso Extraction Station</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
