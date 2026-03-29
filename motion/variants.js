/**
 * Motion System - Variants
 * Reusable animation variants for Framer Motion.
 * Use these with `variants` prop on motion components.
 */

import { defaultTransition, springTransition, fastTransition } from './transitions';

// Fade in/out
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0,
    transition: fastTransition,
  },
};

// Slide up with fade
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: fastTransition,
  },
};

// Slide down with fade
export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: fastTransition,
  },
};

// Scale with fade (for modals, cards)
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: fastTransition,
  },
};

// Stagger children container
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Child item for stagger
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
};

// Hover scale effect
export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: springTransition,
  },
  tap: { 
    scale: 0.98,
    transition: fastTransition,
  },
};

// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3 },
  },
};

// Sidebar collapse
export const sidebarVariants = {
  expanded: { width: 256 },
  collapsed: { width: 80 },
};

// Tooltip/Popover
export const popoverVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: springTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.15 },
  },
};
