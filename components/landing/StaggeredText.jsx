/**
 * StaggeredText - Line-by-line text entrance animation
 * Creates cinematic reveal effect
 */

import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../motion/uiCapabilities';

export function StaggeredText({ 
  children, 
  className = '',
  as = 'div',
  delay = 0,
  staggerDelay = 0.1,
  direction = 'up', // 'up' | 'down' | 'left' | 'right'
}) {
  const reducedMotion = prefersReducedMotion();
  const MotionComponent = motion[as] || motion.div;
  
  // Convert children to array of lines
  const lines = React.Children.toArray(children);
  
  // Direction offsets
  const offsets = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  };
  
  const offset = offsets[direction];
  
  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0 : staggerDelay,
      },
    },
  };
  
  // Line variants
  const lineVariants = {
    hidden: { 
      opacity: 0, 
      y: reducedMotion ? 0 : offset.y,
      x: reducedMotion ? 0 : offset.x,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
      },
    },
  };
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, index) => (
        <MotionComponent
          key={index}
          variants={lineVariants}
          className="block"
        >
          {line}
        </MotionComponent>
      ))}
    </motion.div>
  );
}

/**
 * StaggeredHeading - Pre-configured for headings
 */
export function StaggeredHeading({ 
  children, 
  className = '',
  delay = 0 
}) {
  // Split text by line breaks or create single line
  const text = typeof children === 'string' ? children : '';
  const lines = text.split('\n').filter(Boolean);
  
  if (lines.length === 0) {
    return (
      <StaggeredText className={className} delay={delay}>
        {children}
      </StaggeredText>
    );
  }
  
  return (
    <StaggeredText className={className} delay={delay} staggerDelay={0.15}>
      {lines.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </StaggeredText>
  );
}

export default StaggeredText;
