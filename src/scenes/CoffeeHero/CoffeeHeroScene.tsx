import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CupModel } from '../../components/three/CupModel';
import { FloatingBeans } from '../../components/three/FloatingBeans';
import { SteamParticles } from '../../components/three/SteamParticles';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import { PRODUCTS } from '../../data/products';

interface HeroSceneContentProps {
  reducedMotion?: boolean;
}

const HeroSceneContent: React.FC<HeroSceneContentProps> = ({ reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const heroProduct = PRODUCTS[0]; // Signature Espresso

  useFrame((state) => {
    if (!reducedMotion && groupRef.current) {
      const { x, y } = state.pointer;
      // Smoothly tilt cup based on pointer position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        x * 0.45,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -y * 0.25 + 0.15,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <Float
        speed={reducedMotion ? 0 : 2}
        rotationIntensity={reducedMotion ? 0 : 0.4}
        floatIntensity={reducedMotion ? 0 : 0.5}
      >
        <CupModel
          config={heroProduct.model3D}
          scale={1.4}
          interactive={!reducedMotion}
        />
        <SteamParticles position={[0, 0.7, 0]} count={28} active={!reducedMotion} />
      </Float>

      <FloatingBeans count={12} radius={2.2} />

      {/* Soft Contact Shadow below cup */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.65}
        scale={6}
        blur={2.4}
        far={3}
      />
    </group>
  );
};

interface CoffeeHeroSceneProps {
  className?: string;
  reducedMotion?: boolean;
}

export const CoffeeHeroScene: React.FC<CoffeeHeroSceneProps> = ({
  className = '',
  reducedMotion = false,
}) => {
  return (
    <div className={`relative w-full h-full min-h-[420px] ${className}`}>
      <Suspense fallback={<CanvasFallback title="AURA ROAST Cup" />}>
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 4.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Ambient Warm Café Lighting */}
          <ambientLight intensity={0.9} color="#FFF5E5" />

          {/* Key Light (Golden Angle) */}
          <directionalLight
            position={[4.5, 6.5, 5]}
            intensity={2.0}
            color="#FFE6B8"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Warm Rim / Fill Light */}
          <directionalLight
            position={[-5, 3.5, -3]}
            intensity={1.3}
            color="#C9A46A"
          />

          {/* Bottom Accent */}
          <pointLight
            position={[0, -2, 2]}
            intensity={0.7}
            color="#5B3826"
          />

          <HeroSceneContent reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
};
