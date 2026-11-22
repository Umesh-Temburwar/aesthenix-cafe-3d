import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SteamParticlesProps {
  position?: [number, number, number];
  count?: number;
  active?: boolean;
}

export const SteamParticles: React.FC<SteamParticlesProps> = ({
  position = [0, 0.5, 0],
  count = 28,
  active = true,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, opacities, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Small circular cluster above cup center
      const r = Math.random() * 0.32;
      const theta = Math.random() * Math.PI * 2;

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.random() * 1.6; // Y height
      pos[i * 3 + 2] = Math.sin(theta) * r;

      op[i] = Math.random() * 0.45;
      sp[i] = 0.28 + Math.random() * 0.38;
    }

    return [pos, op, sp];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1; // Y coordinate
      array[idx] += speeds[i] * delta;

      // Drift in gentle thermal wave
      const t = array[idx];
      array[i * 3] += Math.sin(t * 3.5 + i) * 0.0025;

      // Reset when reaching thermal dispersion apex
      if (array[idx] > 2.2) {
        array[idx] = 0.08;
        const r = Math.random() * 0.25;
        const theta = Math.random() * Math.PI * 2;
        array[i * 3] = Math.cos(theta) * r;
        array[i * 3 + 2] = Math.sin(theta) * r;
      }
    }

    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#FAF0E6"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
