/**
 * Motion System - UI Capabilities
 * Performance configuration and feature flags.
 */

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check for low-end device (rough heuristic)
export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for low memory
  const memory = navigator.deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check for slow CPU (hardware concurrency)
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return true;
  
  return false;
};

// Check if mobile device
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
};

// Main capabilities configuration
export const getUICapabilities = () => {
  const reducedMotion = prefersReducedMotion();
  const lowEnd = isLowEndDevice();
  const mobile = isMobileDevice();

  return {
    // Enable heavy animations (parallax, complex transitions)
    heavyMotion: !reducedMotion && !lowEnd,
    
    // Enable 3D canvas rendering
    enable3D: !reducedMotion && !lowEnd && !mobile,
    
    // Enable smooth scrolling
    smoothScroll: !reducedMotion,
    
    // Enable cursor effects
    cursorEffects: !reducedMotion && !mobile,
    
    // Device flags
    reducedMotion,
    lowEnd,
    mobile,
  };
};

// Default export for easy access
const uiCapabilities = getUICapabilities();
export default uiCapabilities;
