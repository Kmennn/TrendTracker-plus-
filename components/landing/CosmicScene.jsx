/**
 * CosmicScene - Curated.Media Inspired Full Scene
 * 
 * Creates the immersive purple floral environment:
 * - Large hummingbird as centerpiece
 * - Dense floral environment
 * - Bright purple atmospheric lighting
 */

import React from 'react';
import PremiumBird from './PremiumBird';
import FloralDepth from './FloralDepth';

export function CosmicScene({ 
  scrollProgress = 0 
}) {
  return (
    <>
      {/* Floral environment (fills the scene) */}
      <FloralDepth scrollProgress={scrollProgress} />
      
      {/* Main hummingbird - LARGE and CENTER-RIGHT like curated.media */}
      <PremiumBird 
        position={[2, 0, 0]} 
        scale={1.8}  // Large and prominent
        scrollProgress={scrollProgress}
      />
      
      {/* Background - Bright purple (NOT black) */}
      <color attach="background" args={['#1e1b4b']} />
      
      {/* Purple atmospheric fog */}
      <fog attach="fog" args={['#4c1d95', 3, 20]} />
      
      {/* Strong ambient light (purple atmosphere) */}
      <ambientLight intensity={0.8} color="#a78bfa" />
      
      {/* Key light from top-right (creates the glow) */}
      <directionalLight 
        position={[8, 8, 2]} 
        intensity={1.2} 
        color="#ddd6fe"
      />
      
      {/* Rim light (back lighting) */}
      <pointLight 
        position={[0, 5, -8]} 
        intensity={2} 
        color="#8b5cf6" 
        distance={25}
      />
      
      {/* Fill light from left */}
      <pointLight 
        position={[-10, 2, 0]} 
        intensity={1} 
        color="#c4b5fd" 
        distance={20}
      />
      
      {/* Strong purple glow from below */}
      <pointLight 
        position={[0, -5, -5]} 
        intensity={1.5} 
        color="#7c3aed" 
        distance={15}
      />
    </>
  );
}

export default CosmicScene;
