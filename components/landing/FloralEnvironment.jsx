/**
 * FloralEnvironment - Ethereal Flower Background
 * 
 * Procedural flower/flora shapes using instanced meshes.
 * Creates a dreamy purple/blue floral environment.
 * Depth-based fog and parallax layers.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Number of flora instances per layer
const FLORA_COUNT = {
  foreground: 15,
  midground: 25,
  background: 40,
};

// Flower petal geometry
function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.1, 0.2, 0.15, 0.5, 0, 0.7);
  shape.bezierCurveTo(-0.15, 0.5, -0.1, 0.2, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(shape, 8);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Flower component (single flower with petals)
function Flower({ position, scale, rotation, color, delay = 0 }) {
  const groupRef = useRef();
  const petalCount = 6;
  
  const petalGeometry = useMemo(() => createPetalGeometry(), []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime + delay;
    
    // Gentle swaying
    groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Center */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      
      {/* Petals */}
      {Array.from({ length: petalCount }).map((_, i) => (
        <mesh 
          key={i} 
          geometry={petalGeometry}
          rotation={[0, (i / petalCount) * Math.PI * 2, 0.3]}
          position={[0, 0.02, 0]}
        >
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.7} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Grass/stem component
function FloraStalk({ position, height, color }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(time + position[0]) * 0.15;
  });
  
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.01, 0.015, height, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// Glowing orb (pollen/particle)
function GlowOrb({ position, size, color }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.3;
  });
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
      <pointLight color={color} intensity={0.3} distance={2} decay={2} />
    </mesh>
  );
}

export function FloralEnvironment({ scrollProgress = 0, visible = true }) {
  const groupRef = useRef();
  
  // Generate random flora positions
  const floraData = useMemo(() => {
    const data = {
      foreground: [],
      midground: [],
      background: [],
    };
    
    // Foreground (closer, larger, more saturated)
    for (let i = 0; i < FLORA_COUNT.foreground; i++) {
      data.foreground.push({
        position: [
          (Math.random() - 0.5) * 20,
          -3 + Math.random() * 2,
          -5 + Math.random() * 3,
        ],
        scale: 0.8 + Math.random() * 0.5,
        rotation: [0, Math.random() * Math.PI * 2, 0],
        color: Math.random() > 0.5 ? '#a78bfa' : '#c4b5fd',
        delay: Math.random() * 10,
      });
    }
    
    // Midground
    for (let i = 0; i < FLORA_COUNT.midground; i++) {
      data.midground.push({
        position: [
          (Math.random() - 0.5) * 30,
          -4 + Math.random() * 3,
          -10 + Math.random() * 5,
        ],
        scale: 0.5 + Math.random() * 0.4,
        rotation: [0, Math.random() * Math.PI * 2, 0],
        color: Math.random() > 0.5 ? '#818cf8' : '#a78bfa',
        delay: Math.random() * 10,
      });
    }
    
    // Background (further, smaller, more muted)
    for (let i = 0; i < FLORA_COUNT.background; i++) {
      data.background.push({
        position: [
          (Math.random() - 0.5) * 40,
          -5 + Math.random() * 4,
          -20 + Math.random() * 8,
        ],
        scale: 0.3 + Math.random() * 0.3,
        rotation: [0, Math.random() * Math.PI * 2, 0],
        color: Math.random() > 0.5 ? '#6366f1' : '#818cf8',
        delay: Math.random() * 10,
      });
    }
    
    return data;
  }, []);
  
  // Generate stalks
  const stalks = useMemo(() => {
    const result = [];
    for (let i = 0; i < 50; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 35,
          -5,
          -15 + Math.random() * 10,
        ],
        height: 1 + Math.random() * 2,
        color: '#4c1d95',
      });
    }
    return result;
  }, []);
  
  // Glowing orbs (floating particles)
  const orbs = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 25,
          -2 + Math.random() * 5,
          -12 + Math.random() * 8,
        ],
        size: 0.03 + Math.random() * 0.05,
        color: Math.random() > 0.5 ? '#a78bfa' : '#22d3ee',
      });
    }
    return result;
  }, []);
  
  // Parallax effect based on scroll
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = scrollProgress * 5;
  });
  
  if (!visible) return null;
  
  return (
    <group ref={groupRef}>
      {/* Background flowers */}
      {floraData.background.map((flora, i) => (
        <Flower key={`bg-${i}`} {...flora} />
      ))}
      
      {/* Midground flowers */}
      {floraData.midground.map((flora, i) => (
        <Flower key={`mg-${i}`} {...flora} />
      ))}
      
      {/* Foreground flowers */}
      {floraData.foreground.map((flora, i) => (
        <Flower key={`fg-${i}`} {...flora} />
      ))}
      
      {/* Stalks */}
      {stalks.map((stalk, i) => (
        <FloraStalk key={`stalk-${i}`} {...stalk} />
      ))}
      
      {/* Glowing orbs */}
      {orbs.map((orb, i) => (
        <GlowOrb key={`orb-${i}`} {...orb} />
      ))}
      
      {/* Ambient ground fog */}
      <mesh position={[0, -5.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial 
          color="#1e1b4b" 
          transparent 
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

export default FloralEnvironment;
