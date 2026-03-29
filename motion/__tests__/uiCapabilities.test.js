/**
 * Tests for motion utility functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  prefersReducedMotion, 
  isLowEndDevice, 
  isMobileDevice,
  getUICapabilities 
} from '../../motion/uiCapabilities';

describe('uiCapabilities', () => {
  beforeEach(() => {
    // Reset matchMedia mock
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  describe('prefersReducedMotion', () => {
    it('should return false by default', () => {
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should return true when user prefers reduced motion', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      }));
      
      expect(prefersReducedMotion()).toBe(true);
    });
  });

  describe('isMobileDevice', () => {
    it('should return false for desktop', () => {
      expect(isMobileDevice()).toBe(false);
    });

    it('should return true for mobile viewport', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 768px)',
        media: query,
      }));
      
      expect(isMobileDevice()).toBe(true);
    });
  });

  describe('getUICapabilities', () => {
    it('should return all capabilities enabled by default', () => {
      const caps = getUICapabilities();
      
      expect(caps.heavyMotion).toBe(true);
      expect(caps.smoothScroll).toBe(true);
      expect(caps.cursorEffects).toBe(true);
    });

    it('should disable heavy motion when reduced motion is preferred', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      }));
      
      const caps = getUICapabilities();
      
      expect(caps.heavyMotion).toBe(false);
      expect(caps.smoothScroll).toBe(false);
      expect(caps.reducedMotion).toBe(true);
    });
  });
});
