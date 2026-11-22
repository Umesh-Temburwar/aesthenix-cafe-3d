import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type CupFinish = 'terracotta' | 'obsidian' | 'porcelain' | 'antique-gold' | 'royal-cobalt';
export type CupSize = 'demitasse' | 'tulip' | 'latte-bowl';
export type CupTopping = 'crema' | 'cinnamon' | 'gold-flakes' | 'caramel';
export type SaucerMaterial = 'matching' | 'marble' | 'walnut' | 'brass';

export interface CupCustomizerConfig {
  finish: CupFinish;
  size: CupSize;
  topping: CupTopping;
  saucer: SaucerMaterial;
  hasSpoon: boolean;
  autoRotate: boolean;
}

// Generate dynamic foam & topping texture for cup surface
function createCoffeeSurfaceTexture(topping: CupTopping): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = 256;
    const cy = 256;

    // Rich hazelnut espresso crema radial base
    const cremaGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 240);
    cremaGrad.addColorStop(0, '#C68E4E');
    cremaGrad.addColorStop(0.5, '#9C5B23');
    cremaGrad.addColorStop(0.85, '#683610');
    cremaGrad.addColorStop(1, '#3D1C06');
    ctx.fillStyle = cremaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 240, 0, Math.PI * 2);
    ctx.fill();

    // Microfoam Latte Art Heart / Rosetta
    ctx.fillStyle = '#FFF8E7';
    ctx.strokeStyle = '#F5DEB3';
    ctx.lineWidth = 4;

    // Center latte art heart
    ctx.beginPath();
    ctx.moveTo(cx, cy + 50);
    ctx.bezierCurveTo(cx - 70, cy - 20, cx - 70, cy - 80, cx, cy - 40);
    ctx.bezierCurveTo(cx + 70, cy - 80, cx + 70, cy - 20, cx, cy + 50);
    ctx.fill();

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx, cy - 60);
    ctx.lineTo(cx, cy + 90);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFF8E7';
    ctx.stroke();

    // Topping-specific procedural layers
    if (topping === 'cinnamon') {
      // Cinnamon & Nutmeg dusting specks
      for (let i = 0; i < 220; i++) {
        const rad = Math.sqrt(Math.random()) * 180;
        const angle = Math.random() * Math.PI * 2;
        const sx = cx + rad * Math.cos(angle);
        const sy = cy + rad * Math.sin(angle);
        const size = Math.random() * 3.5 + 1;

        ctx.fillStyle = i % 2 === 0 ? '#632A0F' : '#8A3B14';
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (topping === 'gold-flakes') {
      // 24K Edible Gold Leaf metallic facets
      for (let i = 0; i < 40; i++) {
        const rad = Math.sqrt(Math.random()) * 150;
        const angle = Math.random() * Math.PI * 2;
        const gx = cx + rad * Math.cos(angle);
        const gy = cy + rad * Math.sin(angle);

        ctx.fillStyle = i % 3 === 0 ? '#FFE082' : '#FFD54F';
        ctx.shadowColor = '#FFB300';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + (Math.random() * 12 - 6), gy + (Math.random() * 12 - 6));
        ctx.lineTo(gx + (Math.random() * 16 - 8), gy + (Math.random() * 16 - 8));
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (topping === 'caramel') {
      // Glossy caramel drizzle spiral
      ctx.strokeStyle = '#B35400';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 5; a += 0.15) {
        const r = 25 + a * 18;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Caramel highlight shine
      ctx.strokeStyle = '#FFA726';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const CupCustomizerModel: React.FC<{ config: CupCustomizerConfig }> = ({ config }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);

  // Surface texture
  const coffeeTexture = useMemo(
    () => createCoffeeSurfaceTexture(config.topping),
    [config.topping]
  );

  // Material finish properties
  const cupMaterialProps = useMemo(() => {
    switch (config.finish) {
      case 'terracotta':
        return { color: '#B25D34', roughness: 0.82, metalness: 0.05, clearcoat: 0 };
      case 'obsidian':
        return { color: '#141416', roughness: 0.4, metalness: 0.2, clearcoat: 0.6 };
      case 'porcelain':
        return { color: '#FCFCFD', roughness: 0.08, metalness: 0.02, clearcoat: 1.0 };
      case 'antique-gold':
        return { color: '#D4AF37', roughness: 0.22, metalness: 0.88, clearcoat: 0.3 };
      case 'royal-cobalt':
        return { color: '#1B3B73', roughness: 0.18, metalness: 0.15, clearcoat: 0.95 };
    }
  }, [config.finish]);

  // Saucer material properties
  const saucerMaterialProps = useMemo(() => {
    switch (config.saucer) {
      case 'matching':
        return cupMaterialProps;
      case 'marble':
        return { color: '#EAEAEA', roughness: 0.15, metalness: 0.05, clearcoat: 0.85 };
      case 'walnut':
        return { color: '#3E2514', roughness: 0.65, metalness: 0.0, clearcoat: 0.2 };
      case 'brass':
        return { color: '#C5A059', roughness: 0.28, metalness: 0.82, clearcoat: 0.4 };
    }
  }, [config.saucer, cupMaterialProps]);

  // Size scale & proportions
  const sizeScale = useMemo(() => {
    switch (config.size) {
      case 'demitasse':
        return [0.82, 0.78, 0.82] as [number, number, number];
      case 'tulip':
        return [1.0, 0.96, 1.0] as [number, number, number];
      case 'latte-bowl':
        return [1.22, 0.84, 1.22] as [number, number, number];
    }
  }, [config.size]);

  // Steam particle positions
  const steamParticles = useMemo(() => {
    return Array.from({ length: 16 }).map(() => ({
      initPos: [
        (Math.random() - 0.5) * 0.5,
        0.85 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.5,
      ] as [number, number, number],
      speed: 0.4 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.15,
      scale: 0.05 + Math.random() * 0.04,
    }));
  }, []);

  // Frame animation loop
  useFrame(({ clock }, delta) => {
    if (config.autoRotate && rootGroupRef.current) {
      rootGroupRef.current.rotation.y += delta * 0.4;
    }

    if (steamGroupRef.current) {
      const elapsed = clock.getElapsedTime();
      steamGroupRef.current.children.forEach((child, idx) => {
        const particle = steamParticles[idx];
        if (particle) {
          child.position.y += delta * particle.speed;
          child.position.x += Math.sin(elapsed * 2 + idx) * 0.003 + particle.drift * delta;
          if (child.position.y > 1.9) {
            child.position.y = 0.85;
            child.position.x = particle.initPos[0];
          }
        }
      });
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.35, 0]}>
      {/* ================= 1. SAUCER ================= */}
      <group position={[0, 0, 0]}>
        {/* Saucer Outer Rim */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[1.5, 1.05, 0.12, 48]} />
          <meshPhysicalMaterial {...saucerMaterialProps} />
        </mesh>
        {/* Saucer Inner Ring Indentation */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.78, 0.72, 0.04, 36]} />
          <meshPhysicalMaterial {...saucerMaterialProps} />
        </mesh>
        {/* Saucer Rim Accent Ring (Gold trim on luxury finishes) */}
        {(config.saucer === 'matching' && config.finish === 'porcelain') || config.saucer === 'marble' ? (
          <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.42, 0.015, 12, 48]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        ) : null}
      </group>

      {/* ================= 2. BRASS TEASPOON ================= */}
      {config.hasSpoon && (
        <group position={[1.15, 0.08, 0.4]} rotation={[0.08, 0.65, -0.06]}>
          {/* Spoon Handle */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.02, 1.4]} />
            <meshStandardMaterial color="#E0B858" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Spoon Bowl */}
          <mesh position={[0, -0.01, -0.75]} rotation={[-Math.PI / 8, 0, 0]} scale={[1, 0.4, 1.4]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#E0B858" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      )}

      {/* ================= 3. THE 3D CERAMIC CUP ================= */}
      <group position={[0, 0.06, 0]} scale={sizeScale}>
        {/* Cup Outer Body (Lathed tapered cylinder) */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.88, 0.62, 0.95, 48]} />
          <meshPhysicalMaterial {...cupMaterialProps} />
        </mesh>

        {/* Cup Handle (Side C-shaped loop) */}
        <mesh position={[0.84, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.22, 0.05, 16, 32, Math.PI]} />
          <meshPhysicalMaterial {...cupMaterialProps} />
        </mesh>

        {/* ================= 4. COFFEE LIQUID & ARTISANAL SURFACE ================= */}
        {/* Hot Liquid Surface Plane with procedural microfoam texture */}
        <mesh position={[0, 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.82, 48]} />
          <meshStandardMaterial
            map={coffeeTexture}
            roughness={0.4}
            metalness={0.08}
          />
        </mesh>

        {/* Liquid depth / coffee meniscus wall */}
        <mesh position={[0, 0.84, 0]}>
          <cylinderGeometry args={[0.825, 0.78, 0.1, 48]} />
          <meshStandardMaterial color="#2B1405" roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 5. PROCEDURAL STEAM PARTICLES ================= */}
      <group ref={steamGroupRef}>
        {steamParticles.map((pt, idx) => (
          <mesh key={idx} position={pt.initPos}>
            <sphereGeometry args={[pt.scale, 8, 8]} />
            <meshBasicMaterial
              color="#FFFBF5"
              transparent
              opacity={0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
