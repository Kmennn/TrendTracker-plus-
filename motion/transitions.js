/**
 * Motion System - Transitions
 * Standard transition configurations for Framer Motion.
 */

import { easeOutQuart, easeOutExpo, easeInOutQuart } from './easing';

// Default transition for most UI elements
export const defaultTransition = {
  duration: 0.4,
  ease: easeOutQuart,
};

// Fast transition for quick feedback
export const fastTransition = {
  duration: 0.2,
  ease: easeOutQuart,
};

// Slow transition for emphasis
export const slowTransition = {
  duration: 0.6,
  ease: easeOutExpo,
};

// Spring transition for playful elements
export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

// Soft spring for gentle movements
export const softSpringTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Page transition
export const pageTransition = {
  duration: 0.5,
  ease: easeInOutQuart,
};

// Inertia for drag/scroll
export const inertiaTransition = {
  type: 'inertia',
  velocity: 50,
  power: 0.8,
  timeConstant: 700,
};
