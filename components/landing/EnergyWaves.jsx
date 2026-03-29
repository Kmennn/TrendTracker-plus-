/**
 * EnergyWaves - Expanding signal rings around the core
 * Visualizes data propagation / trend signals
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice, prefersReducedMotion } from '../../motion/uiCapabilities';

function WaveRing({ delay = 0, maxRadius = 4, scrollProgress = 0 }) {
  const ringRef = useRef();
  
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a78bfa'),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
  }, []);
  
  useFrame((state) => {
    if (!ringRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Wave expansion cycle (3 seconds per wave)
    const cycle = ((time + delay) % 3) / 3;
    
    // Scale from 0 to max
    const scale = cycle * maxRadius;
    ringRef.current.scale.setScalar(scale);
    
    // Fade out as it expands
    material.opacity = (1 - cycle) * 0.25 * (1 + scrollProgress * 0.5);
    
    // Slight Y wobble
    ringRef.current.rotation.x = Math.sin(time * 0.5 + delay) * 0.1;
  });
  
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} material={material}>
      <ringGeometry args={[0.95, 1, 64]} />
    </mesh>
  );
}

export function EnergyWaves({ scrollProgress = 0 }) {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  // Disable on mobile or reduced motion
  if (isMobile || reducedMotion) {
    return null;
  }
  
  return (
    <group>
      <WaveRing delay={0} maxRadius={5} scrollProgress={scrollProgress} />
      <WaveRing delay={1} maxRadius={5} scrollProgress={scrollProgress} />
      <WaveRing delay={2} maxRadius={5} scrollProgress={scrollProgress} />
    </group>
  );
}

export default EnergyWaves;
