import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { baristaAudio } from '../../utils/baristaAudio';

export interface BaristaStationModelProps {
  mode: 'extraction' | 'latte-art';
  isExtracting: boolean;
  extractionProgress: number; // 0 to 1
  pressureBar: number; // 0 to 10
  isPouring: boolean;
  pourProgress: number; // 0 to 1
  selectedPattern: 'heart' | 'rosetta' | 'tulip' | 'freehand';
  soundEnabled: boolean;
  onExtractionFinished?: () => void;
  onPourFinished?: () => void;
  freehandPoint?: { x: number; y: number } | null;
}

export const BaristaStationModel: React.FC<BaristaStationModelProps> = ({
  mode,
  isExtracting,
  extractionProgress,
  pressureBar,
  isPouring,
  pourProgress,
  selectedPattern,
  soundEnabled,
  onExtractionFinished,
  onPourFinished,
  freehandPoint,
}) => {
  // Sync sound settings
  useEffect(() => {
    baristaAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Audio lifecycle hooks
  useEffect(() => {
    if (isExtracting) {
      baristaAudio.startPump();
      baristaAudio.startStream();
    } else {
      baristaAudio.stopPump();
      baristaAudio.stopStream();
    }
  }, [isExtracting]);

  useEffect(() => {
    if (isPouring) {
      baristaAudio.startSteam();
    } else {
      baristaAudio.stopSteam();
    }
  }, [isPouring]);

  // Canvas texture for the dynamic latte art surface
  const latteCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const latteContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const latteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base espresso crema (rich golden-brown gradient with radial crema rim)
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
      grad.addColorStop(0, '#5A351D'); // Deep mahogany core
      grad.addColorStop(0.55, '#8D5226'); // Golden hazelnut crema
      grad.addColorStop(0.85, '#B87A38'); // Tiger-skin crema ring
      grad.addColorStop(1.0, '#422413'); // Dark roast edge
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(256, 256, 252, 0, Math.PI * 2);
      ctx.fill();

      // Delicate crema micro-bubbles
      ctx.fillStyle = 'rgba(235, 175, 110, 0.15)';
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 210;
        const bx = 256 + Math.cos(angle) * dist;
        const by = 256 + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(bx, by, 1 + Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    latteCanvasRef.current = canvas;
    latteContextRef.current = ctx;

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Reset latte art canvas when pourProgress is 0
  useEffect(() => {
    if (pourProgress === 0 && latteContextRef.current) {
      const ctx = latteContextRef.current;
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
      grad.addColorStop(0, '#5A351D');
      grad.addColorStop(0.55, '#8D5226');
      grad.addColorStop(0.85, '#B87A38');
      grad.addColorStop(1.0, '#422413');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(256, 256, 252, 0, Math.PI * 2);
      ctx.fill();
      latteTexture.needsUpdate = true;
    }
  }, [pourProgress, latteTexture]);

  // Animate dynamic latte art patterns on the canvas
  useEffect(() => {
    const ctx = latteContextRef.current;
    if (!ctx || pourProgress === 0) return;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(240, 230, 215, 0.6)';
    ctx.shadowBlur = 8;

    const p = Math.min(pourProgress, 1);

    if (selectedPattern === 'heart') {
      // Classic Barista Heart: expanding base circle + tapered cleft pull-through
      const radius = Math.min(p * 110, 100);
      ctx.beginPath();
      ctx.arc(256, 240 - p * 30, radius, 0, Math.PI * 2);
      ctx.fill();

      // Top lobes indentation
      if (p > 0.4) {
        ctx.fillStyle = '#6E3C18';
        ctx.beginPath();
        ctx.arc(256, 240 - p * 30 - radius * 0.7, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Final center slice pull through
      if (p > 0.7) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 14 * (p - 0.7) * 3.3;
        ctx.beginPath();
        ctx.moveTo(256, 120);
        ctx.lineTo(256, 360);
        ctx.stroke();
      }
    } else if (selectedPattern === 'rosetta') {
      // 8-Tier Artisan Rosetta Leaf Stack
      const tiers = 8;
      const activeTiers = Math.floor(p * tiers);

      for (let t = 0; t <= activeTiers; t++) {
        const ty = 340 - t * 24;
        const width = 16 + (tiers - t) * 7.5;
        const sway = Math.sin(t * 1.8) * 8;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(256 + sway, ty, width, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stem pull-through
      if (p > 0.8) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(256, 360);
        ctx.lineTo(256, 120);
        ctx.stroke();
      }
    } else if (selectedPattern === 'tulip') {
      // 4-Tier Stacked Velvet Tulip
      const tiers = 4;
      const currentTier = Math.min(Math.floor(p * tiers) + 1, tiers);

      for (let t = 1; t <= currentTier; t++) {
        const ty = 330 - t * 45;
        const spread = 20 + t * 14;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(256, ty, spread, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.bezierCurveTo(256 - spread, ty - spread * 0.8, 256 + spread, ty - spread * 0.8, 256 + spread * Math.cos(0.15 * Math.PI), ty + spread * Math.sin(0.15 * Math.PI));
        ctx.fill();
      }

      // Center cut pull
      if (p > 0.85) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(256, 370);
        ctx.lineTo(256, 130);
        ctx.stroke();
      }
    } else if (selectedPattern === 'freehand' && freehandPoint) {
      // Draw user's cursor / touch point on canvas
      const cx = freehandPoint.x * 512;
      const cy = freehandPoint.y * 512;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    latteTexture.needsUpdate = true;
  }, [pourProgress, selectedPattern, freehandPoint, latteTexture]);

  // Mesh animation refs
  const needleRef = useRef<THREE.Mesh>(null);
  const streamLeftRef = useRef<THREE.Mesh>(null);
  const streamRightRef = useRef<THREE.Mesh>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const cremaLayerRef = useRef<THREE.Mesh>(null);
  const pitcherRef = useRef<THREE.Group>(null);
  const milkStreamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // 1. Gauge needle animation based on pressureBar + subtle hydraulic jitter
    if (needleRef.current) {
      const jitter = isExtracting ? Math.sin(time * 35) * 0.04 : 0;
      const targetAngle = -Math.PI / 4 + (pressureBar / 12) * (Math.PI * 1.5) + jitter;
      needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, -targetAngle, 0.12);
    }

    // 2. Dual espresso streams flowing into shot glass
    if (streamLeftRef.current && streamRightRef.current) {
      if (isExtracting && extractionProgress > 0.05) {
        streamLeftRef.current.visible = true;
        streamRightRef.current.visible = true;
        const scaleX = 1 + Math.sin(time * 40) * 0.15;
        streamLeftRef.current.scale.set(scaleX, 1, scaleX);
        streamRightRef.current.scale.set(scaleX, 1, scaleX);
      } else {
        streamLeftRef.current.visible = false;
        streamRightRef.current.visible = false;
      }
    }

    // 3. Rising liquid level in the shot glass
    if (liquidMeshRef.current && cremaLayerRef.current) {
      const liquidHeight = Math.max(0.01, extractionProgress * 0.42);
      liquidMeshRef.current.scale.y = liquidHeight;
      liquidMeshRef.current.position.y = -0.55 + liquidHeight / 2;

      // Crema layer floats on top of the liquid
      cremaLayerRef.current.position.y = -0.55 + liquidHeight;
      cremaLayerRef.current.visible = extractionProgress > 0.08;
    }

    // 4. Pitcher pouring animation & milk stream
    if (pitcherRef.current && milkStreamRef.current) {
      if (mode === 'latte-art' && isPouring) {
        pitcherRef.current.rotation.z = THREE.MathUtils.lerp(pitcherRef.current.rotation.z, -0.65, 0.1);
        pitcherRef.current.position.y = THREE.MathUtils.lerp(pitcherRef.current.position.y, 0.65, 0.1);
        pitcherRef.current.position.x = THREE.MathUtils.lerp(pitcherRef.current.position.x, 0.25, 0.1);

        milkStreamRef.current.visible = true;
        const streamFlicker = 1 + Math.sin(time * 30) * 0.12;
        milkStreamRef.current.scale.set(streamFlicker, 1, streamFlicker);
      } else {
        pitcherRef.current.rotation.z = THREE.MathUtils.lerp(pitcherRef.current.rotation.z, 0, 0.1);
        pitcherRef.current.position.y = THREE.MathUtils.lerp(pitcherRef.current.position.y, 0.85, 0.1);
        pitcherRef.current.position.x = THREE.MathUtils.lerp(pitcherRef.current.position.x, 0.95, 0.1);
        milkStreamRef.current.visible = false;
      }
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* ================= 1. EXTRACTION STATION (E61 GROUPHEAD) ================= */}
      {mode === 'extraction' && (
        <group position={[0, 0, 0]}>
          {/* Main Espresso Machine Front Faceplate (Brushed 304 Stainless Steel) */}
          <mesh position={[0, 1.1, -0.45]} receiveShadow>
            <boxGeometry args={[3.2, 2.2, 0.4]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Machine Top Warming Tray with Espresso Cups */}
          <group position={[0, 2.15, -0.45]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.1, 0.06, 0.38]} />
              <meshStandardMaterial color="#4B5563" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Ceramic Demitasse Cups on Top Tray */}
            {[-1.0, -0.5, 0.5, 1.0].map((cx, ci) => (
              <group key={ci} position={[cx, 0.14, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.14, 0.1, 0.22, 16]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>

          {/* E61 Heavy Brass Grouphead Casting */}
          <group position={[0, 0.95, -0.15]}>
            {/* Chromed Upper Bell */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.34, 0.38, 0.45, 24]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Lower Bayonet Locking Ring */}
            <mesh position={[0, -0.26, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.14, 24]} />
              <meshStandardMaterial color="#C5A059" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Dual Chrome / Brass Analog Pressure & Temperature Gauges */}
          {[-0.95, 0.95].map((gx, gi) => (
            <group key={gi} position={[gx, 1.45, -0.24]}>
              {/* Outer Bezel */}
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
                <meshStandardMaterial color="#B38F46" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Dial Face */}
              <mesh position={[0, 0, 0.045]}>
                <circleGeometry args={[0.26, 32]} />
                <meshBasicMaterial color="#FFFBEB" />
              </mesh>
              {/* Gauge Needle */}
              <mesh
                ref={gi === 0 ? needleRef : null}
                position={[0, 0, 0.05]}
                rotation={[0, 0, -Math.PI / 4]}
              >
                <boxGeometry args={[0.015, 0.22, 0.005]} />
                <meshBasicMaterial color="#DC2626" />
              </mesh>
              {/* Dial Glass Cover */}
              <mesh position={[0, 0, 0.06]}>
                <circleGeometry args={[0.27, 32]} />
                <meshPhysicalMaterial color="#FFFFFF" transmission={0.92} transparent roughness={0.05} />
              </mesh>
            </group>
          ))}

          {/* Chromed Commercial 58mm Portafilter */}
          <group position={[0, 0.65, -0.12]}>
            {/* Basket Body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.38, 0.34, 0.3, 24]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.95} roughness={0.08} />
            </mesh>
            {/* Dual Spout Extruder at Base */}
            <group position={[0, -0.18, 0]}>
              {/* Left Spout */}
              <mesh position={[-0.12, -0.06, 0]} rotation={[0, 0, 0.15]} castShadow>
                <cylinderGeometry args={[0.03, 0.02, 0.16, 12]} />
                <meshStandardMaterial color="#C5A059" metalness={0.9} />
              </mesh>
              {/* Right Spout */}
              <mesh position={[0.12, -0.06, 0]} rotation={[0, 0, -0.15]} castShadow>
                <cylinderGeometry args={[0.03, 0.02, 0.16, 12]} />
                <meshStandardMaterial color="#C5A059" metalness={0.9} />
              </mesh>
            </group>
            {/* Portafilter Ergonomic Walnut Handle */}
            <mesh position={[0.7, 0, 0.2]} rotation={[0, -0.4, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.07, 0.05, 0.9, 16]} />
              <meshStandardMaterial color="#3E2718" roughness={0.4} />
            </mesh>
          </group>

          {/* Liquid Espresso Extraction Streams (Left & Right) */}
          <mesh
            ref={streamLeftRef}
            position={[-0.12, 0.05, -0.12]}
            visible={false}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.65, 8]} />
            <meshStandardMaterial
              color={extractionProgress > 0.6 ? '#B46C2B' : '#3E1C08'}
              roughness={0.1}
              emissive="#FF8C00"
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh
            ref={streamRightRef}
            position={[0.12, 0.05, -0.12]}
            visible={false}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.65, 8]} />
            <meshStandardMaterial
              color={extractionProgress > 0.6 ? '#B46C2B' : '#3E1C08'}
              roughness={0.1}
              emissive="#FF8C00"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Clear Glass Shot Glass */}
          <group position={[0, -0.32, -0.12]}>
            {/* Glass Wall */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.22, 0.55, 24]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                transmission={0.94}
                transparent
                roughness={0.06}
                ior={1.5}
                thickness={0.1}
              />
            </mesh>
            {/* Heavy Glass Base */}
            <mesh position={[0, -0.27, 0]}>
              <cylinderGeometry args={[0.23, 0.23, 0.08, 24]} />
              <meshPhysicalMaterial color="#FFFFFF" transmission={0.9} transparent roughness={0.1} />
            </mesh>
            {/* Rising Dark Espresso Liquid Mesh */}
            <mesh
              ref={liquidMeshRef}
              position={[0, -0.55, 0]}
              scale={[1, 0.01, 1]}
            >
              <cylinderGeometry args={[0.28, 0.21, 1, 20]} />
              <meshStandardMaterial color="#2E1305" roughness={0.2} />
            </mesh>
            {/* Floating Golden Hazelnut Crema Disk */}
            <mesh
              ref={cremaLayerRef}
              position={[0, -0.55, 0]}
              visible={false}
            >
              <cylinderGeometry args={[0.28, 0.28, 0.04, 20]} />
              <meshStandardMaterial
                color="#C4823F"
                roughness={0.4}
                emissive="#FFA500"
                emissiveIntensity={0.15}
              />
            </mesh>
          </group>

          {/* Drip Tray with Laser-Cut Stainless Grate */}
          <group position={[0, -0.66, -0.1]}>
            <mesh receiveShadow>
              <boxGeometry args={[2.8, 0.12, 1.1]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Grate Lines */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((gx, gi) => (
              <mesh key={gi} position={[gx, 0.065, 0]}>
                <boxGeometry args={[0.04, 0.01, 0.9]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ================= 2. LATTE ART STUDIO (CERAMIC CUP & FOAM CANVAS) ================= */}
      {mode === 'latte-art' && (
        <group position={[0, 0, 0]}>
          {/* Ceramic Wide-Mouth Latte Cup (Warm Terracotta / Matte Ceramic) */}
          <group position={[0, -0.1, 0]}>
            {/* Cup Outer Bowl */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[1.05, 0.65, 0.85, 36]} />
              <meshStandardMaterial color="#261A14" roughness={0.35} metalness={0.08} />
            </mesh>
            {/* Cup Gold Rim Accent */}
            <mesh position={[0, 0.43, 0]}>
              <torusGeometry args={[1.05, 0.025, 16, 48]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Cup Handle */}
            <mesh position={[1.15, 0.05, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
              <torusGeometry args={[0.32, 0.07, 16, 32]} />
              <meshStandardMaterial color="#261A14" roughness={0.35} />
            </mesh>
            {/* Ceramic Saucer Plate */}
            <mesh position={[0, -0.48, 0]} receiveShadow>
              <cylinderGeometry args={[1.5, 1.1, 0.08, 36]} />
              <meshStandardMaterial color="#1E140F" roughness={0.3} />
            </mesh>
            {/* The Dynamic Crema & Milk Foam Canvas Surface */}
            <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.0, 36]} />
              <meshStandardMaterial
                map={latteTexture}
                roughness={0.25}
                metalness={0.05}
              />
            </mesh>
          </group>

          {/* Stainless Steel Barista Milk Pitcher */}
          <group ref={pitcherRef} position={[0.95, 0.85, 0]}>
            {/* Pitcher Tapered Bell Body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.34, 0.42, 0.95, 24]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.94} roughness={0.12} />
            </mesh>
            {/* Fluted Pouring Spout Tip */}
            <mesh position={[-0.32, 0.42, 0]} rotation={[0, 0, 0.4]} castShadow>
              <cylinderGeometry args={[0.08, 0.16, 0.22, 12]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.94} roughness={0.12} />
            </mesh>
            {/* Pitcher Handle */}
            <mesh position={[0.42, 0, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.26, 0.04, 16, 24]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.8} />
            </mesh>
            {/* Pitcher Internal Velvet Microfoam */}
            <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.32, 20]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
          </group>

          {/* Flowing Microfoam Stream into the Cup */}
          <mesh
            ref={milkStreamRef}
            position={[0.02, 0.48, 0]}
            rotation={[0, 0, -0.15]}
            visible={false}
          >
            <cylinderGeometry args={[0.022, 0.038, 0.55, 12]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.15}
              emissive="#FFFFFF"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      )}

      {/* Warm Ambient & Spot Lighting highlighting chrome and ceramic */}
      <spotLight
        position={[0, 3.5, 2.5]}
        intensity={2.8}
        color="#FFF6E5"
        angle={Math.PI / 4}
        penumbra={0.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[1.5, 1.2, 1.0]} color="#FFE8B5" intensity={1.4} distance={4.0} />
      <pointLight position={[-1.5, 0.8, 1.0]} color="#88C0D0" intensity={0.6} distance={4.0} />
    </group>
  );
};
