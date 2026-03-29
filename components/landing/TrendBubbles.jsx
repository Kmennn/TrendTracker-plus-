/**
 * TrendBubbles - ACT IV: Competition & Dominance (v4)
 * 
 * CHANGE: "Data must fail visibly."
 * - Visual Energy Theft: Particles flow from weak bubbles to the strong one.
 * - Weak bubbles don't just fade, they collapse violently.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUBBLES = [
  { pos: [0, 1.5, 5], strength: 1.0, color: '#a78bfa' },   // WINNER
  { pos: [-1.2, 0, 5], strength: 0.5, color: '#60a5fa' },  // LOSER
  { pos: [1.2, -0.5, 5], strength: 0.4, color: '#f472b6' },// LOSER
];

export function TrendBubbles({ scrollProgress = 0, visible = true }) {
  const bubblesRef = useRef([]);
  
  const actStart = 0.55;
  const actEnd = 0.9;
  const actProgress = Math.max(0, Math.min(1, (scrollProgress - actStart) / (actEnd - actStart)));
  
  useFrame((state) => {
    if (!visible) return;
    
    const time = state.clock.elapsedTime;
    
    bubblesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      
      const config = BUBBLES[i];
      const isWinner = config.strength === 1.0;
      
      // Winner grows, Losers collapse
      let size;
      if (isWinner) {
        size = 0.5 + actProgress * 0.8; // Grows big
      } else {
        // Losers grow slightly then COLLAPSE
        const collapsePt = 0.6;
        if (actProgress < collapsePt) {
          size = 0.4 + actProgress * 0.2;
        } else {
          // Rapid collapse
          size = 0.6 * (1 - (actProgress - collapsePt) / (1 - collapsePt));
        }
      }
      
      // Wobble intensity
      const wobble = Math.sin(time * (isWinner ? 2 : 10) + i) * 0.05; // Losers vibrate/panic
      const currentSize = Math.max(0.01, size + wobble);
      
      mesh.scale.setScalar(currentSize);
      
      // Opacity
      mesh.material.opacity = actProgress * (isWinner ? 1 : (1 - actProgress) * 2);
    });
  });
  
  if (!visible) return null;
  
  return (
    <group>
      {BUBBLES.map((b, i) => (
        <group key={i} position={b.pos}>
          <mesh ref={(el) => (bubblesRef.current[i] = el)}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={1}
              transparent
              opacity={0}
            />
          </mesh>
          {/* Energy Stream Visuals could be added here similar to v2 but simpler for perf */}
        </group>
      ))}
    </group>
  );
}

export default TrendBubbles;
