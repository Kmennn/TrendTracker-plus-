/**
 * useScrollCamera - Maps Lenis scroll progress to camera position
 * 
 * CINEMA MODE: Camera travels THROUGH the intelligence pipeline
 * ACT I:   Wide shot, chaos
 * ACT II:  Move forward, pass through filter
 * ACT III: Fly alongside streams
 * ACT IV:  Slow approach to cores
 * ACT V:   Center on dominant insight
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { isMobileDevice, prefersReducedMotion } from '../motion/uiCapabilities';

// Cinema camera keyframes - forward journey through intelligence
const CAMERA_KEYFRAMES = [
  // ACT I: Chaos - Wide shot, slightly back
  { progress: 0.0, position: [0, 0.5, 12], lookAt: [0, 0, 0] },
  
  // ACT II: Selection - Move forward, through the filter
  { progress: 0.2, position: [0, 0, 8], lookAt: [0, 0, -2] },
  
  // ACT III: Flow - Fly alongside streams
  { progress: 0.4, position: [1, -0.3, 5], lookAt: [0, 0, -1] },
  { progress: 0.6, position: [-0.5, 0.2, 3], lookAt: [0, 0, 0] },
  
  // ACT IV: Convergence - Approach cores
  { progress: 0.8, position: [0.3, 0, 2], lookAt: [0, 0.2, 0] },
  
  // ACT V: Clarity - Center on insight
  { progress: 1.0, position: [0, 0.2, 2.5], lookAt: [0, 0.3, 0] },
];

/**
 * Linearly interpolate between two values
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Interpolate between two Vector3-like arrays
 */
function lerpVector(v1, v2, t) {
  return [
    lerp(v1[0], v2[0], t),
    lerp(v1[1], v2[1], t),
    lerp(v1[2], v2[2], t),
  ];
}

/**
 * Get camera state at a given scroll progress
 */
function getCameraAtProgress(progress) {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));
  
  // Find surrounding keyframes
  let startFrame = CAMERA_KEYFRAMES[0];
  let endFrame = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (p >= CAMERA_KEYFRAMES[i].progress && p <= CAMERA_KEYFRAMES[i + 1].progress) {
      startFrame = CAMERA_KEYFRAMES[i];
      endFrame = CAMERA_KEYFRAMES[i + 1];
      break;
    }
  }
  
  // Calculate local progress between keyframes
  const range = endFrame.progress - startFrame.progress;
  const localProgress = range > 0 ? (p - startFrame.progress) / range : 0;
  
  // Ease the progress (smooth step)
  const easedProgress = localProgress * localProgress * (3 - 2 * localProgress);
  
  return {
    position: lerpVector(startFrame.position, endFrame.position, easedProgress),
    lookAt: lerpVector(startFrame.lookAt, endFrame.lookAt, easedProgress),
  };
}

/**
 * Hook to get camera position based on scroll
 * @param {Object} lenisRef - Reference to Lenis instance
 * @returns {Object} Camera position and target
 */
export function useScrollCamera(lenisRef) {
  const [camera, setCamera] = useState({
    position: CAMERA_KEYFRAMES[0].position,
    lookAt: CAMERA_KEYFRAMES[0].lookAt,
    progress: 0,
  });
  
  const rafRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  
  // Smooth interpolation factor
  const SMOOTHING = 0.08;
  
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  const animate = useCallback(() => {
    // Lerp towards target
    currentProgressRef.current = lerp(
      currentProgressRef.current,
      targetProgressRef.current,
      SMOOTHING
    );
    
    const cameraState = getCameraAtProgress(currentProgressRef.current);
    
    setCamera({
      ...cameraState,
      progress: currentProgressRef.current,
    });
    
    rafRef.current = requestAnimationFrame(animate);
  }, []);
  
  useEffect(() => {
    // Disable on mobile or reduced motion
    if (isMobile || reducedMotion) {
      setCamera({
        position: CAMERA_KEYFRAMES[0].position,
        lookAt: CAMERA_KEYFRAMES[0].lookAt,
        progress: 0,
      });
      return;
    }
    
    const lenis = lenisRef?.current;
    if (!lenis) return;
    
    const handleScroll = ({ progress }) => {
      targetProgressRef.current = progress;
    };
    
    lenis.on('scroll', handleScroll);
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      lenis.off('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lenisRef, animate, isMobile, reducedMotion]);
  
  return camera;
}

export default useScrollCamera;
