/**
 * CosmicParticles - Constellation of floating data particles
 * Creates depth and cosmic atmosphere
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

export function CosmicParticles({ count = 200, scrollProgress = 0 }) {
  const pointsRef = useRef();
  
  // Reduce count on mobile
  const isMobile = isMobileDevice();
  const particleCount = isMobile ? Math.floor(count / 3) : count;
  
  // Generate particles
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const colorPalette = [
      new THREE.Color('#a78bfa'), // Purple
      new THREE.Color('#818cf8'), // Indigo
      new THREE.Color('#60a5fa'), // Blue
      new THREE.Color('#c4b5fd'), // Light purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = 0.02 + Math.random() * 0.08;
    }
    
    return { positions, colors, sizes };
  }, [particleCount]);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    
    // Subtle scale based on scroll
    const scale = 1 + scrollProgress * 0.1;
    pointsRef.current.scale.setScalar(scale);
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default CosmicParticles;
