/**
 * ScrutinyGate - ACT II & III: The Trial of Data (v4)
 * 
 * CHANGE: From "Filter" to "Scrutiny & Rejection"
 * 
 * Phases:
 * 1. SCANNING: A ripple passes over packets. They flicker nervously.
 * 2. REJECTION: Weak packets are PUSHED AWAY (not just faded).
 *    - They turn dark.
 *    - They drift backward.
 *    - "Only relevance survives."
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

const DUMMY_OBJ = new THREE.Object3D();
const DUMMY_COLOR = new THREE.Color();

export function ScrutinyGate({ scrollProgress = 0, visible = true }) {
  const meshRef = useRef();
  const scannerRef = useRef();
  const isMobile = isMobileDevice();
  
  const count = isMobile ? 120 : 400;
  
  const { 
    velocities, survivalScores, baseColors, 
    rotations, states, originalY, sizes, currentPositions,
    rejectionVectors 
  } = useMemo(() => {
    const velocities = new Float32Array(count * 3);
    const survivalScores = new Float32Array(count);
    const baseColors = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const states = new Float32Array(count); // 0=approach, 1=scanned, 2=survived, 3=rejected
    const originalY = new Float32Array(count);
    const sizes = new Float32Array(count);
    const currentPositions = new Float32Array(count * 3);
    const rejectionVectors = new Float32Array(count * 3); // Where they go when rejected
    
    const palette = [
      new THREE.Color('#a78bfa'),
      new THREE.Color('#60a5fa'),
      new THREE.Color('#f472b6'),
      new THREE.Color('#34d399'),
    ];
    
    for (let i = 0; i < count; i++) {
      // Start spread out
      currentPositions[i * 3] = (Math.random() - 0.5) * 12;
      currentPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      currentPositions[i * 3 + 2] = -10 + Math.random() * 5; // Start deeper
      
      originalY[i] = currentPositions[i * 3 + 1];
      
      // Approach velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = 0.04 + Math.random() * 0.02; // Move toward camera
      
      // Rejection vector (push away/sideways)
      rejectionVectors[i * 3] = (Math.random() - 0.5) * 0.1;
      rejectionVectors[i * 3 + 1] = (Math.random() - 0.5) * 0.05 + 0.02; // Down mostly
      rejectionVectors[i * 3 + 2] = -0.05 - Math.random() * 0.05; // BACKWARDS
      
      survivalScores[i] = Math.random();
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      baseColors[i * 3] = color.r;
      baseColors[i * 3 + 1] = color.g;
      baseColors[i * 3 + 2] = color.b;
      
      rotations[i * 3] = (Math.random() - 0.5) * 0.1;
      rotations[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      rotations[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      
      sizes[i] = 0.1 + Math.random() * 0.08;
      states[i] = 0;
    }
    
    return { velocities, survivalScores, baseColors, rotations, states, originalY, sizes, currentPositions, rejectionVectors };
  }, [count]);
  
  const SCAN_Z = -2; // Where the scan happens
  const SURVIVAL_THRESHOLD = 0.70;
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    // Scan line position moves with scroll
    const scanZ = -6 + scrollProgress * 8; // Scan moves forward
    
    // Visibility
    const visibility = Math.min(1, Math.max(0, 1 - (scrollProgress - 0.5) / 0.1));
    if (visibility <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // State Logic
      if (states[i] === 0) { // Approaching
        // Check if scanned
        if (currentPositions[i3 + 2] > scanZ - 1 && currentPositions[i3 + 2] < scanZ + 1) {
          states[i] = 1; // Scanned
        }
      } 
      
      if (states[i] === 1) { // Being Scanned
        // Flicker effect handled in color
        if (currentPositions[i3 + 2] < scanZ - 1) states[i] = 0; // Missed it?
        if (currentPositions[i3 + 2] > scanZ + 0.5) {
          // Judgment Moment
          if (survivalScores[i] < SURVIVAL_THRESHOLD) {
            states[i] = 3; // REJECTED
          } else {
            states[i] = 2; // SURVIVED
          }
        }
      }
      
      // Motion Logic
      if (states[i] === 3) {
        // REJECTED: Push back and away
        currentPositions[i3] += rejectionVectors[i3];
        currentPositions[i3 + 1] += rejectionVectors[i3 + 1];
        currentPositions[i3 + 2] += rejectionVectors[i3 + 2]; // Move backwards!
        
        // Spin aggressively
        rotations[i3] *= 1.05;
        rotations[i3+1] *= 1.05;
        
      } else {
        // Normal motion
        currentPositions[i3] += velocities[i3];
        currentPositions[i3 + 1] += velocities[i3 + 1];
        currentPositions[i3 + 2] += velocities[i3 + 2];
        
        if (states[i] === 2) {
          // Survivors stabilize
          rotations[i3] *= 0.1;
          rotations[i3+1] *= 0.1;
          rotations[i3+2] *= 0.1;
        }
      }
      
      // Respawn if too far or fully rejected
      if (currentPositions[i3 + 2] > 5 || currentPositions[i3 + 2] < -15 || Math.abs(currentPositions[i3]) > 20) {
        currentPositions[i3] = (Math.random() - 0.5) * 12;
        currentPositions[i3 + 1] = originalY[i];
        currentPositions[i3 + 2] = -12; // Back of line
        states[i] = 0;
        // Reset speed
        rotations[i3] = (Math.random() - 0.5) * 0.1;
      }
      
      // Colors & Visuals
      let r = baseColors[i3];
      let g = baseColors[i3 + 1];
      let b = baseColors[i3 + 2];
      let s = sizes[i];
      
      if (states[i] === 1) {
        // SCANNING: Nervous flicker
        const flicker = Math.random() > 0.5 ? 1.5 : 0.5;
        r *= flicker; g *= flicker; b *= flicker;
      } else if (states[i] === 3) {
        // REJECTED: Darken and turn grey
        r *= 0.2; g *= 0.2; b *= 0.2;
        s *= 0.95; // Shrink
      } else if (states[i] === 2) {
        // SURVIVED: Warm glow
        r = Math.min(1, r * 1.5);
        g = Math.min(1, g * 1.5);
        b = Math.min(1, b * 1.5);
        s *= 1.1; // Grow slightly
      }
      
      // Update Instance
      DUMMY_OBJ.position.set(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);
      DUMMY_OBJ.rotation.x += rotations[i3];
      DUMMY_OBJ.rotation.y += rotations[i3 + 1];
      DUMMY_OBJ.rotation.z += rotations[i3 + 2];
      DUMMY_OBJ.scale.set(s, s, s);
      DUMMY_OBJ.updateMatrix();
      
      meshRef.current.setMatrixAt(i, DUMMY_OBJ.matrix);
      DUMMY_COLOR.setRGB(r, g, b);
      meshRef.current.setColorAt(i, DUMMY_COLOR);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
    
    // Scanner Visual
    if (scannerRef.current) {
      scannerRef.current.position.z = scanZ;
      scannerRef.current.material.opacity = Math.max(0, 0.2 * (1 - Math.abs(scanZ) / 10));
    }
    
    if (meshRef.current.material) {
      meshRef.current.material.opacity = visibility;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group>
      {/* Packets */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} /> 
        <meshBasicMaterial transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      
      {/* The Scanner Beam */}
      <mesh ref={scannerRef} position={[0, 0, -6]}>
        <ringGeometry args={[4, 4.5, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default ScrutinyGate;
