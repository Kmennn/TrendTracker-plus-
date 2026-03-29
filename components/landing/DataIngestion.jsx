/**
 * DataIngestion - ACT I: Aggressive Arrival (v4)
 * 
 * CHANGE: "Data wants attention."
 * - Packets arrive aggressively
 * - High variance in speed, size, and glow
 * - They collide/overlap (visual tension)
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

const DATA_SOURCES = [
  { origin: [-15, 8, -10], color: '#a78bfa', name: 'social' },
  { origin: [15, 0, -8], color: '#60a5fa', name: 'news' },
  { origin: [0, -10, -12], color: '#f472b6', name: 'markets' },
  { origin: [0, 5, -20], color: '#34d399', name: 'video' },
  { origin: [-10, -5, -15], color: '#fbbf24', name: 'search' },
];

const CONVERGENCE_POINT = new THREE.Vector3(0, 0, 0);
const DUMMY_OBJ = new THREE.Object3D();
const DUMMY_COLOR = new THREE.Color();

export function DataIngestion({ scrollProgress = 0, visible = true }) {
  const meshRef = useRef();
  const isMobile = isMobileDevice();
  
  const packetsPerSource = isMobile ? 50 : 180;
  const totalCount = packetsPerSource * DATA_SOURCES.length;
  
  const { 
    velocities, colors, rotationSpeeds, 
    lifetimes, sizes, originalPositions, currentPositions,
    pulseOffsets, intensities 
  } = useMemo(() => {
    const velocities = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const rotationSpeeds = new Float32Array(totalCount * 3);
    const lifetimes = new Float32Array(totalCount);
    const sizes = new Float32Array(totalCount);
    const originalPositions = new Float32Array(totalCount * 3);
    const currentPositions = new Float32Array(totalCount * 3);
    const pulseOffsets = new Float32Array(totalCount);
    const intensities = new Float32Array(totalCount);
    
    let idx = 0;
    DATA_SOURCES.forEach((source) => {
      const baseColor = new THREE.Color(source.color);
      
      for (let i = 0; i < packetsPerSource; i++) {
        const ox = source.origin[0] + (Math.random() - 0.5) * 10; // Wider spread
        const oy = source.origin[1] + (Math.random() - 0.5) * 8;
        const oz = source.origin[2] + (Math.random() - 0.5) * 10;
        
        // Random start
        const progress = Math.random();
        currentPositions[idx * 3] = ox * (1 - progress) + CONVERGENCE_POINT.x * progress;
        currentPositions[idx * 3 + 1] = oy * (1 - progress) + CONVERGENCE_POINT.y * progress;
        currentPositions[idx * 3 + 2] = oz * (1 - progress) + CONVERGENCE_POINT.z * progress;
        
        originalPositions[idx * 3] = ox;
        originalPositions[idx * 3 + 1] = oy;
        originalPositions[idx * 3 + 2] = oz;
        
        // Aggressive velocity variance
        const dx = CONVERGENCE_POINT.x - ox;
        const dy = CONVERGENCE_POINT.y - oy;
        const dz = CONVERGENCE_POINT.z - oz;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
        
        // Some move VERY fast, others sluggish (Variance)
        const speedBase = 0.02;
        const speedVar = Math.random() > 0.8 ? 0.06 : 0.02; // 20% spanters
        const speed = speedBase + Math.random() * speedVar;
        
        velocities[idx * 3] = (dx / dist) * speed;
        velocities[idx * 3 + 1] = (dy / dist) * speed;
        velocities[idx * 3 + 2] = (dz / dist) * speed;
        
        colors[idx * 3] = baseColor.r;
        colors[idx * 3 + 1] = baseColor.g;
        colors[idx * 3 + 2] = baseColor.b;
        
        // Violent tumbling
        rotationSpeeds[idx * 3] = (Math.random() - 0.5) * 0.2;
        rotationSpeeds[idx * 3 + 1] = (Math.random() - 0.5) * 0.2;
        rotationSpeeds[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
        
        lifetimes[idx] = Math.random();
        sizes[idx] = 0.05 + Math.random() * 0.12; // High size variance
        
        pulseOffsets[idx] = Math.random() * Math.PI * 2;
        intensities[idx] = 0.5 + Math.random() * 1.5; // Some glow very bright
        
        idx++;
      }
    });
    
    return { velocities, colors, rotationSpeeds, lifetimes, sizes, originalPositions, currentPositions, pulseOffsets, intensities };
  }, [totalCount, packetsPerSource]);
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    // Fade out aggressively as we move to scrutiny
    const fadeOut = scrollProgress > 0.2 ? Math.max(0, 1 - (scrollProgress - 0.2) / 0.1) : 1;
    if (fadeOut <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    
    let needsColorUpdate = false;
    
    for (let i = 0; i < totalCount; i++) {
      const i3 = i * 3;
      
      // Move
      currentPositions[i3] += velocities[i3];
      currentPositions[i3 + 1] += velocities[i3 + 1];
      currentPositions[i3 + 2] += velocities[i3 + 2];
      
      // Check respawn
      const dx = currentPositions[i3] - CONVERGENCE_POINT.x;
      const dy = currentPositions[i3 + 1] - CONVERGENCE_POINT.y;
      const dz = currentPositions[i3 + 2] - CONVERGENCE_POINT.z;
      const distSq = dx*dx + dy*dy + dz*dz;
      
      if (distSq < 2) {
        currentPositions[i3] = originalPositions[i3];
        currentPositions[i3 + 1] = originalPositions[i3 + 1];
        currentPositions[i3 + 2] = originalPositions[i3 + 2];
      }
      
      DUMMY_OBJ.position.set(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);
      
      // Tumble
      DUMMY_OBJ.rotation.x += rotationSpeeds[i3];
      DUMMY_OBJ.rotation.y += rotationSpeeds[i3 + 1];
      DUMMY_OBJ.rotation.z += rotationSpeeds[i3 + 2];
      
      // Nervous pulse (Attention seeking)
      const pulseRate = intensities[i] > 1.2 ? 8 : 3; // Bright ones pulse faster
      const s = sizes[i] * (0.8 + Math.sin(time * pulseRate + pulseOffsets[i]) * 0.2);
      DUMMY_OBJ.scale.set(s, s, s);
      
      DUMMY_OBJ.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY_OBJ.matrix);
      
      // Color intensity variation
      const intensity = intensities[i];
      DUMMY_COLOR.setRGB(colors[i3] * intensity, colors[i3 + 1] * intensity, colors[i3 + 2] * intensity);
      meshRef.current.setColorAt(i, DUMMY_COLOR);
      needsColorUpdate = true;
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (needsColorUpdate) meshRef.current.instanceColor.needsUpdate = true;
    
    if (meshRef.current.material) {
      meshRef.current.material.opacity = fadeOut;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, totalCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

export default DataIngestion;
