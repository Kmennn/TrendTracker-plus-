/**
 * DominantInsight - ACT V: Silence & Stillness (v4)
 * 
 * CHANGE: "Silence is Power".
 * - Absolute stillness.
 * - Perfect stability.
 * - "This is the truth."
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DominantInsight({ scrollProgress = 0, visible = true }) {
  const coreRef = useRef();
  const auraRef = useRef();
  const ringsRef = useRef([]);
  
  const actStart = 0.8;
  const actProgress = Math.max(0, (scrollProgress - actStart) / 0.2);
  
  useFrame((state) => {
    if (!coreRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    // EXTREME STABILITY
    // No erratic pulsing. Just a slow, deep breath.
    const breath = Math.sin(time * 0.8) * 0.02; // Very slow
    const scale = 0.9 + actProgress * 0.5 + breath;
    
    coreRef.current.scale.setScalar(scale);
    // Rotating VERY slowly - almost imperceptible
    coreRef.current.rotation.y += 0.0005; 
    coreRef.current.material.opacity = actProgress;
    
    if (auraRef.current) {
      auraRef.current.scale.setScalar(scale * 2.2);
      auraRef.current.material.opacity = actProgress * 0.15;
    }
    
    // Confidence Rings - Perfectly flat, slow rotation
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z = Math.PI / 2; // Flat
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
        ring.scale.setScalar(scale * (1.5 + i * 0.4));
        ring.material.opacity = actProgress * 0.1;
      }
    });
  });
  
  if (!visible) return null;
  
  return (
    <group position={[0, 0, 3]}>
      {/* The Truth Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#5b21b6"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0}
        />
      </mesh>
      
      {/* Stable Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Confidence Rings */}
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => (ringsRef.current[i] = el)}>
          <ringGeometry args={[0.98, 1, 128]} />
          <meshBasicMaterial
            color="#fff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
      <pointLight color="#a78bfa" intensity={actProgress * 2} distance={20} decay={2} />
    </group>
  );
}

export default DominantInsight;
