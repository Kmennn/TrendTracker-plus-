/**
 * SignalField - ACT I: Raw Chaotic Particles
 * 
 * Visual: Thousands of micro-particles flying in random directions
 * Feeling: "Overwhelming data. Noise. Disorder."
 * 
 * No symmetry, no clustering, no calm motion.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

export function SignalField({ scrollProgress = 0, visible = true }) {
  const pointsRef = useRef();
  const isMobile = isMobileDevice();
  
  // Particle count (high for chaos effect)
  const count = isMobile ? 400 : 1500;
  
  // Generate chaotic particles
  const { positions, velocities, phases, baseOpacities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const baseOpacities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread across a large volume
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      // Random velocities (chaotic directions)
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
      
      // Random phase for flicker
      phases[i] = Math.random() * Math.PI * 2;
      
      // Some particles are stronger than others (for ACT II)
      baseOpacities[i] = 0.3 + Math.random() * 0.7;
    }
    
    return { positions, velocities, phases, baseOpacities };
  }, [count]);
  
  // Colors buffer
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#a78bfa'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#60a5fa'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#f0abfc'),
    ];
    
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, [count]);
  
  useFrame((state) => {
    if (!pointsRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    
    // ACT I visibility (fade as we scroll past)
    const actOpacity = Math.max(0, 1 - scrollProgress * 2);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Chaotic motion
      posArray[i3] += velocities[i3] + Math.sin(time + phases[i]) * 0.005;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.7 + phases[i]) * 0.004;
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Wrap around (infinite field effect)
      if (posArray[i3] > 10) posArray[i3] = -10;
      if (posArray[i3] < -10) posArray[i3] = 10;
      if (posArray[i3 + 1] > 8) posArray[i3 + 1] = -8;
      if (posArray[i3 + 1] < -8) posArray[i3 + 1] = 8;
      if (posArray[i3 + 2] > 12) posArray[i3 + 2] = -12;
      if (posArray[i3 + 2] < -12) posArray[i3 + 2] = 12;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.material.opacity = actOpacity * 0.7;
  });
  
  if (!visible) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default SignalField;
