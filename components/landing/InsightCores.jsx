/**
 * InsightCores - ACT IV & V: Trend Convergence & Clarity
 * 
 * Streams converge into luminous cores.
 * Final act: environment dims, one core remains dominant.
 * 
 * Feeling: "This is insight." → "I trust this intelligence."
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

// Core positions (where streams converge)
const CORE_POSITIONS = [
  { pos: [0, 0.3, 0], dominance: 1.0 },      // Primary (center)
  { pos: [-2, -0.5, -1], dominance: 0.6 },   // Secondary
  { pos: [2.5, 0.8, -0.5], dominance: 0.5 }, // Secondary
  { pos: [-1.5, 1.5, -1.5], dominance: 0.4 },
  { pos: [1.8, -1.2, -1], dominance: 0.35 },
];

function InsightCore({ position, dominance, scrollProgress, time, isPrimary }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  // ACT IV: cores visible (0.6 - 0.85)
  // ACT V: only primary remains (0.85 - 1.0)
  const act4Progress = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.3));
  const act5Progress = Math.max(0, (scrollProgress - 0.8) / 0.2);
  
  // Visibility
  let visibility = act4Progress * dominance;
  if (!isPrimary && act5Progress > 0) {
    visibility *= (1 - act5Progress); // Non-primary fade out
  }
  
  // Scale
  const baseScale = 0.15 + dominance * 0.25;
  const pulseScale = Math.sin(time * 2 * dominance + dominance * 5) * 0.05;
  const scale = baseScale * (0.5 + act4Progress * 0.5) + pulseScale;
  
  // Primary core grows in ACT V
  const finalScale = isPrimary ? scale * (1 + act5Progress * 0.5) : scale;
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    meshRef.current.scale.setScalar(finalScale);
    meshRef.current.material.opacity = visibility;
    meshRef.current.rotation.y += 0.005 * dominance;
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(finalScale * 2.5);
      glowRef.current.material.opacity = visibility * 0.15;
    }
  });
  
  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={isPrimary ? '#a78bfa' : '#818cf8'}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isPrimary ? '#7c3aed' : '#6366f1'}
          emissive={isPrimary ? '#7c3aed' : '#6366f1'}
          emissiveIntensity={0.8}
          transparent
          opacity={0}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight
        color={isPrimary ? '#a78bfa' : '#818cf8'}
        intensity={visibility * 2 * dominance}
        distance={8}
        decay={2}
      />
    </group>
  );
}

export function InsightCores({ scrollProgress = 0, visible = true }) {
  const groupRef = useRef();
  const isMobile = isMobileDevice();
  const time = useRef(0);
  
  // Connection lines between cores
  const connectionLines = useMemo(() => {
    if (isMobile) return null;
    
    const positions = new Float32Array(CORE_POSITIONS.length * 2 * 3);
    // Connect each core to the primary
    for (let i = 1; i < CORE_POSITIONS.length; i++) {
      const idx = (i - 1) * 6;
      // From secondary to primary
      positions[idx] = CORE_POSITIONS[i].pos[0];
      positions[idx + 1] = CORE_POSITIONS[i].pos[1];
      positions[idx + 2] = CORE_POSITIONS[i].pos[2];
      positions[idx + 3] = CORE_POSITIONS[0].pos[0];
      positions[idx + 4] = CORE_POSITIONS[0].pos[1];
      positions[idx + 5] = CORE_POSITIONS[0].pos[2];
    }
    return positions;
  }, [isMobile]);
  
  const linesRef = useRef();
  
  useFrame((state) => {
    time.current = state.clock.elapsedTime;
    
    if (linesRef.current) {
      const act4Progress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.25));
      const act5Progress = Math.max(0, (scrollProgress - 0.8) / 0.2);
      linesRef.current.material.opacity = act4Progress * 0.15 * (1 - act5Progress);
    }
  });
  
  if (!visible) return null;
  
  return (
    <group ref={groupRef}>
      {/* Insight cores */}
      {CORE_POSITIONS.map((core, idx) => (
        <InsightCore
          key={idx}
          position={core.pos}
          dominance={core.dominance}
          scrollProgress={scrollProgress}
          time={time.current}
          isPrimary={idx === 0}
        />
      ))}
      
      {/* Connection lines */}
      {connectionLines && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={connectionLines}
              count={(CORE_POSITIONS.length - 1) * 2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}

export default InsightCores;
