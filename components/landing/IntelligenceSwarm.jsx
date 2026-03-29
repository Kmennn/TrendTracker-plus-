/**
 * IntelligenceSwarm - The Final Locked Cinema Engine
 * 
 * NOT a creature. NOT a pipeline. NOT chaos.
 * 
 * A single abstract form made of soft square micro-tiles.
 * Tiles reduce from 120 → 72 → 36 → 9 as intelligence forms.
 * 
 * Motion earns stillness. Stillness is the payoff.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { isMobileDevice } from '../../motion/uiCapabilities';

// ============================================
// LOCKED CONSTANTS (DO NOT CHANGE)
// ============================================

// Tile counts per act
const TILE_COUNTS = {
  hero: 120,      // Raw signals
  features: 72,   // Filtering
  useCases: 36,   // Analysis
  insight: 9,     // Final clarity (3x3)
};

// Scroll zones
const SCROLL_ZONES = {
  hero: { start: 0, end: 0.20 },
  features: { start: 0.20, end: 0.45 },
  useCases: { start: 0.45, end: 0.70 },
  insight: { start: 0.70, end: 1.00 },
};

// Camera Z per act
const CAMERA_Z = {
  hero: 14,
  features: 10,
  useCases: 7,
  insight: 5.2,
};

// Colors (LOCKED - Violet spectrum only)
const COLORS = {
  background: '#050814',
  rawSignal: new THREE.Color('#6366f1').multiplyScalar(0.4),   // Muted lavender
  attention: new THREE.Color('#818cf8').multiplyScalar(0.7),   // Soft periwinkle
  intelligence: new THREE.Color('#a78bfa'),                     // Clear violet
  insight: new THREE.Color('#c4b5fd'),                          // Electric purple
};

// Easing function (LOCKED)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ============================================
// 9-TILE INSIGHT CLUSTER (3x3 GRID)
// ============================================
function getInsightGridPositions() {
  const positions = [];
  const gap = 0.35;
  const size = 1.0;
  const offset = (size + gap);
  
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      positions.push({
        x: col * offset,
        y: row * offset,
        z: 0,
        isCenter: row === 0 && col === 0,
        isCorner: Math.abs(row) === 1 && Math.abs(col) === 1,
      });
    }
  }
  
  return positions;
}

const INSIGHT_GRID = getInsightGridPositions();

// ============================================
// TILE COMPONENT (Soft Square)
// ============================================
const TILE_GEOMETRY = new THREE.PlaneGeometry(0.8, 0.8);
// Round corners via shader or accept flat for now (flat is cleaner)

const DUMMY_OBJ = new THREE.Object3D();
const DUMMY_COLOR = new THREE.Color();

export function IntelligenceSwarm({ scrollProgress = 0 }) {
  const meshRef = useRef();
  const { camera } = useThree();
  const isMobile = isMobileDevice();
  
  const maxTiles = isMobile ? 60 : TILE_COUNTS.hero;
  
  // Initialize tile positions (scattered for chaos)
  const initialPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < maxTiles; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return positions;
  }, [maxTiles]);
  
  // Calculate current act and local progress
  const getActProgress = (scroll) => {
    if (scroll < SCROLL_ZONES.features.start) {
      return { act: 'hero', localProgress: scroll / SCROLL_ZONES.hero.end };
    } else if (scroll < SCROLL_ZONES.useCases.start) {
      return { act: 'features', localProgress: (scroll - SCROLL_ZONES.features.start) / (SCROLL_ZONES.features.end - SCROLL_ZONES.features.start) };
    } else if (scroll < SCROLL_ZONES.insight.start) {
      return { act: 'useCases', localProgress: (scroll - SCROLL_ZONES.useCases.start) / (SCROLL_ZONES.useCases.end - SCROLL_ZONES.useCases.start) };
    } else {
      return { act: 'insight', localProgress: (scroll - SCROLL_ZONES.insight.start) / (SCROLL_ZONES.insight.end - SCROLL_ZONES.insight.start) };
    }
  };
  
  // Ref for pulse timing
  const lastPulseTime = useRef(0);
  const pulseOpacity = useRef(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const { act, localProgress } = getActProgress(scrollProgress);
    const easedProgress = easeOutCubic(Math.min(1, localProgress));
    
    // ============================================
    // CAMERA CONTROL (Z-axis only, locked after 70%)
    // ============================================
    let targetZ;
    if (act === 'hero') {
      targetZ = THREE.MathUtils.lerp(CAMERA_Z.hero, CAMERA_Z.features, easedProgress);
    } else if (act === 'features') {
      targetZ = THREE.MathUtils.lerp(CAMERA_Z.features, CAMERA_Z.useCases, easedProgress);
    } else if (act === 'useCases') {
      targetZ = THREE.MathUtils.lerp(CAMERA_Z.useCases, CAMERA_Z.insight, easedProgress);
    } else {
      targetZ = CAMERA_Z.insight; // LOCKED
    }
    
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
    camera.lookAt(0, 0, 0);
    
    // ============================================
    // TILE COUNT INTERPOLATION
    // ============================================
    let targetCount;
    if (act === 'hero') {
      targetCount = Math.round(THREE.MathUtils.lerp(TILE_COUNTS.hero, TILE_COUNTS.features, easedProgress));
    } else if (act === 'features') {
      targetCount = Math.round(THREE.MathUtils.lerp(TILE_COUNTS.features, TILE_COUNTS.useCases, easedProgress));
    } else if (act === 'useCases') {
      targetCount = Math.round(THREE.MathUtils.lerp(TILE_COUNTS.useCases, TILE_COUNTS.insight, easedProgress));
    } else {
      targetCount = TILE_COUNTS.insight;
    }
    targetCount = Math.min(targetCount, maxTiles);
    
    // ============================================
    // STILLNESS LOCK (After 70% scroll)
    // ============================================
    const isStillnessPhase = scrollProgress >= 0.70;
    
    // Pulse timing for insight (one pulse every 6-8 seconds)
    if (isStillnessPhase) {
      if (time - lastPulseTime.current > 7) {
        lastPulseTime.current = time;
        pulseOpacity.current = 1;
      }
      pulseOpacity.current *= 0.98; // Slow decay
    }
    
    // ============================================
    // TILE POSITIONING
    // ============================================
    for (let i = 0; i < maxTiles; i++) {
      const init = initialPositions[i];
      const visible = i < targetCount;
      
      let x, y, z, opacity;
      
      if (isStillnessPhase && i < 9) {
        // INSIGHT: 3x3 Grid locked positions
        const gridPos = INSIGHT_GRID[i];
        x = gridPos.x;
        y = gridPos.y;
        z = 0;
        
        // Opacity hierarchy
        if (gridPos.isCenter) {
          opacity = 0.95 + pulseOpacity.current * 0.05;
        } else if (gridPos.isCorner) {
          opacity = 0.75;
        } else {
          opacity = 0.85;
        }
      } else if (visible) {
        // Gradual clustering toward center
        const clusterStrength = easedProgress * 0.8;
        x = THREE.MathUtils.lerp(init.x, init.x * 0.3, clusterStrength);
        y = THREE.MathUtils.lerp(init.y, init.y * 0.3, clusterStrength);
        z = THREE.MathUtils.lerp(init.z, 0, clusterStrength);
        
        // Minimal drift (ONLY in non-stillness phase)
        if (!isStillnessPhase) {
          const drift = Math.sin(time * 0.3 + init.phase) * 0.1 * (1 - easedProgress);
          x += drift;
          y += drift;
        }
        
        opacity = 0.3 + easedProgress * 0.5;
      } else {
        // Hidden
        x = 0;
        y = 0;
        z = -100; // Far away
        opacity = 0;
      }
      
      // Update instance
      DUMMY_OBJ.position.set(x, y, z);
      DUMMY_OBJ.rotation.set(0, 0, 0); // NO ROTATION (Locked)
      DUMMY_OBJ.scale.setScalar(visible ? 1 : 0);
      DUMMY_OBJ.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY_OBJ.matrix);
      
      // Color interpolation
      let color;
      if (act === 'hero') {
        color = COLORS.rawSignal;
      } else if (act === 'features') {
        color = COLORS.attention.clone().lerp(COLORS.intelligence, easedProgress);
      } else if (act === 'useCases') {
        color = COLORS.intelligence;
      } else {
        color = COLORS.insight;
      }
      
      DUMMY_COLOR.copy(color);
      meshRef.current.setColorAt(i, DUMMY_COLOR);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });
  
  return (
    <group>
      <instancedMesh ref={meshRef} args={[TILE_GEOMETRY, null, maxTiles]}>
        <meshBasicMaterial
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
      
      {/* Ambient light (minimal) */}
      <ambientLight intensity={0.05} />
    </group>
  );
}

export default IntelligenceSwarm;
