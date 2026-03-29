/**
 * LandingCanvas - Persistent fixed 3D canvas for landing page
 * Uses React Three Fiber with performance optimizations
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import CosmicScene from './CosmicScene';
import { isMobileDevice, isLowEndDevice } from '../../motion/uiCapabilities';

export function LandingCanvas({ 
  cameraPosition = [0, 0, 10],
  cameraLookAt = [0, 0, 0],
  cursorX = 0,
  cursorY = 0,
  scrollProgress = 0 
}) {
  const isMobile = isMobileDevice();
  const isLowEnd = isLowEndDevice();
  
  // Performance settings based on device
  const dpr = isMobile || isLowEnd ? [1, 1.5] : [1, 2];
  const frameloop = isMobile ? 'demand' : 'always';
  
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{ 
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #030712 0%, #0f0a1e 50%, #030712 100%)'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 60,
          near: 0.1,
          far: 100 
        }}
        dpr={dpr}
        frameloop={frameloop}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <Suspense fallback={null}>
          <CosmicScene
            cameraPosition={cameraPosition}
            cameraLookAt={cameraLookAt}
            cursorX={cursorX}
            cursorY={cursorY}
            scrollProgress={scrollProgress}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default LandingCanvas;
