import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { CupModel } from '../../components/three/CupModel';
import { FloatingBeans } from '../../components/three/FloatingBeans';
import { SteamParticles } from '../../components/three/SteamParticles';
import { CanvasFallback } from '../../components/three/CanvasFallback';
import { Product } from '../../types';

interface CoffeeShowcaseSceneProps {
  product: Product;
  className?: string;
  enableControls?: boolean;
}

export const CoffeeShowcaseScene: React.FC<CoffeeShowcaseSceneProps> = ({
  product,
  className = '',
  enableControls = true,
}) => {
  const isHot = product.category === 'hot' || product.category === 'tea';

  return (
    <div className={`relative w-full h-full min-h-[380px] ${className}`}>
      <Suspense fallback={<CanvasFallback title={product.name} />}>
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 3.8], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Lighting */}
          <ambientLight intensity={0.8} color="#FFF5EA" />

          {/* Key Light */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.8}
            color="#FFE5B4"
            castShadow
          />

          {/* Rim Light */}
          <directionalLight
            position={[-4, 3, -3]}
            intensity={1.2}
            color="#C9A46A"
          />

          {/* Subtle Warm Underlight */}
          <pointLight
            position={[0, -2, 1]}
            intensity={0.5}
            color="#845338"
          />

          {/* Model */}
          <group position={[0, -0.2, 0]}>
            <CupModel
              config={product.model3D}
              scale={1.3}
              interactive={true}
            />

            {/* Rising Steam for hot drinks */}
            {isHot && (
              <SteamParticles position={[0, 0.6, 0]} count={20} />
            )}

            {/* Subtle floating beans around showcase */}
            <FloatingBeans count={8} radius={1.9} />

            {/* Floor Contact Shadow */}
            <ContactShadows
              position={[0, -1.0, 0]}
              opacity={0.55}
              scale={5}
              blur={2.0}
              far={2.5}
            />
          </group>

          {/* Controlled Orbit Controls with strict limits so user never gets lost */}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              minDistance={2.5}
              maxDistance={5.0}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.9}
              autoRotate={true}
              autoRotateSpeed={0.8}
              dampingFactor={0.05}
              enableZoom={true}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
};
