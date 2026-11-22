import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Model3DConfig } from '../../types';

interface CupModelProps {
  config: Model3DConfig;
  scale?: number;
  interactive?: boolean;
}

export const CupModel: React.FC<CupModelProps> = ({
  config,
  scale = 1,
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating oscillation if interactive
  useFrame((state) => {
    if (interactive && groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.6) * 0.035;
    }
  });

  const isGlass = config.glassType === 'glass-tumbler';
  const isMartini = config.glassType === 'martini-glass';

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* ================= SAUCER ================= */}
      {!isMartini && (
        <group position={[0, -0.62, 0]}>
          {/* Main Saucer Plate */}
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[1.52, 1.12, 0.12, 48]} />
            <meshPhysicalMaterial
              color={config.saucerColor || '#211711'}
              roughness={0.18}
              clearcoat={0.9}
              clearcoatRoughness={0.12}
              metalness={0.1}
            />
          </mesh>
          {/* Inner Saucer Indentation */}
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.82, 0.78, 0.02, 36]} />
            <meshPhysicalMaterial
              color={config.saucerColor || '#211711'}
              roughness={0.2}
              clearcoat={0.8}
            />
          </mesh>
          {/* Gold Inlay Rim Accent on Saucer */}
          <mesh position={[0, 0.065, 0]}>
            <torusGeometry args={[1.48, 0.022, 16, 48]} />
            <meshStandardMaterial
              color="#C9A46A"
              roughness={0.18}
              metalness={0.95}
            />
          </mesh>
        </group>
      )}

      {/* ================= CUP BODY ================= */}
      {isMartini ? (
        // Martini / Affogato Crystal Glass
        <group position={[0, 0, 0]}>
          {/* Bowl Cone */}
          <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
            <coneGeometry args={[1.25, 1.05, 36, 1, true]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.94}
              opacity={1}
              transparent
              roughness={0.06}
              ior={1.52}
              thickness={0.25}
            />
          </mesh>
          {/* Gold Rim on Glass */}
          <mesh position={[0, 1.04, 0]}>
            <torusGeometry args={[1.24, 0.015, 16, 36]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Fluted Stem */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 24]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.95}
              transparent
              roughness={0.05}
              ior={1.52}
            />
          </mesh>
          {/* Circular Glass Base */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.92, 0.92, 0.045, 36]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.95}
              transparent
              roughness={0.05}
              ior={1.52}
            />
          </mesh>
          {/* Hand-churned Vanilla Bean Gelato Scoop */}
          <group position={[0, 0.42, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.54, 32, 32]} />
              <meshStandardMaterial
                color="#FAF1DE"
                roughness={0.85}
              />
            </mesh>
            {/* Vanilla Bean Specks */}
            {[-0.2, 0.15, -0.05, 0.22].map((vx, vi) => (
              <mesh key={vi} position={[vx, 0.35 + vi * 0.04, 0.25]} scale={[0.015, 0.015, 0.015]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#1E140E" />
              </mesh>
            ))}
            {/* Roasted Almond Slivers on Gelato */}
            <mesh position={[-0.15, 0.48, 0.1]} rotation={[0.4, 0.8, -0.2]} scale={[0.16, 0.03, 0.07]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#B08354" roughness={0.5} />
            </mesh>
            <mesh position={[0.18, 0.45, -0.1]} rotation={[-0.3, 0.2, 0.5]} scale={[0.15, 0.03, 0.06]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#A37445" roughness={0.5} />
            </mesh>
          </group>
        </group>
      ) : isGlass ? (
        // Glass Tumbler (Cold Brew / Chilled Americano)
        <group position={[0, 0.1, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.96, 0.82, 1.65, 36, 1, true]} />
            <meshPhysicalMaterial
              color="#F4F8FA"
              transmission={0.92}
              transparent
              opacity={1}
              roughness={0.07}
              ior={1.52}
              thickness={0.35}
            />
          </mesh>
          {/* Thick Solid Base */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.84, 0.82, 0.18, 36]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              transmission={0.92}
              transparent
              roughness={0.07}
              ior={1.52}
            />
          </mesh>
          {/* Gold Rim on Chilled Glass */}
          <mesh position={[0, 0.825, 0]}>
            <torusGeometry args={[0.96, 0.018, 16, 36]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ) : (
        // High-End Artisan Porcelain Ceramic Mug
        <group position={[0, 0, 0]}>
          {/* Exterior Ceramic Shell */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[1.06, 0.76, 1.28, 48, 1, true]} />
            <meshPhysicalMaterial
              color={config.cupColor}
              roughness={0.18}
              clearcoat={1.0}
              clearcoatRoughness={0.12}
              metalness={0.08}
            />
          </mesh>
          {/* Bottom Foot Ring */}
          <mesh position={[0, -0.62, 0]}>
            <cylinderGeometry args={[0.78, 0.76, 0.06, 48]} />
            <meshPhysicalMaterial
              color={config.cupColor}
              roughness={0.2}
              clearcoat={0.9}
              metalness={0.08}
            />
          </mesh>
          {/* Inner Glaze (Soft Warm Cream Porcelain) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.99, 0.71, 1.22, 48, 1, true]} />
            <meshPhysicalMaterial
              color="#F7F1E6"
              roughness={0.14}
              clearcoat={0.9}
              side={THREE.BackSide}
            />
          </mesh>
          {/* Precision 24K Gold Lip Rim */}
          <mesh position={[0, 0.64, 0]}>
            <torusGeometry args={[1.055, 0.024, 16, 48]} />
            <meshStandardMaterial
              color="#C9A46A"
              roughness={0.16}
              metalness={0.96}
            />
          </mesh>
          {/* Ergonomic Curved Ceramic Handle */}
          <group position={[1.04, 0.04, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <mesh castShadow>
              <torusGeometry args={[0.44, 0.095, 16, 32, Math.PI * 1.18]} />
              <meshPhysicalMaterial
                color={config.cupColor}
                roughness={0.18}
                clearcoat={1.0}
                clearcoatRoughness={0.12}
                metalness={0.08}
              />
            </mesh>
            {/* Gold Accent on handle spine */}
            <mesh position={[0.44, 0, 0]}>
              <boxGeometry args={[0.015, 0.35, 0.06]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================= LIQUID SURFACE & MENISCUS ================= */}
      <mesh
        position={[0, isMartini ? 0.36 : isGlass ? 0.62 : 0.44, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[isMartini ? 0.88 : isGlass ? 0.91 : 0.96, 48]} />
        <meshPhysicalMaterial
          color={config.liquidColor}
          roughness={0.12}
          clearcoat={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* ================= CREMA & LATTE ART ================= */}
      {config.cremaColor && !isMartini && (
        <group position={[0, isGlass ? 0.63 : 0.45, 0]}>
          {/* Base Crema Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, isGlass ? 0.90 : 0.95, 36]} />
            <meshStandardMaterial
              color={config.cremaColor}
              roughness={0.65}
            />
          </mesh>
          {/* Central Microfoam Swirl */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.64, 36]} />
            <meshStandardMaterial
              color={config.cremaColor}
              roughness={0.7}
            />
          </mesh>

          {/* Sculpted Rosetta / Tulip Leaf Pattern for Cappuccino & Latte */}
          {(config.topping === 'cocoa' || config.topping === 'caramel' || !config.hasIce) && (
            <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              {/* Central Heart Heartlet */}
              <mesh position={[0, 0.15, 0]} scale={[0.18, 0.22, 1]}>
                <circleGeometry args={[1, 16]} />
                <meshStandardMaterial color="#FFF5EB" roughness={0.5} />
              </mesh>
              {/* Rosetta Layer Tiers */}
              {[0.0, -0.14, -0.26].map((ly, li) => (
                <group key={li} position={[0, ly, 0]}>
                  <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -0.3]} scale={[0.14, 0.07, 1]}>
                    <circleGeometry args={[1, 16]} />
                    <meshStandardMaterial color="#FFF5EB" roughness={0.5} />
                  </mesh>
                  <mesh position={[0.12, 0, 0]} rotation={[0, 0, 0.3]} scale={[0.14, 0.07, 1]}>
                    <circleGeometry args={[1, 16]} />
                    <meshStandardMaterial color="#FFF5EB" roughness={0.5} />
                  </mesh>
                </group>
              ))}
              {/* Rosetta Stem */}
              <mesh position={[0, -0.22, 0]} scale={[0.025, 0.35, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial color="#FFF5EB" roughness={0.5} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ================= ICE CUBES FOR CHILLED DRINKS ================= */}
      {config.hasIce && (
        <group position={[0, 0.48, 0]}>
          {[
            { pos: [-0.26, 0.12, 0.12], rot: [0.25, 0.45, 0.15] },
            { pos: [0.29, 0.14, -0.16], rot: [-0.35, 0.65, 0.4] },
            { pos: [0.06, 0.24, 0.24], rot: [0.55, -0.25, 0.35] },
            { pos: [-0.12, 0.06, -0.32], rot: [0.15, 0.85, -0.25] },
            { pos: [0.22, 0.08, 0.2], rot: [-0.2, 0.3, -0.4] },
          ].map((cube, i) => (
            <mesh
              key={i}
              position={cube.pos as [number, number, number]}
              rotation={cube.rot as [number, number, number]}
              castShadow
            >
              <boxGeometry args={[0.34, 0.34, 0.34]} />
              <meshPhysicalMaterial
                color="#F0F7F9"
                transmission={0.94}
                transparent
                roughness={0.08}
                ior={1.31}
                thickness={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= TOPPING EMBELLISHMENTS ================= */}
      {/* 1. Single-Origin Valrhona Cocoa Dusting */}
      {config.topping === 'cocoa' && (
        <group position={[0, 0.468, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.15, 0.58, 24]} />
            <meshBasicMaterial color="#301A0E" transparent opacity={0.75} />
          </mesh>
        </group>
      )}

      {/* 2. Slow-Simmered Salted Caramel Ribbon */}
      {config.topping === 'caramel' && (
        <group position={[0, 0.47, 0]}>
          {/* Outer Caramel Swirl */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.48, 0.04, 12, 36]} />
            <meshPhysicalMaterial
              color="#BF7426"
              roughness={0.12}
              clearcoat={0.9}
              transmission={0.3}
            />
          </mesh>
          {/* Inner Cross Drizzle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.035, 12, 28]} />
            <meshPhysicalMaterial
              color="#D48632"
              roughness={0.12}
              clearcoat={0.9}
              transmission={0.3}
            />
          </mesh>
          {/* Fleur de Sel Mineral Flakes */}
          {[-0.2, 0.1, 0.25].map((sx, si) => (
            <mesh key={si} position={[sx, 0.02, si * 0.1]} scale={[0.025, 0.025, 0.025]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          ))}
        </group>
      )}

      {/* 3. Roasted Heirloom Coffee Beans */}
      {config.topping === 'beans' && (
        <group position={[0, 0.58, 0]}>
          {[
            { pos: [-0.16, 0.01, 0.06], rot: [0.2, 0.6, 0] },
            { pos: [0.14, 0.03, -0.09], rot: [-0.15, -0.85, 0.35] },
            { pos: [0.03, 0.04, 0.18], rot: [0.45, 0.25, -0.25] },
          ].map((bean, idx) => (
            <group
              key={idx}
              position={bean.pos as [number, number, number]}
              rotation={bean.rot as [number, number, number]}
            >
              <mesh scale={[0.13, 0.075, 0.09]} castShadow>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#271409" roughness={0.45} />
              </mesh>
              <mesh scale={[0.135, 0.008, 0.015]} position={[0, 0.065, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="#100703" />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
