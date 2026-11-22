import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAFE_ZONES } from '../../data/cafeZones';

interface CafeInteriorModelProps {
  activeZoneId?: string;
  onSelectZone?: (zoneId: string) => void;
}

export const CafeInteriorModel: React.FC<CafeInteriorModelProps> = ({
  activeZoneId,
  onSelectZone,
}) => {
  const lightsGroupRef = useRef<THREE.Group>(null);
  const hotspotsGroupRef = useRef<THREE.Group>(null);

  // Subtle breathing light effect & hotspot rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (lightsGroupRef.current) {
      lightsGroupRef.current.children.forEach((light, i) => {
        if (light instanceof THREE.PointLight) {
          light.intensity = 1.7 + Math.sin(t * 2.2 + i * 1.4) * 0.12;
        }
      });
    }

    if (hotspotsGroupRef.current) {
      hotspotsGroupRef.current.children.forEach((hotspot, idx) => {
        // Rotate outer ring of each hotspot
        const outerRing = hotspot.children[0];
        if (outerRing) {
          outerRing.rotation.z = t * 0.8 + idx;
        }
      });
    }
  });

  return (
    <group>
      {/* ================= 1. FLOOR (Venetian Polished Terrazzo) ================= */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#15100D"
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>

      {/* Decorative Brass Floor Inlay Geometries */}
      {[-8, 0, 8].map((fx, fi) => (
        <mesh
          key={fi}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[fx, 0.005, 0]}
        >
          <ringGeometry args={[3.8, 3.84, 48]} />
          <meshStandardMaterial
            color="#C9A46A"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* ================= 2. CEILING & TIMBER RAFTERS ================= */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6.2, 0]}
      >
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#0A0706" roughness={0.95} />
      </mesh>

      {/* Exposed Dark Walnut Ceiling Rafter Beams */}
      {[-10, -6, -2, 2, 6, 10].map((x, i) => (
        <group key={i} position={[x, 6.0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.45, 28]} />
            <meshStandardMaterial color="#1C130E" roughness={0.7} />
          </mesh>
          {/* Recessed Warm Ceiling LED Spots along beams */}
          {[-8, -4, 0, 4, 8].map((z, zi) => (
            <mesh key={zi} position={[0, -0.23, z]}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              <meshBasicMaterial color="#FFE6B3" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= 3. BACK WALL, BRANDING & ARCHED WINDOWS ================= */}
      <group position={[0, 3.1, -12]}>
        {/* Wall Frame in Dark Charcoal Plaster */}
        <mesh receiveShadow>
          <boxGeometry args={[28, 6.2, 0.6]} />
          <meshStandardMaterial color="#17120F" roughness={0.85} />
        </mesh>

        {/* Timber Wainscoting Ribs along bottom wall */}
        <mesh position={[0, -1.8, 0.32]}>
          <boxGeometry args={[27.8, 1.8, 0.06]} />
          <meshStandardMaterial color="#1F1510" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.9, 0.36]}>
          <boxGeometry args={[27.8, 0.06, 0.08]} />
          <meshStandardMaterial color="#C9A46A" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Café Brand Signage: "AURA ROAST" with Illuminated Backlight */}
        <group position={[0, 2.2, 0.35]}>
          {/* Matte Black Plaque */}
          <mesh>
            <boxGeometry args={[4.6, 0.8, 0.06]} />
            <meshStandardMaterial color="#100C0A" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Glowing Brushed Gold Letter Plate */}
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[4.3, 0.62, 0.02]} />
            <meshStandardMaterial
              color="#C9A46A"
              emissive="#C9A46A"
              emissiveIntensity={0.55}
              roughness={0.15}
              metalness={0.95}
            />
          </mesh>
          {/* Gold Accent Border */}
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[4.45, 0.72, 0.01]} />
            <meshBasicMaterial color="#E2C38E" wireframe />
          </mesh>
          <pointLight position={[0, 0.1, 0.4]} color="#FFD899" intensity={0.9} distance={3} />
        </group>

        {/* Blackboard Menu above Roastery Stage */}
        <group position={[0, 0.9, 0.35]}>
          <mesh>
            <boxGeometry args={[6.2, 0.7, 0.04]} />
            <meshStandardMaterial color="#0E0A08" roughness={0.9} />
          </mesh>
          {/* Gold Menu Header Bar */}
          <mesh position={[0, 0.32, 0.025]}>
            <boxGeometry args={[6.1, 0.04, 0.02]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Chalk Lines Indication */}
          {[-0.15, 0.0, 0.15].map((my, mi) => (
            <mesh key={mi} position={[0, my, 0.025]}>
              <boxGeometry args={[5.2, 0.02, 0.01]} />
              <meshBasicMaterial color="#C5B6A5" transparent opacity={0.65} />
            </mesh>
          ))}
        </group>

        {/* 3 Large Arched Windows with Sunlight Streaming */}
        {[-7, 0, 7].map((x, idx) => (
          <group key={idx} position={[x, -0.1, 0.2]}>
            {/* Window Glass Pane */}
            <mesh>
              <planeGeometry args={[3.8, 4.0]} />
              <meshPhysicalMaterial
                color="#82A0AB"
                transmission={0.88}
                transparent
                roughness={0.08}
                ior={1.5}
              />
            </mesh>
            {/* Architectural Window Grille */}
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[3.9, 0.08, 0.06]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[0.08, 4.0, 0.06]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* Volumetric Warm Sunlight Shaft Cones */}
            <mesh
              position={[0, -0.6, 2.2]}
              rotation={[Math.PI / 4, 0, 0]}
            >
              <cylinderGeometry args={[1.6, 2.8, 4.5, 24, 1, true]} />
              <meshBasicMaterial
                color="#FFF3D6"
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 4. SIDE WALLS & SCONCES ================= */}
      {/* Left Wall */}
      <group position={[-14, 3.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[28, 6.2, 0.6]} />
          <meshStandardMaterial color="#17120F" roughness={0.85} />
        </mesh>
        {/* Wall Sconces */}
        {[-6, 0, 6].map((sz, si) => (
          <group key={si} position={[sz, 0.8, 0.35]}>
            <mesh>
              <boxGeometry args={[0.12, 0.5, 0.1]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.2} />
            </mesh>
            <pointLight color="#FFD18A" intensity={0.7} distance={3.5} />
          </group>
        ))}
      </group>

      {/* Right Wall */}
      <group position={[14, 3.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[28, 6.2, 0.6]} />
          <meshStandardMaterial color="#17120F" roughness={0.85} />
        </mesh>
        {/* Wall Sconces */}
        {[-6, 0, 6].map((sz, si) => (
          <group key={si} position={[sz, 0.8, 0.35]}>
            <mesh>
              <boxGeometry args={[0.12, 0.5, 0.1]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.2} />
            </mesh>
            <pointLight color="#FFD18A" intensity={0.7} distance={3.5} />
          </group>
        ))}
      </group>

      {/* ================= 5. ZONE 1: THE GRAND ESPRESSO BAR ================= */}
      <group position={[0, 0, -2.5]}>
        {/* Calacatta Quartz Bar Counter Top */}
        <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.0, 0.14, 2.0]} />
          <meshPhysicalMaterial
            color="#2A221E"
            roughness={0.16}
            clearcoat={0.8}
            metalness={0.15}
          />
        </mesh>
        {/* Under-counter Warm LED Wash Light Strip */}
        <mesh position={[0, 1.04, 0.98]}>
          <boxGeometry args={[7.8, 0.02, 0.02]} />
          <meshBasicMaterial color="#FFE299" />
        </mesh>
        {/* Counter Base (Fluted Dark Oak Timber Paneling) */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 1.04, 1.8]} />
          <meshStandardMaterial color="#1D140E" roughness={0.75} />
        </mesh>
        {/* Polished Brass Foot Rail */}
        <mesh position={[0, 0.2, 1.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 8.0, 24]} />
          <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Bespoke Italian 3-Group Brass Espresso Machine */}
        <group position={[-1.2, 1.28, -0.15]}>
          {/* Main Chassis */}
          <mesh castShadow position={[0, 0.36, 0]}>
            <boxGeometry args={[2.0, 0.65, 0.95]} />
            <meshStandardMaterial color="#110B08" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Top Cup Warming Rack in Brass */}
          <mesh position={[0, 0.69, 0]}>
            <boxGeometry args={[1.96, 0.03, 0.92]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Ceramic Demitasse Cups on Warming Rack */}
          {[-0.6, -0.3, 0.0, 0.3, 0.6].map((cx, ci) => (
            <mesh key={ci} position={[cx, 0.77, (ci % 2 === 0 ? 0.15 : -0.15)]} castShadow>
              <cylinderGeometry args={[0.09, 0.06, 0.12, 16]} />
              <meshStandardMaterial color={ci % 2 === 0 ? '#FAF2E6' : '#221610'} roughness={0.2} />
            </mesh>
          ))}

          {/* 3 Groupheads with Portafilters */}
          {[-0.55, 0, 0.55].map((gx, gi) => (
            <group key={gi} position={[gx, 0.18, 0.52]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.18, 24]} />
                <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
              </mesh>
              {/* Portafilter Handle with Ergonomic Black Grip */}
              <mesh position={[0, -0.06, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.032, 0.032, 0.36, 16]} />
                <meshStandardMaterial color="#110B08" roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* Dual Steam Wands with Chrome Tips */}
          {[-0.95, 0.95].map((wx, wi) => (
            <group key={wi} position={[wx, 0.25, 0.45]} rotation={[0.2, (wi === 0 ? -0.3 : 0.3), 0]}>
              <mesh>
                <cylinderGeometry args={[0.02, 0.02, 0.35, 12]} />
                <meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.1} />
              </mesh>
            </group>
          ))}

          {/* Dual Analog Pressure Gauges */}
          {[-0.25, 0.25].map((px, pi) => (
            <group key={pi} position={[px, 0.48, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
                <meshStandardMaterial color="#C9A46A" metalness={0.95} />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.055, 0.055, 0.005, 24]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Twin Commercial Espresso Grinders */}
        <group position={[1.5, 1.28, -0.15]}>
          {[-0.4, 0.4].map((gx, gi) => (
            <group key={gi} position={[gx, 0, 0]}>
              <mesh castShadow position={[0, 0.42, 0]}>
                <cylinderGeometry args={[0.22, 0.26, 0.84, 24]} />
                <meshStandardMaterial color="#18110D" roughness={0.3} metalness={0.6} />
              </mesh>
              {/* Amber Acrylic Bean Hopper */}
              <mesh position={[0, 0.95, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.26, 0.48, 24]} />
                <meshPhysicalMaterial color="#4A2D1B" roughness={0.1} transmission={0.7} />
              </mesh>
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.27, 0.27, 0.04, 24]} />
                <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 4 High-End Bar Stools with Leather Cushions & Brass Legs */}
        {[-2.6, -0.9, 0.9, 2.6].map((bx, bi) => (
          <group key={bi} position={[bx, 0, 2.0]}>
            {/* Cushion */}
            <mesh position={[0, 0.78, 0]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.12, 28]} />
              <meshStandardMaterial color="#462C1D" roughness={0.65} />
            </mesh>
            {/* Brass Tapered Legs */}
            {[-0.18, 0.18].map((lx, lxi) =>
              [-0.18, 0.18].map((lz, lzi) => (
                <mesh key={`${lxi}-${lzi}`} position={[lx, 0.36, lz]}>
                  <cylinderGeometry args={[0.024, 0.016, 0.74, 12]} />
                  <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
                </mesh>
              ))
            )}
            {/* Foot Ring */}
            <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.25, 0.02, 8, 28]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 6. ZONE 2: THE VELVET MEZZANINE (Lounge Seating) ================= */}
      <group position={[-7.2, 0, 1.8]}>
        {/* Moroccan Luxury Wool Area Rug under lounge */}
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 4.4]} />
          <meshStandardMaterial color="#211712" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.1, 2.15, 36]} />
          <meshBasicMaterial color="#C9A46A" />
        </mesh>

        {/* Fluted Walnut Round Table */}
        <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.09, 36]} />
          <meshPhysicalMaterial color="#2F1F16" roughness={0.3} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.46, 0.62, 28]} />
          <meshStandardMaterial color="#1C120B" roughness={0.7} />
        </mesh>

        {/* Tabletop Centerpiece: Brass Candlestick with Gentle Glow */}
        <group position={[0, 0.78, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.12, 0.22, 16]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color="#FFEAA3" />
          </mesh>
          <pointLight position={[0, 0.18, 0]} color="#FFD175" intensity={0.6} distance={2.5} />
        </group>

        {/* Plush Midnight Velvet Armchairs */}
        {[
          { pos: [-1.45, 0, 0], rot: [0, Math.PI / 2, 0] },
          { pos: [1.45, 0, 0], rot: [0, -Math.PI / 2, 0] },
          { pos: [0, 0, 1.45], rot: [0, 0, 0] },
        ].map((chair, ci) => (
          <group
            key={ci}
            position={chair.pos as [number, number, number]}
            rotation={chair.rot as [number, number, number]}
          >
            {/* Seat Cushion */}
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.94, 0.26, 0.88]} />
              <meshStandardMaterial color="#291810" roughness={0.82} />
            </mesh>
            {/* Curved Backrest */}
            <mesh position={[0, 0.82, -0.36]} castShadow>
              <boxGeometry args={[0.94, 0.62, 0.22]} />
              <meshStandardMaterial color="#23140D" roughness={0.85} />
            </mesh>
            {/* Armrests */}
            {[-0.44, 0.44].map((ax, ai) => (
              <mesh key={ai} position={[ax, 0.68, 0]} castShadow>
                <boxGeometry args={[0.12, 0.35, 0.8]} />
                <meshStandardMaterial color="#291810" roughness={0.82} />
              </mesh>
            ))}
            {/* Slim Brass Legs */}
            {[-0.4, 0.4].map((lx, lxi) =>
              [-0.36, 0.36].map((lz, lzi) => (
                <mesh key={`${lxi}-${lzi}`} position={[lx, 0.18, lz]}>
                  <cylinderGeometry args={[0.024, 0.018, 0.36, 12]} />
                  <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
                </mesh>
              ))
            )}
          </group>
        ))}
      </group>

      {/* ================= 7. ZONE 3: RESERVE CUPPING & BEAN SHELF ================= */}
      <group position={[7.2, 0, 0.8]}>
        {/* Floor-to-Ceiling Shelving Unit in Dark Walnut & Brass */}
        <mesh position={[0, 2.6, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 5.2, 0.5]} />
          <meshStandardMaterial color="#1B110A" roughness={0.7} />
        </mesh>
        {/* 4 Brass Shelf Dividers with Integrated Warm Edge LED Strips */}
        {[1.2, 2.2, 3.2, 4.2].map((sy, si) => (
          <group key={si} position={[0, sy, -2.3]}>
            <mesh>
              <boxGeometry args={[4.3, 0.06, 0.46]} />
              <meshStandardMaterial color="#C9A46A" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* LED strip */}
            <mesh position={[0, -0.035, 0.22]}>
              <boxGeometry args={[4.2, 0.015, 0.02]} />
              <meshBasicMaterial color="#FFE6B3" />
            </mesh>
            {/* Single-Origin Microlot Amber Apothecary Jars */}
            {[-1.6, -1.0, -0.4, 0.4, 1.0, 1.6].map((jx, ji) => (
              <group key={ji} position={[jx, 0.22, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.13, 0.13, 0.35, 16]} />
                  <meshPhysicalMaterial
                    color="#683D1B"
                    transmission={0.65}
                    roughness={0.15}
                    transparent
                  />
                </mesh>
                {/* White Handwritten Label Band */}
                <mesh position={[0, 0, 0.135]}>
                  <planeGeometry args={[0.18, 0.12]} />
                  <meshBasicMaterial color="#F4EDE4" />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Cupping & Sensory Testing Table */}
        <mesh position={[0, 0.88, 0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.12, 1.3]} />
          <meshPhysicalMaterial color="#2A1B13" roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0.42, 0.6]} castShadow>
          <boxGeometry args={[3.0, 0.84, 0.95]} />
          <meshStandardMaterial color="#150E09" roughness={0.8} />
        </mesh>

        {/* Siphon Coffee Brewer Tower on Cupping Table */}
        <group position={[-0.9, 1.1, 0.6]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.65, 16]} />
            <meshStandardMaterial color="#C9A46A" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.22, 0.16]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshPhysicalMaterial color="#FFFFFF" transmission={0.92} transparent roughness={0.08} />
          </mesh>
        </group>
        {/* Silver Cupping Spoons */}
        {[0.2, 0.5, 0.8].map((sx, si) => (
          <mesh key={si} position={[sx, 0.96, 0.55]} rotation={[0, 0.2 * si, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.24, 12]} />
            <meshStandardMaterial color="#D8D8D8" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ================= 8. ZONE 4: THE GLASSHOUSE ATRIUM & TREES ================= */}
      {/* Centenary Olive Trees with Ribbed Terracotta Planters */}
      {[
        { pos: [-11.0, 0, -8.5] },
        { pos: [11.0, 0, -8.5] },
        { pos: [-11.0, 0, 4.5] },
        { pos: [11.0, 0, 4.5] },
      ].map((plant, pi) => (
        <group key={pi} position={plant.pos as [number, number, number]}>
          {/* Terracotta Fluted Planter */}
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.54, 0.42, 0.96, 28]} />
            <meshStandardMaterial color="#2D211A" roughness={0.8} />
          </mesh>
          {/* Soil Bed */}
          <mesh position={[0, 0.94, 0]}>
            <cylinderGeometry args={[0.51, 0.51, 0.04, 24]} />
            <meshStandardMaterial color="#160E08" roughness={0.95} />
          </mesh>
          {/* Tree Trunk */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.14, 1.35, 16]} />
            <meshStandardMaterial color="#382519" roughness={0.9} />
          </mesh>
          {/* Foliage Canopy Clusters */}
          <group position={[0, 2.35, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.82, 16, 16]} />
              <meshStandardMaterial color="#253A2A" roughness={0.88} />
            </mesh>
            <mesh position={[0.35, 0.35, 0.25]} castShadow>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#2E4734" roughness={0.88} />
            </mesh>
            <mesh position={[-0.35, 0.25, -0.25]} castShadow>
              <sphereGeometry args={[0.65, 16, 16]} />
              <meshStandardMaterial color="#1E3022" roughness={0.88} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ================= 9. HANGING PENDANT LAMPS ================= */}
      <group ref={lightsGroupRef}>
        {[
          { pos: [-2.5, 4.8, -2.5] },
          { pos: [0, 4.8, -2.5] },
          { pos: [2.5, 4.8, -2.5] },
          { pos: [-7.2, 4.8, 1.8] },
          { pos: [7.2, 4.8, 0.8] },
        ].map((light, li) => (
          <group key={li} position={light.pos as [number, number, number]}>
            {/* Cord */}
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.4, 8]} />
              <meshStandardMaterial color="#0A0807" />
            </mesh>
            {/* Brass Fluted Shade */}
            <mesh position={[0, 0, 0]}>
              <coneGeometry args={[0.38, 0.48, 28, 1, true]} />
              <meshStandardMaterial
                color="#C9A46A"
                metalness={0.95}
                roughness={0.16}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Glowing Edison Bulb */}
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color="#FFF0D1" />
            </mesh>
            {/* Point Light */}
            <pointLight
              position={[0, -0.22, 0]}
              color="#FFD699"
              intensity={1.8}
              distance={8.0}
              decay={2}
              castShadow
            />
          </group>
        ))}
      </group>

      {/* ================= 10. ARCHITECTURAL INTERACTIVE HOTSPOTS ================= */}
      <group ref={hotspotsGroupRef}>
        {CAFE_ZONES.map((zone) => {
          const isSelected = activeZoneId === zone.id;
          return (
            <group
              key={zone.id}
              position={zone.hotspotPosition}
              onClick={(e) => {
                e.stopPropagation();
                onSelectZone?.(zone.id);
              }}
            >
              {/* Animated Outer Rotating Brass Beacon Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.36, 36]} />
                <meshBasicMaterial
                  color={isSelected ? '#FAF0E6' : '#C9A46A'}
                  transparent
                  opacity={isSelected ? 0.95 : 0.65}
                />
              </mesh>
              {/* Inner Static Pulse Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.22, 28]} />
                <meshBasicMaterial
                  color="#E2C38E"
                  transparent
                  opacity={isSelected ? 0.8 : 0.4}
                />
              </mesh>
              {/* Glowing Core Sphere */}
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.13, 20, 20]} />
                <meshBasicMaterial
                  color={isSelected ? '#FFFFFF' : '#FFDFA8'}
                />
              </mesh>
              {/* Soft Beacon Illumination */}
              <pointLight
                color="#C9A46A"
                intensity={isSelected ? 1.2 : 0.5}
                distance={3.0}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
};
