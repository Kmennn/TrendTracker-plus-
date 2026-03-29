/**
 * FloralDepth - FULL IMMERSION Curated.Media Style
 * 
 * Creates a dense, lush purple floral environment like curated.media:
 * - Hundreds of "pom-pom" style flowers (like Alliums/Dandelions)
 * - Hills and terrain in the background
 * - Large foreground flowers
 * - Bright purple atmospheric glow
 * - Depth fog with bloom effect
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Color palette matching curated.media EXACTLY
const COLORS = {
  skyPurple: '#694dff',      // Bright purple sky
  flowerBright: '#a78bfa',   // Bright lavender
  flowerMid: '#8b5cf6',      // Purple
  flowerDark: '#6d28d9',     // Deep violet
  stemGreen: '#166534',      // Dark green
  hillDark: '#2e1065',       // Dark purple for hills
  hillLight: '#581c87',      // Lighter purple hills
  atmosphereGlow: '#9333ea', // Purple glow
};

// Pom-pom flower (like Allium/Dandelion) - the key visual element
function PomPomFlower({ position, scale = 1, color, opacity = 1 }) {
  const groupRef = useRef();
  const particleCount = 60; // Dense pom-pom
  
  // Create sphere of small spheres (pom-pom effect)
  const particles = useMemo(() => {
    const points = [];
    for (let i = 0; i < particleCount; i++) {
      // Distribute on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const x = Math.sin(phi) * Math.cos(theta) * 0.3;
      const y = Math.sin(phi) * Math.sin(theta) * 0.3;
      const z = Math.cos(phi) * 0.3;
      
      points.push({ x, y, z, size: 0.04 + Math.random() * 0.03 });
    }
    return points;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Gentle sway
    groupRef.current.rotation.z = Math.sin(time * 0.5 + position[0]) * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.3 + position[1]) * 0.03;
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
      </mesh>
      
      {/* Pom-pom particles */}
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={opacity * 0.9}
          />
        </mesh>
      ))}
      
      {/* Stem */}
      <mesh position={[0, -0.8 * scale, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 1.5 * scale, 6]} />
        <meshBasicMaterial color={COLORS.stemGreen} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Large hero flower (like curated.media's foreground flower)
function HeroFlower({ position, scale = 1, color }) {
  const groupRef = useRef();
  const petalCount = 8;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
  });
  
  // Create petal shape
  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.3, 0.2, 0.4, 0.8, 0.1, 1.2);
    shape.bezierCurveTo(0, 1.4, -0.1, 1.2, -0.1, 1.2);
    shape.bezierCurveTo(-0.4, 0.8, -0.3, 0.2, 0, 0);
    return new THREE.ShapeGeometry(shape, 12);
  }, []);
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Center */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      
      {/* Large petals */}
      {Array.from({ length: petalCount }).map((_, i) => (
        <mesh
          key={i}
          geometry={petalGeo}
          position={[0, 0, 0]}
          rotation={[0.5, (i / petalCount) * Math.PI * 2, 0]}
          scale={[1.5, 1.5, 1]}
        >
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Hill/terrain element
function Hill({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Atmospheric glow layer
function AtmosphereGlow() {
  return (
    <>
      {/* Top-right glow */}
      <mesh position={[8, 5, -10]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial 
          color={COLORS.atmosphereGlow} 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Center glow */}
      <mesh position={[0, 0, -15]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial 
          color={COLORS.flowerBright} 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </>
  );
}

export function FloralDepth({ scrollProgress = 0 }) {
  const groupRef = useRef();
  
  // Generate DENSE flower field (like curated.media)
  const flowerField = useMemo(() => {
    const flowers = [];
    
    // Background flowers (far, smaller) - DENSE
    for (let i = 0; i < 80; i++) {
      flowers.push({
        position: [
          (Math.random() - 0.5) * 40,
          -2 + Math.random() * 6,
          -15 + Math.random() * 8,
        ],
        scale: 0.3 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? COLORS.flowerDark : COLORS.flowerMid,
        opacity: 0.5 + Math.random() * 0.3,
        layer: 'far',
      });
    }
    
    // Midground flowers - DENSE
    for (let i = 0; i < 50; i++) {
      flowers.push({
        position: [
          (Math.random() - 0.5) * 30,
          -3 + Math.random() * 4,
          -8 + Math.random() * 5,
        ],
        scale: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.3 ? COLORS.flowerMid : COLORS.flowerBright,
        opacity: 0.7 + Math.random() * 0.2,
        layer: 'mid',
      });
    }
    
    // Foreground flowers (close, larger) - scattered on sides
    for (let i = 0; i < 30; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      flowers.push({
        position: [
          side * (5 + Math.random() * 8),
          -4 + Math.random() * 3,
          -3 + Math.random() * 4,
        ],
        scale: 0.8 + Math.random() * 0.6,
        color: COLORS.flowerBright,
        opacity: 0.4 + Math.random() * 0.3, // Blurred look
        layer: 'close',
      });
    }
    
    return flowers;
  }, []);
  
  // Hills/terrain in background
  const hills = useMemo(() => [
    { position: [0, -4, -12], scale: [8, 4, 6], color: COLORS.hillDark },
    { position: [-10, -5, -15], scale: [10, 5, 8], color: COLORS.hillLight },
    { position: [12, -5, -14], scale: [8, 4, 6], color: COLORS.hillDark },
    { position: [5, -6, -10], scale: [6, 3, 5], color: COLORS.hillLight },
    { position: [-6, -6, -11], scale: [7, 3, 5], color: COLORS.hillLight },
  ], []);
  
  // Parallax
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = scrollProgress * 2;
  });
  
  return (
    <group ref={groupRef}>
      {/* Atmospheric glow */}
      <AtmosphereGlow />
      
      {/* Hills/terrain */}
      {hills.map((hill, i) => (
        <Hill key={`hill-${i}`} {...hill} />
      ))}
      
      {/* Dense flower field */}
      {flowerField.map((flower, i) => (
        <PomPomFlower key={`flower-${i}`} {...flower} />
      ))}
      
      {/* Large hero flowers (foreground, like curated.media) */}
      <HeroFlower 
        position={[6, -1, 1]} 
        scale={2.5} 
        color="#ddd6fe"
      />
      <HeroFlower 
        position={[7, -2, -1]} 
        scale={1.8} 
        color="#c4b5fd"
      />
      <HeroFlower 
        position={[-7, -2, 0]} 
        scale={1.5} 
        color="#c4b5fd"
      />
      
      {/* Ground plane with gradient */}
      <mesh position={[0, -6, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial 
          color={COLORS.hillDark} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Sky gradient plane */}
      <mesh position={[0, 5, -20]}>
        <planeGeometry args={[80, 30]} />
        <meshBasicMaterial 
          color={COLORS.skyPurple} 
          transparent 
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

export default FloralDepth;
