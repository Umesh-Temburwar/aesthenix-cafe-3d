import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAFE_ZONES } from '../../data/cafeZones';

interface CameraControllerProps {
  activeZoneId?: string;
  enableParallax?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeZoneId,
  enableParallax = true,
}) => {
  const { camera, pointer } = useThree();
  const targetPosRef = useRef(new THREE.Vector3(0, 2.5, 6.5));
  const lookAtRef = useRef(new THREE.Vector3(0, 1.4, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.4, 0));

  // Update target coordinates when active zone changes
  useEffect(() => {
    const targetZone = CAFE_ZONES.find((z) => z.id === activeZoneId) || CAFE_ZONES[0];
    targetPosRef.current.set(...targetZone.cameraPosition);
    lookAtRef.current.set(...targetZone.cameraTarget);
  }, [activeZoneId]);

  useFrame((_, delta) => {
    // Parallax offset from mouse pointer
    const parallaxX = enableParallax ? pointer.x * 0.4 : 0;
    const parallaxY = enableParallax ? pointer.y * 0.25 : 0;

    // Smoothly interpolate camera position
    const desiredPos = new THREE.Vector3(
      targetPosRef.current.x + parallaxX,
      targetPosRef.current.y + parallaxY,
      targetPosRef.current.z
    );

    // Delta-independent exponential smoothing
    const damping = Math.min(delta * 2.8, 1);
    camera.position.lerp(desiredPos, damping);

    // Smoothly interpolate lookAt vector
    currentLookAt.current.lerp(lookAtRef.current, damping);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
