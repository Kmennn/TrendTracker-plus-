/**
 * Motion System - Easing Curves
 * Custom easing functions for consistent animation feel across the app.
 */

// Smooth, natural feeling curves
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeOutQuart = [0.25, 1, 0.5, 1];
export const easeInOutQuart = [0.76, 0, 0.24, 1];

// Snappy, responsive curves
export const easeOutBack = [0.34, 1.56, 0.64, 1];
export const easeInOutBack = [0.68, -0.6, 0.32, 1.6];

// Gentle, subtle curves
export const easeOutSine = [0.61, 1, 0.88, 1];
export const easeInOutSine = [0.37, 0, 0.63, 1];

// Default curve for most animations
export const defaultEasing = easeOutQuart;

// CSS-friendly versions
export const cssEaseOutExpo = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const cssEaseOutQuart = 'cubic-bezier(0.25, 1, 0.5, 1)';
export const cssEaseInOutQuart = 'cubic-bezier(0.76, 0, 0.24, 1)';
