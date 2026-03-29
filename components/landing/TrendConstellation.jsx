/**
 * TrendConstellation - The visual soul of TrendTracker+
 * 
 * Represents: raw signals → emerging trends → strong insights → decisions
 * 
 * Features:
 * - Signal nodes that drift in 3D space
 * - Distance-based connection lines (trends forming)
 * - Scroll-driven evolution (sparse → clustered)
 * - Subtle trend bursts (insight breakouts)
 * - Cursor interaction (gentle attraction)
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice, prefersReducedMotion } from '../../motion/uiCapabilities';

// Configuration
const CONFIG = {
  desktop: {
    nodeCount: 80,
    maxConnections: 120,
    connectionDistance: 2.5,
    showConnections: true,
    showBursts: true,
  },
  mobile: {
    nodeCount: 30,
    maxConnections: 0,
    connectionDistance: 0,
    showConnections: false,
    showBursts: false,
  },
};

/**
 * Signal Node - A single data point in the constellation
 */
function useSignalNodes(count, scrollProgress) {
  const nodesRef = useRef([]);
  
  // Initialize nodes
  useMemo(() => {
    nodesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      // Initial position (spread out sphere)
      basePosition: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ),
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
      ),
      // Visual properties
      color: new THREE.Color().setHSL(
        0.7 + Math.random() * 0.15, // Purple-blue range
        0.7 + Math.random() * 0.3,
        0.6 + Math.random() * 0.2
      ),
      size: 0.03 + Math.random() * 0.05,
      pulseOffset: Math.random() * Math.PI * 2,
      // Clustering behavior
      clusterTarget: Math.floor(Math.random() * 5), // 5 cluster groups
    }));
  }, [count]);
  
  return nodesRef;
}

/**
 * Main Trend Constellation Component
 */
export function TrendConstellation({ 
  scrollProgress = 0, 
  cursorX = 0, 
  cursorY = 0 
}) {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  const config = isMobile ? CONFIG.mobile : CONFIG.desktop;
  
  // Refs
  const pointsRef = useRef();
  const linesRef = useRef();
  const burstRef = useRef();
  const frameCount = useRef(0);
  
  // Nodes state
  const nodesRef = useSignalNodes(config.nodeCount, scrollProgress);
  
  // Geometry buffers
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(config.nodeCount * 3);
    const colors = new Float32Array(config.nodeCount * 3);
    const sizes = new Float32Array(config.nodeCount);
    return { positions, colors, sizes };
  }, [config.nodeCount]);
  
  // Connection lines buffer
  const linePositions = useMemo(() => {
    return new Float32Array(config.maxConnections * 6); // 2 points * 3 coords
  }, [config.maxConnections]);
  
  // Cluster centers (evolve with scroll)
  const clusterCenters = useMemo(() => [
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(2, -1, 1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1.5, -1.5, 0.5),
    new THREE.Vector3(1.5, 1.5, -0.5),
  ], []);
  
  // Burst state
  const [burstActive, setBurstActive] = useState(false);
  const [burstScale, setBurstScale] = useState(0);
  const [burstCenter, setBurstCenter] = useState(new THREE.Vector3(0, 0, 0));
  
  // Main animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !nodesRef.current.length) return;
    
    const time = state.clock.elapsedTime;
    frameCount.current++;
    
    // --- Node Physics ---
    const clusterStrength = scrollProgress * 0.8; // How much nodes cluster
    const nodes = nodesRef.current;
    
    nodes.forEach((node, i) => {
      // Base drift motion
      node.position.copy(node.basePosition);
      node.position.add(node.velocity.clone().multiplyScalar(time * 100));
      
      // Gentle oscillation
      node.position.x += Math.sin(time * 0.5 + node.pulseOffset) * 0.2;
      node.position.y += Math.cos(time * 0.4 + node.pulseOffset) * 0.15;
      node.position.z += Math.sin(time * 0.3 + node.pulseOffset * 2) * 0.1;
      
      // Cluster attraction (increases with scroll)
      const clusterCenter = clusterCenters[node.clusterTarget];
      const toCluster = clusterCenter.clone().sub(node.position);
      node.position.add(toCluster.multiplyScalar(clusterStrength * 0.4));
      
      // Cursor attraction (subtle)
      if (!isMobile && Math.abs(cursorX) + Math.abs(cursorY) > 0.05) {
        node.position.x += cursorX * 0.15 * (1 - Math.abs(node.position.x) / 5);
        node.position.y -= cursorY * 0.1 * (1 - Math.abs(node.position.y) / 4);
      }
      
      // Update buffer
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
      
      // Color (brightens with scroll)
      const brightness = 0.6 + scrollProgress * 0.3;
      colors[i * 3] = node.color.r * brightness;
      colors[i * 3 + 1] = node.color.g * brightness;
      colors[i * 3 + 2] = node.color.b * brightness;
      
      // Size pulse
      const pulse = Math.sin(time * 2 + node.pulseOffset) * 0.3 + 1;
      sizes[i] = node.size * pulse * (1 + scrollProgress * 0.3);
    });
    
    // Update points geometry
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
    
    // --- Connection Lines ---
    if (config.showConnections && linesRef.current) {
      let lineIndex = 0;
      const connectionThreshold = config.connectionDistance * (0.5 + scrollProgress * 0.8);
      
      // Only check every few frames for performance
      if (frameCount.current % 3 === 0) {
        for (let i = 0; i < nodes.length && lineIndex < config.maxConnections; i++) {
          for (let j = i + 1; j < nodes.length && lineIndex < config.maxConnections; j++) {
            const dist = nodes[i].position.distanceTo(nodes[j].position);
            
            if (dist < connectionThreshold) {
              // Add line
              linePositions[lineIndex * 6] = nodes[i].position.x;
              linePositions[lineIndex * 6 + 1] = nodes[i].position.y;
              linePositions[lineIndex * 6 + 2] = nodes[i].position.z;
              linePositions[lineIndex * 6 + 3] = nodes[j].position.x;
              linePositions[lineIndex * 6 + 4] = nodes[j].position.y;
              linePositions[lineIndex * 6 + 5] = nodes[j].position.z;
              lineIndex++;
            }
          }
        }
        
        // Clear remaining
        for (let i = lineIndex; i < config.maxConnections; i++) {
          linePositions[i * 6] = 0;
          linePositions[i * 6 + 1] = 0;
          linePositions[i * 6 + 2] = 0;
          linePositions[i * 6 + 3] = 0;
          linePositions[i * 6 + 4] = 0;
          linePositions[i * 6 + 5] = 0;
        }
        
        linesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
    
    // --- Trend Burst ---
    if (config.showBursts && burstRef.current) {
      // Trigger burst occasionally when scrolled far
      if (!burstActive && scrollProgress > 0.6 && Math.random() < 0.002) {
        setBurstActive(true);
        setBurstScale(0);
        // Pick a cluster center
        const center = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
        setBurstCenter(center.clone());
      }
      
      if (burstActive) {
        const newScale = burstScale + delta * 2;
        if (newScale > 3) {
          setBurstActive(false);
          setBurstScale(0);
        } else {
          setBurstScale(newScale);
        }
        
        burstRef.current.scale.setScalar(newScale);
        burstRef.current.position.copy(burstCenter);
        burstRef.current.material.opacity = (1 - newScale / 3) * 0.15;
      }
    }
  });
  
  // Burst material
  const burstMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a78bfa'),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })
  , []);
  
  return (
    <group>
      {/* Signal Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={config.nodeCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={config.nodeCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={config.nodeCount}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Connection Lines */}
      {config.showConnections && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={linePositions}
              count={config.maxConnections * 2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.15 + scrollProgress * 0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
      
      {/* Trend Burst Ring */}
      {config.showBursts && (
        <mesh ref={burstRef} rotation={[Math.PI / 2, 0, 0]} material={burstMaterial}>
          <ringGeometry args={[0.95, 1, 64]} />
        </mesh>
      )}
      
      {/* Ambient glow from center */}
      <pointLight
        color="#7c3aed"
        intensity={1 + scrollProgress * 1.5}
        distance={12}
        decay={2}
        position={[0, 0, 0]}
      />
    </group>
  );
}

export default TrendConstellation;
