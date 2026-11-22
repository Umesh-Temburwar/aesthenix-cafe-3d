import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingBeansProps {
  count?: number;
  radius?: number;
}

export const FloatingBeans: React.FC<FloatingBeansProps> = ({
  count = 14,
  radius = 2.4,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate initial orbits
  const beansData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = radius + (Math.random() - 0.5) * 0.9;
      const y = (Math.random() - 0.5) * 2.0;
      const speed = 0.22 + Math.random() * 0.28;
      const rotSpeed = [
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
      ] as [number, number, number];

      return { angle, dist, y, speed, rotSpeed };
    });
  }, [count, radius]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, index) => {
      const data = beansData[index];
      if (!data) return;

      const currentAngle = data.angle + t * data.speed * 0.35;
      child.position.x = Math.cos(currentAngle) * data.dist;
      child.position.z = Math.sin(currentAngle) * data.dist;
      child.position.y = data.y + Math.sin(t * 1.3 + index * 1.1) * 0.22;

      child.rotation.x += data.rotSpeed[0] * 0.012;
      child.rotation.y += data.rotSpeed[1] * 0.012;
      child.rotation.z += data.rotSpeed[2] * 0.012;
    });
  });

  return (
    <group ref={groupRef}>
      {beansData.map((_, i) => (
        <group key={i}>
          {/* Roasted Coffee Bean: Elliptic convex bean with realistic center cleft */}
          <mesh castShadow scale={[0.18, 0.095, 0.12]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshPhysicalMaterial
              color="#331D10"
              roughness={0.35}
              clearcoat={0.6}
              clearcoatRoughness={0.2}
              metalness={0.12}
            />
          </mesh>
          {/* Indented Center Crease Line */}
          <mesh scale={[0.185, 0.012, 0.022]} position={[0, 0.088, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#120703" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
