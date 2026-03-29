/**
 * useCursorParallax - Subtle cursor-driven parallax effect
 * Desktop only, respects reduced motion preferences
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { isMobileDevice, prefersReducedMotion } from '../motion/uiCapabilities';

/**
 * Hook to track cursor position for parallax effects
 * @param {Object} options
 * @param {number} options.intensity - Parallax intensity (0-1)
 * @param {number} options.smoothing - Smoothing factor (0-1, lower = smoother)
 * @returns {Object} Normalized cursor position (-1 to 1) and raw position
 */
export function useCursorParallax({ intensity = 0.5, smoothing = 0.1 } = {}) {
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isActive: false,
  });
  
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  const isDisabled = isMobile || reducedMotion;
  
  const lerp = (start, end, t) => start + (end - start) * t;
  
  const animate = useCallback(() => {
    // Smooth lerp towards target
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, smoothing);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, smoothing);
    
    setCursor(prev => ({
      ...prev,
      normalizedX: currentRef.current.x * intensity,
      normalizedY: currentRef.current.y * intensity,
    }));
    
    rafRef.current = requestAnimationFrame(animate);
  }, [intensity, smoothing]);
  
  useEffect(() => {
    if (isDisabled) {
      setCursor({
        x: 0,
        y: 0,
        normalizedX: 0,
        normalizedY: 0,
        isActive: false,
      });
      return;
    }
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize to -1 to 1 range
      const normalizedX = (clientX / innerWidth) * 2 - 1;
      const normalizedY = (clientY / innerHeight) * 2 - 1;
      
      targetRef.current = { x: normalizedX, y: normalizedY };
      
      setCursor(prev => ({
        ...prev,
        x: clientX,
        y: clientY,
        isActive: true,
      }));
    };
    
    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      setCursor(prev => ({ ...prev, isActive: false }));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDisabled, animate]);
  
  return {
    ...cursor,
    isDisabled,
  };
}

export default useCursorParallax;
