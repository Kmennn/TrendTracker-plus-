/**
 * IntelligenceCore - Central glowing orb representing data intelligence
 * Responds to scroll progress and cursor movement
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function IntelligenceCore({ scrollProgress = 0, cursorX = 0, cursorY = 0 }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const innerRef = useRef();
  
  // Create gradient material
  const coreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7c3aed'),
      emissive: new THREE.Color('#4f46e5'),
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
  }, []);
  
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a78bfa'),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
  }, []);
  
  const innerMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#c4b5fd'),
      transparent: true,
      opacity: 0.4,
    });
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Base rotation (slow ambient)
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    
    // Cursor influence (subtle)
    meshRef.current.rotation.y += cursorX * delta * 0.5;
    meshRef.current.rotation.x += cursorY * delta * 0.3;
    
    // Scale pulse based on scroll
    const baseScale = 1 + scrollProgress * 0.2;
    const pulse = Math.sin(time * 2) * 0.02;
    meshRef.current.scale.setScalar(baseScale + pulse);
    
    // Glow intensity varies with scroll
    if (glowRef.current) {
      const glowScale = 1.4 + scrollProgress * 0.3 + Math.sin(time * 1.5) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = 0.12 + scrollProgress * 0.08;
    }
    
    // Inner core rotation (counter)
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3;
      innerRef.current.rotation.z = Math.cos(time * 0.5) * 0.2;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Outer glow */}
      <mesh ref={glowRef} material={glowMaterial}>
        <sphereGeometry args={[1.5, 32, 32]} />
      </mesh>
      
      {/* Main core */}
      <mesh ref={meshRef} material={coreMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      
      {/* Inner bright core */}
      <mesh ref={innerRef} material={innerMaterial}>
        <sphereGeometry args={[0.4, 32, 32]} />
      </mesh>
      
      {/* Point light from core */}
      <pointLight
        color="#a78bfa"
        intensity={2 + scrollProgress}
        distance={15}
        decay={2}
      />
    </group>
  );
}

export default IntelligenceCore;
