/**
 * GlassCard - Glassmorphism card component
 * Creates depth illusion over 3D background
 */

import React from 'react';
import { motion } from 'framer-motion';

export function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  padding = 'p-8',
  blur = 'backdrop-blur-xl',
  ...props 
}) {
  const baseClasses = `
    relative overflow-hidden rounded-2xl 
    bg-white/[0.06] border border-white/[0.08]
    ${blur} ${padding}
  `;
  
  const hoverClasses = hover ? `
    hover:bg-white/[0.08] hover:border-white/[0.12]
    transition-all duration-300
  ` : '';
  
  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default GlassCard;
