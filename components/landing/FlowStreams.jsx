/**
 * FlowStreams - ACT III: Pattern Recognition
 * 
 * Particles align into flowing streams and directional paths.
 * Motion becomes calm and purposeful.
 * 
 * Feeling: "Patterns are forming."
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

// Stream path definitions (curved paths particles follow)
const STREAM_PATHS = [
  { start: [-6, 2, -5], end: [0, 0, 2], curve: [0, 3, -2] },
  { start: [5, -1, -6], end: [1, 0.5, 2], curve: [3, 0, -2] },
  { start: [-4, -3, -5], end: [-0.5, -0.5, 2], curve: [-2, -1, -1] },
  { start: [6, 3, -4], end: [0.5, 0, 3], curve: [2, 2, 0] },
  { start: [0, 4, -6], end: [0, 0.5, 2], curve: [1, 2, -2] },
];

export function FlowStreams({ scrollProgress = 0, visible = true }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  const isMobile = isMobileDevice();
  
  const particlesPerStream = isMobile ? 25 : 60;
  const streamCount = STREAM_PATHS.length;
  const totalCount = particlesPerStream * streamCount;
  
  // Generate particles along streams
  const { positions, streamIndices, progressOffsets, colors } = useMemo(() => {
    const positions = new Float32Array(totalCount * 3);
    const streamIndices = new Float32Array(totalCount);
    const progressOffsets = new Float32Array(totalCount);
    const colors = new Float32Array(totalCount * 3);
    
    const palette = [
      new THREE.Color('#a78bfa'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#60a5fa'),
    ];
    
    let idx = 0;
    for (let s = 0; s < streamCount; s++) {
      const color = palette[s % palette.length];
      
      for (let p = 0; p < particlesPerStream; p++) {
        streamIndices[idx] = s;
        progressOffsets[idx] = Math.random(); // Position along stream
        
        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;
        
        idx++;
      }
    }
    
    return { positions, streamIndices, progressOffsets, colors };
  }, [totalCount, streamCount, particlesPerStream]);
  
  // Line geometry for stream paths
  const linePositions = useMemo(() => {
    const positions = new Float32Array(streamCount * 20 * 3); // 20 points per stream
    return positions;
  }, [streamCount]);
  
  // Bezier curve interpolation
  const getPointOnStream = (streamIdx, t) => {
    const path = STREAM_PATHS[streamIdx];
    const t2 = t * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    
    return new THREE.Vector3(
      mt2 * path.start[0] + 2 * mt * t * path.curve[0] + t2 * path.end[0],
      mt2 * path.start[1] + 2 * mt * t * path.curve[1] + t2 * path.end[1],
      mt2 * path.start[2] + 2 * mt * t * path.curve[2] + t2 * path.end[2]
    );
  };
  
  useFrame((state) => {
    if (!pointsRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    
    // ACT III progress (0.35 to 0.65 of scroll)
    const actStart = 0.35;
    const actEnd = 0.7;
    const actProgress = Math.max(0, Math.min(1, (scrollProgress - actStart) / (actEnd - actStart)));
    
    // Visibility
    const fadeIn = Math.min(1, (scrollProgress - 0.3) / 0.15);
    const fadeOut = Math.max(0, 1 - (scrollProgress - 0.6) / 0.15);
    const visibility = Math.min(fadeIn, fadeOut);
    
    for (let i = 0; i < totalCount; i++) {
      const streamIdx = streamIndices[i];
      const baseProgress = progressOffsets[i];
      
      // Flow along stream (animated)
      const flowProgress = (baseProgress + time * 0.08) % 1;
      
      // Get position on curve
      const pos = getPointOnStream(streamIdx, flowProgress);
      
      // Add slight wobble
      pos.x += Math.sin(time * 2 + i) * 0.05 * (1 - actProgress);
      pos.y += Math.cos(time * 1.5 + i * 0.5) * 0.04 * (1 - actProgress);
      
      posArray[i * 3] = pos.x;
      posArray[i * 3 + 1] = pos.y;
      posArray[i * 3 + 2] = pos.z;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.material.opacity = visibility * 0.85;
    pointsRef.current.material.size = 0.06 + actProgress * 0.03;
    
    // Update stream lines
    if (linesRef.current) {
      const lineArray = linesRef.current.geometry.attributes.position.array;
      
      for (let s = 0; s < streamCount; s++) {
        for (let p = 0; p < 20; p++) {
          const t = p / 19;
          const pos = getPointOnStream(s, t);
          const idx = (s * 20 + p) * 3;
          lineArray[idx] = pos.x;
          lineArray[idx + 1] = pos.y;
          lineArray[idx + 2] = pos.z;
        }
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.material.opacity = visibility * actProgress * 0.2;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group>
      {/* Flow particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={totalCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={totalCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Stream path lines (subtle) */}
      {!isMobile && (
        <line ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={linePositions}
              count={streamCount * 20}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#818cf8"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </line>
      )}
    </group>
  );
}

export default FlowStreams;
