import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { storefrontAudio } from '../../utils/storefrontAudio';

export interface StorefrontModelProps {
  onAssemblyComplete?: () => void;
  replayTrigger?: number;
  isNight?: boolean;
  brandMode?: 'RIGO' | 'AURA';
  soundEnabled?: boolean;
}

interface LetterConfig {
  char: string;
  isUpper: boolean;
  targetPos: [number, number, number];
  size: [number, number, number];
}

// Generate high-resolution canvas textures for crisp 3D letter typography
function createLetterTexture(char: string, isUpper: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Warm deep shadow for embossed depth
    ctx.shadowColor = 'rgba(160, 40, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Bold rounded typography matching the Instagram reference photo
    ctx.font = isUpper
      ? '900 135px "Arial Rounded MT Bold", "Fredoka", "Comfortaa", "Montserrat", system-ui, sans-serif'
      : '900 165px "Arial Rounded MT Bold", "Fredoka", "Comfortaa", "Montserrat", system-ui, sans-serif';

    // Rich dual-tone orange gradient fill
    const grad = ctx.createLinearGradient(0, 30, 0, 220);
    grad.addColorStop(0, isUpper ? '#FFF0E0' : '#FFA84D');
    grad.addColorStop(1, isUpper ? '#FFA64D' : '#E64A00');

    ctx.fillStyle = grad;
    ctx.fillText(char, 128, 134);

    // Crisp rim highlight
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.strokeText(char, 128, 134);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Texture for the ribbon subtitle: "Good Coffee. Good Vibes."
function createTaglineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 1024, 128);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 48px "Arial Rounded MT Bold", "Montserrat", system-ui, sans-serif';
    ctx.fillText('Good Coffee. Good Vibes.', 512, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Texture for the illuminated blue café menu board
function createMenuBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#14294E';
    ctx.fillRect(0, 0, 512, 512);

    // Chalk border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 480, 480);

    // Title
    ctx.fillStyle = '#EAF2F8';
    ctx.font = 'bold 36px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AURA ROAST MENU', 256, 68);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 85);
    ctx.lineTo(472, 85);
    ctx.stroke();

    // Menu rows
    const items = [
      ['ESPRESSO', '120'],
      ['AMERICANO', '150'],
      ['CAPPUCCINO', '180'],
      ['FLAT WHITE', '190'],
      ['CAFFÈ LATTE', '190'],
      ['CARAMEL MOCHA', '210'],
      ['KYOTO COLD BREW', '220'],
      ['ARTISAN MATCHA', '180'],
    ];

    ctx.font = '600 24px "Montserrat", sans-serif';
    items.forEach(([name, price], idx) => {
      const y = 135 + idx * 44;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E0EDF8';
      ctx.fillText(name, 50, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFC107';
      ctx.fillText(`₹${price}`, 460, y);

      // Dotted leader
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillText('...........................', 250, y);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const StorefrontModel: React.FC<StorefrontModelProps> = ({
  onAssemblyComplete,
  replayTrigger = 0,
  isNight = false,
  brandMode = 'RIGO',
  soundEnabled = false,
}) => {
  const animTimeRef = useRef(0);
  const glintSweepRef = useRef(-3.5);
  const isAssembledRef = useRef(false);
  const glintAudioPlayed = useRef(false);
  const neonHumStarted = useRef(false);

  const neonLightRef = useRef<THREE.PointLight>(null);
  const glintMeshRef = useRef<THREE.Mesh>(null);
  const letterGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const letterLightRefs = useRef<(THREE.PointLight | null)[]>([]);

  useEffect(() => {
    storefrontAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Letter configs
  const letterConfigs: LetterConfig[] = useMemo(() => {
    // Top row: "Café" (centered at Y = 0.95)
    const topRow: LetterConfig[] = [
      { char: 'C', isUpper: true, targetPos: [-0.65, 0.95, 0.2], size: [0.32, 0.38, 0.14] },
      { char: 'a', isUpper: true, targetPos: [-0.24, 0.95, 0.2], size: [0.3, 0.36, 0.14] },
      { char: 'f', isUpper: true, targetPos: [0.15, 0.97, 0.2], size: [0.28, 0.42, 0.14] },
      { char: 'é', isUpper: true, targetPos: [0.55, 0.97, 0.2], size: [0.3, 0.38, 0.14] },
    ];

    // Bottom row: "Rigo" or "AURA" (centered at Y = 0.36)
    const bottomRow: LetterConfig[] =
      brandMode === 'RIGO'
        ? [
            { char: 'R', isUpper: false, targetPos: [-1.22, 0.36, 0.22], size: [0.72, 0.82, 0.22] },
            { char: 'i', isUpper: false, targetPos: [-0.48, 0.36, 0.22], size: [0.36, 0.82, 0.22] },
            { char: 'g', isUpper: false, targetPos: [0.22, 0.3, 0.22], size: [0.68, 0.88, 0.22] },
            { char: 'o', isUpper: false, targetPos: [1.02, 0.36, 0.22], size: [0.68, 0.82, 0.22] },
          ]
        : [
            { char: 'A', isUpper: false, targetPos: [-1.26, 0.36, 0.22], size: [0.68, 0.82, 0.22] },
            { char: 'U', isUpper: false, targetPos: [-0.42, 0.36, 0.22], size: [0.68, 0.82, 0.22] },
            { char: 'R', isUpper: false, targetPos: [0.42, 0.36, 0.22], size: [0.68, 0.82, 0.22] },
            { char: 'A', isUpper: false, targetPos: [1.26, 0.36, 0.22], size: [0.68, 0.82, 0.22] },
          ];

    return [...topRow, ...bottomRow];
  }, [brandMode]);

  const letterTextures = useMemo(() => {
    return letterConfigs.map((cfg) => createLetterTexture(cfg.char, cfg.isUpper));
  }, [letterConfigs]);

  const taglineTexture = useMemo(() => createTaglineTexture(), []);
  const menuBoardTexture = useMemo(() => createMenuBoardTexture(), []);

  // Kinetic state per letter
  const trajectoryRef = useRef(
    letterConfigs.map((item, idx) => {
      const side = idx % 2 === 0 ? 1 : -1;
      const startX = side * (4.0 + (idx * 0.5) % 2.5);
      const startY = 1.0 + ((idx - 3.5) * 0.7);
      const startZ = 1.0 + ((idx * 0.25) % 1.0);

      return {
        targetPos: item.targetPos,
        startPos: [startX, startY, startZ] as [number, number, number],
        startRot: [
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 3,
        ] as [number, number, number],
        delay: 0.5 + idx * 0.42,
        duration: 1.15,
        landed: false,
        whooshPlayed: false,
        flashIntensity: 0,
      };
    })
  );

  // Reset sequence on replay trigger
  useEffect(() => {
    animTimeRef.current = 0;
    glintSweepRef.current = -3.5;
    isAssembledRef.current = false;
    glintAudioPlayed.current = false;
    neonHumStarted.current = false;
    storefrontAudio.stopNeonHum();

    trajectoryRef.current = letterConfigs.map((item, idx) => {
      const side = idx % 2 === 0 ? 1 : -1;
      const startX = side * (4.0 + (idx * 0.5) % 2.5);
      const startY = 1.0 + ((idx - 3.5) * 0.7);
      const startZ = 1.0 + ((idx * 0.25) % 1.0);

      return {
        targetPos: item.targetPos,
        startPos: [startX, startY, startZ] as [number, number, number],
        startRot: [
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 4,
          (Math.random() - 0.5) * Math.PI * 3,
        ] as [number, number, number],
        delay: 0.5 + idx * 0.42,
        duration: 1.15,
        landed: false,
        whooshPlayed: false,
        flashIntensity: 0,
      };
    });
  }, [replayTrigger, letterConfigs]);

  // High-performance 60fps frame loop mutating Three.js nodes directly
  useFrame((_, delta) => {
    animTimeRef.current += delta;
    const time = animTimeRef.current;

    let allLanded = true;

    trajectoryRef.current.forEach((letter, idx) => {
      const grp = letterGroupRefs.current[idx];
      const light = letterLightRefs.current[idx];
      if (!grp) return;

      if (time >= letter.delay && !letter.whooshPlayed) {
        letter.whooshPlayed = true;
        storefrontAudio.playWhoosh();
      }

      if (time > letter.delay) {
        const localTime = Math.min((time - letter.delay) / letter.duration, 1);

        // Elastic overshoot formula
        const c4 = (2 * Math.PI) / 3;
        const ease =
          localTime === 0
            ? 0
            : localTime === 1
            ? 1
            : Math.pow(2, -10 * localTime) * Math.sin((localTime * 10 - 0.75) * c4) + 1;

        grp.position.x = THREE.MathUtils.lerp(letter.startPos[0], letter.targetPos[0], ease);
        grp.position.y = THREE.MathUtils.lerp(letter.startPos[1], letter.targetPos[1], ease);
        grp.position.z = THREE.MathUtils.lerp(letter.startPos[2], letter.targetPos[2], ease);

        grp.rotation.x = THREE.MathUtils.lerp(letter.startRot[0], 0, ease);
        grp.rotation.y = THREE.MathUtils.lerp(letter.startRot[1], 0, ease);
        grp.rotation.z = THREE.MathUtils.lerp(letter.startRot[2], 0, ease);

        if (localTime >= 0.96 && !letter.landed) {
          letter.landed = true;
          letter.flashIntensity = 1.0;
          storefrontAudio.playClickThud();
        }

        if (letter.landed && letter.flashIntensity > 0) {
          letter.flashIntensity = Math.max(0, letter.flashIntensity - delta * 2.8);
        }

        if (light) {
          light.intensity = letter.flashIntensity * 4.0;
        }
      } else {
        allLanded = false;
        // Keep hidden/at start position before delay
        grp.position.set(...letter.startPos);
        grp.rotation.set(...letter.startRot);
      }
    });

    // Glint light sweep animation (starts around 4.5s)
    if (time > 4.4 && glintSweepRef.current < 3.6) {
      if (!glintAudioPlayed.current) {
        glintAudioPlayed.current = true;
        storefrontAudio.playGlint();
      }
      glintSweepRef.current += delta * 3.8;
      if (glintMeshRef.current) {
        glintMeshRef.current.position.x = glintSweepRef.current;
      }
    }

    if (allLanded && !isAssembledRef.current && time > 5.2) {
      isAssembledRef.current = true;
      onAssemblyComplete?.();
      if (!neonHumStarted.current) {
        neonHumStarted.current = true;
        storefrontAudio.startNeonHum();
      }
    }

    if (neonLightRef.current) {
      neonLightRef.current.intensity = isAssembledRef.current
        ? 2.5 + Math.sin(time * 10) * 0.25
        : 0.2;
    }
  });

  const facadeBlue = isNight ? '#132A52' : '#1D3E77'; // Royal Cobalt Blue
  const orangeBase = '#FF6B00';
  const orangeBevel = '#FF8C1A';

  return (
    <group position={[0, 0, 0]} scale={[1.12, 1.12, 1.12]}>
      {/* ================= 1. UPPER STOREFRONT ARCHITECTURE ================= */}
      {/* Limestone facade upper story */}
      <mesh position={[0, 2.5, -0.1]} receiveShadow>
        <boxGeometry args={[7.4, 1.8, 0.45]} />
        <meshStandardMaterial color={isNight ? '#1A1D24' : '#2C323D'} roughness={0.85} />
      </mesh>

      {/* Paneled upper windows with warm reflection */}
      {[-2.1, 0, 2.1].map((wx, wi) => (
        <group key={wi} position={[wx, 2.5, 0.14]}>
          <mesh>
            <planeGeometry args={[1.65, 1.3]} />
            <meshPhysicalMaterial
              color="#546E7A"
              transmission={0.88}
              transparent
              roughness={0.08}
              ior={1.5}
            />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.68, 0.04, 0.04]} />
            <meshStandardMaterial color="#0E1217" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.04, 1.34, 0.04]} />
            <meshStandardMaterial color="#0E1217" />
          </mesh>
        </group>
      ))}

      {/* Architectural Cornice Molding */}
      <mesh position={[0, 1.6, 0.14]}>
        <boxGeometry args={[7.5, 0.14, 0.38]} />
        <meshStandardMaterial color={isNight ? '#101B2B' : '#182A45'} roughness={0.35} metalness={0.2} />
      </mesh>

      {/* ================= 2. THE SIGNBOARD (Vibrant Royal Cobalt Blue) ================= */}
      <group position={[0, 0.65, 0.05]}>
        {/* Main Blue Facade Panel */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[7.2, 1.8, 0.22]} />
          <meshStandardMaterial
            color={facadeBlue}
            roughness={0.42}
            metalness={0.12}
          />
        </mesh>

        {/* Outer Architectural Framing Bevel */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[7.26, 1.86, 0.04]} />
          <meshStandardMaterial color="#12284C" roughness={0.5} />
        </mesh>

        {/* Ambient Neon Backlight for Letters */}
        <pointLight
          ref={neonLightRef}
          position={[0, 0.1, 0.85]}
          color="#FF851B"
          intensity={1.2}
          distance={5.0}
        />

        {/* Glint Light Sweep Mesh */}
        <mesh
          ref={glintMeshRef}
          position={[-3.5, 0.05, 0.26]}
          rotation={[0, 0, -Math.PI / 6]}
        >
          <planeGeometry args={[0.3, 1.7]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Sub-Tagline Ribbon: "Good Coffee. Good Vibes." */}
        <group position={[0, -0.7, 0.13]}>
          {/* White Ribbon Canvas Texture */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[4.4, 0.32]} />
            <meshBasicMaterial map={taglineTexture} transparent />
          </mesh>
        </group>
      </group>

      {/* ================= 3. THE 3D FLY-IN LETTERS ================= */}
      <group position={[0, 0, 0]}>
        {letterConfigs.map((cfg, idx) => {
          const letterTex = letterTextures[idx];

          return (
            <group
              key={idx}
              ref={(el) => (letterGroupRefs.current[idx] = el)}
              position={cfg.targetPos}
            >
              {/* 3D Extruded Rounded Letter Base Block */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={cfg.size} />
                <meshStandardMaterial
                  color={cfg.isUpper ? '#FFA347' : orangeBase}
                  roughness={0.28}
                  metalness={0.12}
                  emissive="#FF5500"
                  emissiveIntensity={isNight ? 0.45 : 0.25}
                />
              </mesh>

              {/* Front Face with Crisp High-Resolution Typography Texture */}
              {letterTex && (
                <mesh position={[0, 0, cfg.size[2] / 2 + 0.008]}>
                  <planeGeometry args={[cfg.size[0] * 0.95, cfg.size[1] * 0.95]} />
                  <meshBasicMaterial
                    map={letterTex}
                    transparent
                    toneMapped={false}
                  />
                </mesh>
              )}

              {/* Embossed Rim Accent */}
              <mesh position={[0, 0, cfg.size[2] / 2 + 0.004]}>
                <planeGeometry args={[cfg.size[0] * 0.98, cfg.size[1] * 0.98]} />
                <meshStandardMaterial
                  color={orangeBevel}
                  roughness={0.2}
                />
              </mesh>

              {/* Landing flash light */}
              <pointLight
                ref={(el) => (letterLightRefs.current[idx] = el)}
                position={[0, 0, 0.4]}
                color="#FFD199"
                intensity={0}
                distance={2.2}
              />
            </group>
          );
        })}
      </group>

      {/* ================= 4. GROUND FLOOR STOREFRONT & CLEAR WINDOW ================= */}
      {/* Ground floor opening centered at Y = -1.25 */}
      <group position={[0, -1.25, 0.1]}>
        {/* Left Wall Pillar */}
        <mesh position={[-3.3, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.0, 0.38]} />
          <meshStandardMaterial color={isNight ? '#10223D' : '#16315C'} roughness={0.48} />
        </mesh>

        {/* Right Wall Pillar */}
        <mesh position={[3.3, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 2.0, 0.38]} />
          <meshStandardMaterial color={isNight ? '#10223D' : '#16315C'} roughness={0.48} />
        </mesh>

        {/* Bottom Window Sill Base */}
        <mesh position={[0, -0.92, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.0, 0.22, 0.38]} />
          <meshStandardMaterial color={isNight ? '#10223D' : '#16315C'} roughness={0.48} />
        </mesh>

        {/* Top Window Lintel */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.0, 0.16, 0.38]} />
          <meshStandardMaterial color={isNight ? '#10223D' : '#16315C'} roughness={0.48} />
        </mesh>

        {/* Clear Ground-Floor Plate Glass Window (LOOK DIRECTLY THROUGH!) */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[6.0, 1.7]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.96}
            transparent
            opacity={0.98}
            roughness={0.03}
            ior={1.5}
            thickness={0.15}
          />
        </mesh>

        {/* Central Steel Window Mullion */}
        <mesh position={[0, 0, 0.17]}>
          <boxGeometry args={[0.06, 1.72, 0.04]} />
          <meshStandardMaterial color="#0A101A" />
        </mesh>

        {/* ================= 5. INTERIOR VISIBLE THROUGH THE WINDOW ================= */}
        {/* Warm Illuminated Café Interior inside the store */}
        <group position={[0, 0, -1.25]}>
          {/* Interior Warm Cozy Fill Light */}
          <pointLight position={[0, 0.4, 0.2]} color="#FFE8B5" intensity={3.2} distance={6.0} />

          {/* Cozy Interior Back Wall */}
          <mesh position={[0, 0, -2.2]}>
            <planeGeometry args={[8.4, 2.8]} />
            <meshStandardMaterial color="#2B3A52" roughness={0.6} />
          </mesh>

          {/* Wooden Storage Shelves on Back Wall with ceramic mugs */}
          {[-0.2, 0.6].map((sy, si) => (
            <group key={si} position={[-1.2, sy, -2.15]}>
              <mesh>
                <boxGeometry args={[2.2, 0.04, 0.22]} />
                <meshStandardMaterial color="#3E2718" />
              </mesh>
              {/* Decorative ceramic coffee mugs */}
              {[-0.8, -0.4, 0.0, 0.4, 0.8].map((mx, mi) => (
                <mesh key={mi} position={[mx, 0.1, 0]}>
                  <cylinderGeometry args={[0.07, 0.06, 0.14, 16]} />
                  <meshStandardMaterial color={mi % 2 === 0 ? '#FAF0E6' : '#C49A6C'} />
                </mesh>
              ))}
            </group>
          ))}

          {/* Illuminated Blue Menu Board on Back Wall (Like the photo!) */}
          <group position={[1.4, 0.35, -2.15]}>
            <mesh>
              <planeGeometry args={[2.0, 1.4]} />
              <meshBasicMaterial map={menuBoardTexture} />
            </mesh>
            {/* Soft menu board downlight */}
            <pointLight position={[0, 0.7, 0.3]} color="#EAF2F8" intensity={0.9} distance={1.8} />
          </group>

          {/* Warm Hanging Globe Pendant Lamps inside (Golden glow like photo!) */}
          {[
            { pos: [-0.85, 0.6, -0.6] },
            { pos: [1.35, 0.48, -0.7] },
          ].map((globe, gi) => (
            <group key={gi} position={globe.pos as [number, number, number]}>
              <mesh position={[0, 0.45, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
                <meshStandardMaterial color="#0A0807" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.18, 24, 24]} />
                <meshBasicMaterial color="#FFF5DC" />
              </mesh>
              {/* Cozy Warm Interior Light */}
              <pointLight
                color="#FFE6B3"
                intensity={isNight ? 3.2 : 2.6}
                distance={5.0}
                decay={2}
                castShadow
              />
            </group>
          ))}

          {/* Barista Counter & Stainless Steel Espresso Machine */}
          <group position={[0.7, -0.38, -1.1]}>
            {/* Wooden Counter */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[3.2, 0.76, 1.1]} />
              <meshStandardMaterial color="#3E2718" roughness={0.3} />
            </mesh>
            {/* Espresso Machine */}
            <mesh position={[0, 0.58, 0]} castShadow>
              <boxGeometry args={[1.3, 0.46, 0.65]} />
              <meshStandardMaterial color="#1E1E1E" metalness={0.88} roughness={0.16} />
            </mesh>
            {/* Portafilters */}
            {[-0.3, 0.3].map((hx, hi) => (
              <mesh key={hi} position={[hx, 0.5, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 12]} />
                <meshStandardMaterial color="#0A0A0A" />
              </mesh>
            ))}
            {/* Counter downlight */}
            <pointLight position={[0, 0.9, 0.2]} color="#FFE0B2" intensity={1.4} distance={2.5} />
          </group>

          {/* Glass Refrigerated Pastry Display Case (Left side with croissants) */}
          <group position={[-1.75, -0.36, -0.8]}>
            <mesh position={[0, -0.14, 0]}>
              <boxGeometry args={[1.4, 0.45, 0.9]} />
              <meshStandardMaterial color="#1A1512" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[1.35, 0.52, 0.85]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                transmission={0.92}
                transparent
                roughness={0.05}
              />
            </mesh>
            {/* Golden Croissants inside case */}
            {[-0.36, 0.0, 0.36].map((cx, ci) => (
              <mesh
                key={ci}
                position={[cx, 0.18, 0]}
                rotation={[0, 0.25 * ci, 0]}
                scale={[0.15, 0.09, 0.11]}
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#DE8C33" roughness={0.55} />
              </mesh>
            ))}
            {/* Pastry warm LED light */}
            <pointLight position={[0, 0.38, 0]} color="#FFD180" intensity={1.5} distance={2.0} />
          </group>

          {/* Bistro Table & Chairs near the window */}
          <group position={[0, -0.45, -0.2]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.04, 24]} />
              <meshStandardMaterial color="#5E402C" roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.5, 12]} />
              <meshStandardMaterial color="#110D0B" />
            </mesh>
            {[-0.58, 0.58].map((cx, ci) => (
              <group
                key={ci}
                position={[cx, -0.12, 0]}
                rotation={[0, ci === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              >
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.3, 0.04, 0.3]} />
                  <meshStandardMaterial color="#402819" />
                </mesh>
                <mesh position={[0, 0.2, -0.13]}>
                  <boxGeometry args={[0.3, 0.34, 0.03]} />
                  <meshStandardMaterial color="#402819" />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* ================= 6. SIDEWALK & STREET ENTRANCE ================= */}
      <mesh position={[0, -2.3, 1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 4.5]} />
        <meshStandardMaterial color={isNight ? '#18181B' : '#28282C'} roughness={0.88} />
      </mesh>
      {/* Granite Curb */}
      <mesh position={[0, -2.25, 0.12]}>
        <boxGeometry args={[10.5, 0.1, 0.22]} />
        <meshStandardMaterial color={isNight ? '#2A2A2E' : '#404046'} roughness={0.8} />
      </mesh>
    </group>
  );
};
