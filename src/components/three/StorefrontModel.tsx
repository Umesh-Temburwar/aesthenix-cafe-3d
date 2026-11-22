import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { storefrontAudio } from '../../utils/storefrontAudio';

export interface StorefrontModelProps {
  onAssemblyComplete?: () => void;
  onTimeUpdate?: (time: number) => void;
  currentTime?: number;
  isPlaying?: boolean;
  loop?: boolean;
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
  startPos: [number, number, number];
  startRot: [number, number, number];
  delay: number;
  duration: number;
}

// Generate high-resolution canvas textures for crisp 3D letter typography matching the photo
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

// Logo Crest texture for the stacking emblem
function createLogoTexture(brandMode: 'RIGO' | 'AURA'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Golden circular border
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#FF8C1A';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(128, 128, 96, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFE0B2';
    ctx.stroke();

    // Coffee cup / bean silhouette
    ctx.fillStyle = '#FFA726';
    ctx.beginPath();
    // Cup body
    ctx.arc(128, 135, 48, 0, Math.PI);
    ctx.fill();
    // Saucer
    ctx.fillRect(80, 182, 96, 12);

    // Steam wisps
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(110, 75);
    ctx.bezierCurveTo(105, 60, 115, 50, 110, 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(128, 70);
    ctx.bezierCurveTo(135, 55, 125, 45, 130, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(146, 75);
    ctx.bezierCurveTo(140, 60, 150, 50, 146, 35);
    ctx.stroke();

    // Brand letter inside cup
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 38px "Arial Rounded MT Bold", sans-serif';
    ctx.fillText(brandMode === 'RIGO' ? 'R' : 'A', 128, 150);
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
  onTimeUpdate,
  currentTime,
  isPlaying = true,
  loop = true,
  replayTrigger = 0,
  isNight = false,
  brandMode = 'RIGO',
  soundEnabled = false,
}) => {
  const localTimeRef = useRef(0);
  const isAssembledRef = useRef(false);
  const glintAudioPlayed = useRef(false);
  const logoSnapAudioPlayed = useRef(false);
  const neonHumStarted = useRef(false);

  const neonLightRef = useRef<THREE.PointLight>(null);
  const glintMeshRef = useRef<THREE.Mesh>(null);
  const letterGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const letterLightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const logoPartARef = useRef<THREE.Group>(null);
  const logoPartBRef = useRef<THREE.Group>(null);
  const logoLightRef = useRef<THREE.PointLight>(null);
  const treeBranchRef = useRef<THREE.Group>(null);

  useEffect(() => {
    storefrontAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Letter configs with handcrafted fly-in vectors matching Instagram prompt
  const letterConfigs: LetterConfig[] = useMemo(() => {
    // Top row: "Café" (centered at Y = 0.95)
    // Bottom row: "Rigo" or "AURA" (centered at Y = 0.36)
    if (brandMode === 'RIGO') {
      return [
        { char: 'C', isUpper: true, targetPos: [-0.65, 0.95, 0.2], size: [0.32, 0.38, 0.14], startPos: [-4.8, 3.5, 3.2], startRot: [2.5, -3.2, 1.8], delay: 1.0, duration: 0.85 },
        { char: 'a', isUpper: true, targetPos: [-0.24, 0.95, 0.2], size: [0.3, 0.36, 0.14], startPos: [-3.5, -2.6, 2.5], startRot: [-2.2, 3.5, -1.2], delay: 1.65, duration: 0.85 },
        { char: 'f', isUpper: true, targetPos: [0.15, 0.97, 0.2], size: [0.28, 0.42, 0.14], startPos: [0.8, 4.5, 2.8], startRot: [3.1, -1.8, 2.5], delay: 2.3, duration: 0.85 },
        { char: 'é', isUpper: true, targetPos: [0.55, 0.97, 0.2], size: [0.3, 0.38, 0.14], startPos: [4.6, 3.2, 3.0], startRot: [-2.5, 3.0, -2.0], delay: 2.95, duration: 0.85 },
        { char: 'R', isUpper: false, targetPos: [-1.22, 0.36, 0.22], size: [0.72, 0.82, 0.22], startPos: [-5.2, 1.2, 3.6], startRot: [4.0, -3.5, 2.2], delay: 3.6, duration: 0.85 },
        { char: 'i', isUpper: false, targetPos: [-0.48, 0.36, 0.22], size: [0.36, 0.82, 0.22], startPos: [-0.6, -3.8, 3.0], startRot: [-3.2, 2.8, -3.1], delay: 4.25, duration: 0.85 },
        { char: 'g', isUpper: false, targetPos: [0.22, 0.3, 0.22], size: [0.68, 0.88, 0.22], startPos: [5.0, -1.5, 3.4], startRot: [2.8, -4.0, 1.5], delay: 4.9, duration: 0.85 },
        { char: 'o', isUpper: false, targetPos: [1.02, 0.36, 0.22], size: [0.68, 0.82, 0.22], startPos: [4.8, 4.0, 3.5], startRot: [-3.5, 3.2, -2.8], delay: 5.55, duration: 0.85 },
      ];
    } else {
      return [
        { char: 'C', isUpper: true, targetPos: [-0.65, 0.95, 0.2], size: [0.32, 0.38, 0.14], startPos: [-4.8, 3.5, 3.2], startRot: [2.5, -3.2, 1.8], delay: 1.0, duration: 0.85 },
        { char: 'a', isUpper: true, targetPos: [-0.24, 0.95, 0.2], size: [0.3, 0.36, 0.14], startPos: [-3.5, -2.6, 2.5], startRot: [-2.2, 3.5, -1.2], delay: 1.65, duration: 0.85 },
        { char: 'f', isUpper: true, targetPos: [0.15, 0.97, 0.2], size: [0.28, 0.42, 0.14], startPos: [0.8, 4.5, 2.8], startRot: [3.1, -1.8, 2.5], delay: 2.3, duration: 0.85 },
        { char: 'é', isUpper: true, targetPos: [0.55, 0.97, 0.2], size: [0.3, 0.38, 0.14], startPos: [4.6, 3.2, 3.0], startRot: [-2.5, 3.0, -2.0], delay: 2.95, duration: 0.85 },
        { char: 'A', isUpper: false, targetPos: [-1.26, 0.36, 0.22], size: [0.68, 0.82, 0.22], startPos: [-5.2, 1.2, 3.6], startRot: [4.0, -3.5, 2.2], delay: 3.6, duration: 0.85 },
        { char: 'U', isUpper: false, targetPos: [-0.42, 0.36, 0.22], size: [0.68, 0.82, 0.22], startPos: [-0.6, -3.8, 3.0], startRot: [-3.2, 2.8, -3.1], delay: 4.25, duration: 0.85 },
        { char: 'R', isUpper: false, targetPos: [0.42, 0.36, 0.22], size: [0.68, 0.82, 0.22], startPos: [5.0, -1.5, 3.4], startRot: [2.8, -4.0, 1.5], delay: 4.9, duration: 0.85 },
        { char: 'A', isUpper: false, targetPos: [1.26, 0.36, 0.22], size: [0.68, 0.82, 0.22], startPos: [4.8, 4.0, 3.5], startRot: [-3.5, 3.2, -2.8], delay: 5.55, duration: 0.85 },
      ];
    }
  }, [brandMode]);

  const letterTextures = useMemo(() => {
    return letterConfigs.map((cfg) => createLetterTexture(cfg.char, cfg.isUpper));
  }, [letterConfigs]);

  const logoTexture = useMemo(() => createLogoTexture(brandMode), [brandMode]);
  const taglineTexture = useMemo(() => createTaglineTexture(), []);
  const menuBoardTexture = useMemo(() => createMenuBoardTexture(), []);

  // Audio flags tracking
  const audioEventsFired = useRef<{ [key: string]: boolean }>({});

  const resetAnimation = () => {
    localTimeRef.current = 0;
    isAssembledRef.current = false;
    glintAudioPlayed.current = false;
    logoSnapAudioPlayed.current = false;
    neonHumStarted.current = false;
    audioEventsFired.current = {};
    storefrontAudio.stopNeonHum();
  };

  useEffect(() => {
    resetAnimation();
  }, [replayTrigger, brandMode]);

  // High-performance 60fps frame loop with exact 10s Director Timeline
  useFrame((_, delta) => {
    let t: number;

    if (currentTime !== undefined) {
      t = currentTime;
      localTimeRef.current = currentTime;
    } else {
      if (isPlaying) {
        localTimeRef.current += delta;
        if (loop && localTimeRef.current > 10.0) {
          localTimeRef.current = localTimeRef.current % 10.0;
          audioEventsFired.current = {};
          glintAudioPlayed.current = false;
          logoSnapAudioPlayed.current = false;
          neonHumStarted.current = false;
          isAssembledRef.current = false;
          storefrontAudio.stopNeonHum();
        } else if (!loop && localTimeRef.current > 10.0) {
          localTimeRef.current = 10.0;
        }
      }
      t = Math.min(localTimeRef.current, 10.0);
      onTimeUpdate?.(t);
    }

    // Foliage gentle breeze
    if (treeBranchRef.current) {
      treeBranchRef.current.rotation.z = Math.sin(t * 1.8) * 0.035;
      treeBranchRef.current.rotation.x = Math.cos(t * 1.4) * 0.025;
    }

    // ========================================================
    // 0.0s - 1.0s: Blank Signboard (Prompt: "0-1s sign is blank, no letters, no logo")
    // ========================================================
    const isBlankPhase = t < 1.0;

    // ========================================================
    // 1.0s - 6.8s: Letters Fly In One By One, Spin, Bounce, Click
    // ========================================================
    letterConfigs.forEach((cfg, idx) => {
      const grp = letterGroupRefs.current[idx];
      const light = letterLightRefs.current[idx];
      if (!grp) return;

      if (isBlankPhase || t < cfg.delay) {
        grp.visible = false;
        grp.position.set(...cfg.startPos);
        grp.rotation.set(...cfg.startRot);
        if (light) light.intensity = 0;
        return;
      }

      grp.visible = true;

      // Whoosh sound trigger
      const whooshKey = `whoosh_${idx}`;
      if (t >= cfg.delay && !audioEventsFired.current[whooshKey]) {
        audioEventsFired.current[whooshKey] = true;
        storefrontAudio.playWhoosh();
      }

      const progress = Math.min((t - cfg.delay) / cfg.duration, 1.0);

      // Elastic overshoot formula for physical spring recoil
      const c4 = (2 * Math.PI) / 3;
      const ease =
        progress === 0
          ? 0
          : progress === 1
          ? 1
          : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;

      grp.position.x = THREE.MathUtils.lerp(cfg.startPos[0], cfg.targetPos[0], ease);
      grp.position.y = THREE.MathUtils.lerp(cfg.startPos[1], cfg.targetPos[1], ease);
      grp.position.z = THREE.MathUtils.lerp(cfg.startPos[2], cfg.targetPos[2], ease);

      grp.rotation.x = THREE.MathUtils.lerp(cfg.startRot[0], 0, ease);
      grp.rotation.y = THREE.MathUtils.lerp(cfg.startRot[1], 0, ease);
      grp.rotation.z = THREE.MathUtils.lerp(cfg.startRot[2], 0, ease);

      // Impact click & flash
      const clickKey = `click_${idx}`;
      if (progress >= 0.96 && !audioEventsFired.current[clickKey]) {
        audioEventsFired.current[clickKey] = true;
        storefrontAudio.playClickThud();
        storefrontAudio.playPop();
      }

      // Flash calculation
      if (progress >= 0.96 && t <= cfg.delay + cfg.duration + 0.35) {
        const flashAge = t - (cfg.delay + cfg.duration * 0.96);
        const flashIntensity = Math.max(0, 1.0 - flashAge * 3.5);
        if (light) light.intensity = flashIntensity * 3.8;
      } else if (light) {
        light.intensity = 0;
      }
    });

    // ========================================================
    // 6.8s - 8.0s: Logo Icon Stacking Drop & Snap Together
    // Prompt: "then the logo icon drops in, its parts stacking and snapping together with a small bounce and a glint of light sweeping across"
    // ========================================================
    const logoTargetPos: [number, number, number] = [-1.35, 0.96, 0.22]; // Nestled beside "Café"

    // Part A: Logo Saucer/Base Crest
    const partADelay = 6.6;
    const partADuration = 0.7;
    if (logoPartARef.current) {
      if (t < partADelay) {
        logoPartARef.current.visible = false;
        logoPartARef.current.position.set(logoTargetPos[0], 3.8, 1.5);
      } else {
        logoPartARef.current.visible = true;
        const pA = Math.min((t - partADelay) / partADuration, 1.0);
        const c4 = (2 * Math.PI) / 3;
        const easeA =
          pA === 0
            ? 0
            : pA === 1
            ? 1
            : Math.pow(2, -10 * pA) * Math.sin((pA * 10 - 0.75) * c4) + 1;

        logoPartARef.current.position.y = THREE.MathUtils.lerp(3.8, logoTargetPos[1], easeA);
        logoPartARef.current.position.x = logoTargetPos[0];
        logoPartARef.current.position.z = THREE.MathUtils.lerp(1.5, logoTargetPos[2], easeA);
        logoPartARef.current.rotation.z = THREE.MathUtils.lerp(Math.PI * 2, 0, easeA);
      }
    }

    // Part B: Logo Golden Cup / Insignia (stacks directly on top of Part A)
    const partBDelay = 7.1;
    const partBDuration = 0.65;
    if (logoPartBRef.current) {
      if (t < partBDelay) {
        logoPartBRef.current.visible = false;
        logoPartBRef.current.position.set(logoTargetPos[0], 4.5, 2.0);
      } else {
        logoPartBRef.current.visible = true;
        const pB = Math.min((t - partBDelay) / partBDuration, 1.0);
        const c4 = (2 * Math.PI) / 3;
        const easeB =
          pB === 0
            ? 0
            : pB === 1
            ? 1
            : Math.pow(2, -10 * pB) * Math.sin((pB * 10 - 0.75) * c4) + 1;

        logoPartBRef.current.position.y = THREE.MathUtils.lerp(4.5, logoTargetPos[1], easeB);
        logoPartBRef.current.position.x = logoTargetPos[0];
        logoPartBRef.current.position.z = THREE.MathUtils.lerp(2.0, logoTargetPos[2] + 0.015, easeB);
        logoPartBRef.current.rotation.z = THREE.MathUtils.lerp(-Math.PI * 2, 0, easeB);

        // Logo snap sound & impact flash
        if (pB >= 0.95 && !logoSnapAudioPlayed.current) {
          logoSnapAudioPlayed.current = true;
          storefrontAudio.playLogoSnap();
          if (logoLightRef.current) logoLightRef.current.intensity = 5.0;
        }

        if (logoSnapAudioPlayed.current && logoLightRef.current) {
          const snapAge = t - (partBDelay + partBDuration);
          logoLightRef.current.intensity = Math.max(0, 5.0 - snapAge * 10);
        }
      }
    }

    // ========================================================
    // 7.8s - 8.6s: Diagonal Glint Light Sweep
    // Prompt: "and a glint of light sweeping across"
    // ========================================================
    if (glintMeshRef.current) {
      if (t >= 7.8 && t <= 8.8) {
        glintMeshRef.current.visible = true;
        if (!glintAudioPlayed.current) {
          glintAudioPlayed.current = true;
          storefrontAudio.playGlint();
        }
        const glintProgress = (t - 7.8) / 1.0;
        glintMeshRef.current.position.x = THREE.MathUtils.lerp(-3.8, 3.8, glintProgress);
      } else {
        glintMeshRef.current.visible = false;
      }
    }

    // ========================================================
    // 8.5s - 10.0s: Whole Sign Glows & Electrical Neon Hum
    // Prompt: "8-10s: the whole sign glows, final frame matches the photo exactly"
    // ========================================================
    if (t >= 8.5) {
      if (!neonHumStarted.current) {
        neonHumStarted.current = true;
        storefrontAudio.startNeonHum();
      }
      if (!isAssembledRef.current) {
        isAssembledRef.current = true;
        onAssemblyComplete?.();
      }

      if (neonLightRef.current) {
        // Subtle electrical neon flicker/hum
        const glowPulse = 2.6 + Math.sin(t * 12) * 0.25 + Math.cos(t * 22) * 0.1;
        neonLightRef.current.intensity = glowPulse;
      }
    } else {
      if (neonLightRef.current) {
        neonLightRef.current.intensity = isBlankPhase ? 0.05 : 0.4;
      }
    }
  });

  const facadeBlue = isNight ? '#132A52' : '#1D3E77'; // Royal Cobalt Blue matching photo
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

      {/* Flanking urban building facades for seamless widescreen framing */}
      <mesh position={[-5.7, 0.2, -0.2]} receiveShadow>
        <boxGeometry args={[4.2, 5.2, 0.45]} />
        <meshStandardMaterial color={isNight ? '#14171E' : '#222730'} roughness={0.9} />
      </mesh>
      <mesh position={[5.7, 0.2, -0.2]} receiveShadow>
        <boxGeometry args={[4.2, 5.2, 0.45]} />
        <meshStandardMaterial color={isNight ? '#14171E' : '#222730'} roughness={0.9} />
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

      {/* ================= 2. THE SIGNBOARD (Royal Cobalt Blue #1D3E77) ================= */}
      <group position={[0, 0.65, 0.05]}>
        {/* Main Blue Facade Panel */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[7.2, 1.8, 0.22]} />
          <meshStandardMaterial
            color={facadeBlue}
            roughness={0.38}
            metalness={0.12}
          />
        </mesh>

        {/* Outer Architectural Framing Bevel */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[7.26, 1.86, 0.04]} />
          <meshStandardMaterial color="#12284C" roughness={0.5} />
        </mesh>

        {/* Ambient Neon Backlight for Letters & Signboard */}
        <pointLight
          ref={neonLightRef}
          position={[0, 0.1, 0.85]}
          color="#FF851B"
          intensity={0.4}
          distance={5.5}
        />

        {/* Glint Light Sweep Mesh */}
        <mesh
          ref={glintMeshRef}
          position={[-3.8, 0.05, 0.26]}
          rotation={[0, 0, -Math.PI / 4]}
          visible={false}
        >
          <planeGeometry args={[0.35, 2.2]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Sub-Tagline Ribbon: "Good Coffee. Good Vibes." */}
        <group position={[0, -0.7, 0.13]}>
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
              visible={false}
            >
              {/* 3D Extruded Rounded Letter Base Block */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={cfg.size} />
                <meshStandardMaterial
                  color={cfg.isUpper ? '#FFA347' : orangeBase}
                  roughness={0.25}
                  metalness={0.15}
                  emissive="#FF5500"
                  emissiveIntensity={isNight ? 0.45 : 0.28}
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

      {/* ================= 4. THE 2-PART STACKING LOGO ICON ================= */}
      {/* Part A: Emblem Base Saucer/Ring */}
      <group ref={logoPartARef} position={[-1.35, 0.96, 0.22]} visible={false}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
          <meshStandardMaterial
            color="#FF9933"
            metalness={0.6}
            roughness={0.25}
            emissive="#FF6600"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Part B: Emblem Golden Insignia Face Plate */}
      <group ref={logoPartBRef} position={[-1.35, 0.96, 0.24]} visible={false}>
        <mesh castShadow position={[0, 0, 0.02]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
        </mesh>
        <pointLight
          ref={logoLightRef}
          position={[0, 0, 0.5]}
          color="#FFF5CC"
          intensity={0}
          distance={3.0}
        />
      </group>

      {/* ================= 5. GROUND FLOOR STOREFRONT & CLEAR WINDOW ================= */}
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

        {/* ================= 6. INTERIOR VISIBLE THROUGH THE WINDOW ================= */}
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
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[3.2, 0.76, 1.1]} />
              <meshStandardMaterial color="#3E2718" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.58, 0]} castShadow>
              <boxGeometry args={[1.3, 0.46, 0.65]} />
              <meshStandardMaterial color="#1E1E1E" metalness={0.88} roughness={0.16} />
            </mesh>
            {[-0.3, 0.3].map((hx, hi) => (
              <mesh key={hi} position={[hx, 0.5, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 12]} />
                <meshStandardMaterial color="#0A0A0A" />
              </mesh>
            ))}
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

      {/* ================= 7. UPPER-RIGHT CINEMATIC TREE FOLIAGE (MATCHING PHOTO!) ================= */}
      <group ref={treeBranchRef} position={[2.7, 2.2, 0.9]} rotation={[0.1, -0.2, -0.15]}>
        {/* Main branch stem */}
        <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <cylinderGeometry args={[0.04, 0.07, 1.2, 8]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.9} />
        </mesh>
        {/* Branch fork */}
        <mesh position={[0.1, 0.1, 0.1]} rotation={[0.3, 0.2, -Math.PI / 4]}>
          <cylinderGeometry args={[0.025, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.9} />
        </mesh>
        {/* Lush green leaves hanging into the top right frame */}
        {[
          { pos: [-0.3, 0.2, 0.1], rot: [0.2, 0.3, 0.1], scale: 0.16 },
          { pos: [-0.15, 0.05, 0.15], rot: [-0.1, 0.5, -0.2], scale: 0.2 },
          { pos: [0.05, -0.1, 0.2], rot: [0.3, -0.2, 0.4], scale: 0.18 },
          { pos: [-0.45, -0.05, 0.05], rot: [-0.2, 0.1, 0.3], scale: 0.17 },
          { pos: [-0.2, -0.25, 0.18], rot: [0.1, 0.4, -0.1], scale: 0.21 },
          { pos: [0.25, 0.1, 0.08], rot: [0.4, -0.3, 0.2], scale: 0.19 },
          { pos: [-0.05, -0.38, 0.12], rot: [0.2, 0.2, 0.5], scale: 0.22 },
        ].map((leaf, li) => (
          <mesh
            key={li}
            position={leaf.pos as [number, number, number]}
            rotation={leaf.rot as [number, number, number]}
            scale={[leaf.scale * 1.4, leaf.scale * 0.8, leaf.scale * 0.2]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={li % 2 === 0 ? '#2E5A1E' : '#3E7324'}
              roughness={0.65}
            />
          </mesh>
        ))}
      </group>

      {/* ================= 8. SIDEWALK & STREET ENTRANCE ================= */}
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
