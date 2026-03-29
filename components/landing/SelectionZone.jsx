/**
 * SelectionZone - ACT II: Intelligence Selection
 * 
 * Weak particles fade and dissolve.
 * Strong signals survive and persist.
 * 
 * Feeling: "Something is deciding what matters."
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

export function SelectionZone({ scrollProgress = 0, visible = true }) {
  const pointsRef = useRef();
  const filterRef = useRef();
  const isMobile = isMobileDevice();
  
  const count = isMobile ? 200 : 600;
  
  // Particles with survival scores
  const { positions, velocities, survivalScores, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const survivalScores = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Start spread out
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      // Forward drift (toward camera)
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = 0.015 + Math.random() * 0.01;
      
      // Survival score (higher = survives filtering)
      survivalScores[i] = Math.random();
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, velocities, survivalScores, phases };
  }, [count]);
  
  // Sizes buffer (for shrinking dying particles)
  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = 0.04 + Math.random() * 0.06;
    }
    return sizes;
  }, [count]);
  
  // Colors
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Stronger particles are brighter purple
      const strength = survivalScores[i];
      const color = new THREE.Color().setHSL(
        0.72 + strength * 0.08, // Purple to blue
        0.7 + strength * 0.3,
        0.5 + strength * 0.3
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, [count, survivalScores]);
  
  useFrame((state) => {
    if (!pointsRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const sizeArray = pointsRef.current.geometry.attributes.size.array;
    
    // ACT II progress (0.15 to 0.4 of scroll)
    const actStart = 0.15;
    const actEnd = 0.45;
    const actProgress = Math.max(0, Math.min(1, (scrollProgress - actStart) / (actEnd - actStart)));
    
    // Overall visibility
    const fadeIn = Math.min(1, scrollProgress / 0.2);
    const fadeOut = Math.max(0, 1 - (scrollProgress - 0.35) / 0.15);
    const visibility = Math.min(fadeIn, fadeOut);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const survival = survivalScores[i];
      
      // Motion
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1] + Math.sin(time + phases[i]) * 0.002;
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Selection effect: weak particles shrink and fall
      const survivalThreshold = actProgress * 0.7;
      const alive = survival > survivalThreshold;
      
      if (alive) {
        // Survivor: maintain size, pulse gently
        sizeArray[i] = sizes[i] * (1 + Math.sin(time * 2 + phases[i]) * 0.2);
      } else {
        // Dying: shrink and fall
        sizeArray[i] *= 0.96;
        posArray[i3 + 1] -= 0.02; // Fall down
      }
      
      // Wrap z
      if (posArray[i3 + 2] > 5) posArray[i3 + 2] = -5;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
    pointsRef.current.material.opacity = visibility * 0.8;
    
    // Filter plane effect
    if (filterRef.current) {
      filterRef.current.material.opacity = actProgress * 0.08 * visibility;
      filterRef.current.position.z = -2 + actProgress * 4;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group>
      {/* Selection particles */}
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
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={count}
            itemSize={1}
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
      
      {/* Subtle filter plane */}
      <mesh ref={filterRef} position={[0, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default SelectionZone;
