/**
 * MagneticButton - CTA button with magnetic hover effect
 * Subtle pull towards cursor on hover
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { isMobileDevice } from '../../motion/uiCapabilities';

export function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary', // 'primary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  ...props 
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isMobile = isMobileDevice();
  
  const handleMouseMove = (e) => {
    if (isMobile || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull (subtle)
    const x = (e.clientX - centerX) * 0.15;
    const y = (e.clientY - centerY) * 0.15;
    
    setPosition({ x, y });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-600 to-blue-600
      hover:from-purple-500 hover:to-blue-500
      text-white font-semibold
      shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
    `,
    outline: `
      border-2 border-purple-400/60 hover:border-purple-400
      text-purple-300 hover:text-white
      bg-white/[0.02] hover:bg-purple-500/10
    `,
  };
  
  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-xl
        font-medium transition-all duration-200
        flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="w-5 h-5">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}

export default MagneticButton;
