/**
 * SortingLanes - ACT IV: Negotiation & Formation (v4)
 * 
 * CHANGE: "Patterns are discovered, not forced."
 * - Negotiation Phase: Packets "seek" alignment before locking in.
 * - They wiggle/circle before snapping.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

const DUMMY_OBJ = new THREE.Object3D();
const DUMMY_COLOR = new THREE.Color();

const LANES = [
  { color: '#a78bfa', yOffset: 2, curve: 0.3 },
  { color: '#60a5fa', yOffset: 0.7, curve: -0.2 },
  { color: '#f472b6', yOffset: -0.5, curve: 0.4 },
  { color: '#34d399', yOffset: -1.8, curve: -0.3 },
];

function getLanePoint(lane, t) {
  const startZ = -4;
  const endZ = 6;
  const z = startZ + (endZ - startZ) * t;
  const curveX = Math.sin(t * Math.PI) * lane.curve * 3;
  const y = lane.yOffset + Math.sin(t * Math.PI * 2) * 0.2;
  return new THREE.Vector3(curveX, y, z);
}

export function SortingLanes({ scrollProgress = 0, visible = true }) {
  const meshRef = useRef();
  const isMobile = isMobileDevice();
  
  const particlesPerLane = isMobile ? 30 : 80;
  const totalCount = particlesPerLane * LANES.length;
  
  const { laneIndices, progressOffsets, colors, sizes, lateralOffsets } = useMemo(() => {
    const laneIndices = new Float32Array(totalCount);
    const progressOffsets = new Float32Array(totalCount);
    const colors = new Float32Array(totalCount * 3);
    const sizes = new Float32Array(totalCount);
    const lateralOffsets = new Float32Array(totalCount); // For seeking behavior
    
    let idx = 0;
    LANES.forEach((lane, laneIdx) => {
      const color = new THREE.Color(lane.color);
      for (let p = 0; p < particlesPerLane; p++) {
        laneIndices[idx] = laneIdx;
        progressOffsets[idx] = Math.random();
        sizes[idx] = 0.08 + Math.random() * 0.04;
        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;
        lateralOffsets[idx] = (Math.random() - 0.5) * 2; // Start wide
        idx++;
      }
    });
    
    return { laneIndices, progressOffsets, colors, sizes, lateralOffsets };
  }, [totalCount]);
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    const actProgress = Math.max(0, Math.min(1, (scrollProgress - 0.35) / 0.35));
    const visibility = Math.min(1, Math.max(0, 1 - (scrollProgress - 0.7) / 0.15));
    
    if (visibility <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    
    for (let i = 0; i < totalCount; i++) {
      const laneIdx = laneIndices[i];
      const lane = LANES[laneIdx];
      
      const flowProgress = (progressOffsets[i] + time * 0.15) % 1;
      
      // Calculate Lane Position
      const lanePos = getLanePoint(lane, flowProgress);
      
      // Negotiation: Early in the lane (near start), they are offset
      // As they progress (flowProgress), they snap tighter
      const negotiationFactor = Math.max(0, 1 - flowProgress * 1.5);
      const wobble = Math.sin(time * 5 + i) * 0.3 * negotiationFactor;
      
      const x = lanePos.x + lateralOffsets[i] * negotiationFactor + wobble;
      const y = lanePos.y + wobble * 0.5;
      const z = lanePos.z;
      
      DUMMY_OBJ.position.set(x, y, z);
      
      // Orientation:
      // Early: Look chaotically
      // Late: Look along path
      const lookAtPos = getLanePoint(lane, Math.min(1, flowProgress + 0.01));
      DUMMY_OBJ.lookAt(lookAtPos);
      
      if (negotiationFactor > 0.5) {
        // Still negotiating - adding random rotation noise
        DUMMY_OBJ.rotation.z += Math.sin(time * 10 + i) * 0.5;
      }
      
      const s = sizes[i] * (1 + flowProgress * 0.4);
      DUMMY_OBJ.scale.set(s, s, s * 1.5);
      
      DUMMY_OBJ.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY_OBJ.matrix);
      
      DUMMY_COLOR.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      meshRef.current.setColorAt(i, DUMMY_COLOR);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
    
    if (meshRef.current.material) {
      meshRef.current.material.opacity = visibility * 0.9;
    }
  });
  
  if (!visible) return null;
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, totalCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

export default SortingLanes;
