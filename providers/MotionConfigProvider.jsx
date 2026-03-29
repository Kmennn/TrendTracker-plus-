/**
 * MotionConfigProvider
 * Provides motion capabilities context to the entire app.
 * Components can use this to conditionally enable/disable animations.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUICapabilities } from '../motion/uiCapabilities';

const MotionConfigContext = createContext(getUICapabilities());

export const useMotionConfig = () => useContext(MotionConfigContext);

const MotionConfigProvider = ({ children }) => {
  const [capabilities, setCapabilities] = useState(getUICapabilities());

  useEffect(() => {
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setCapabilities(getUICapabilities());
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Also listen for resize to update mobile state
    window.addEventListener('resize', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return (
    <MotionConfigContext.Provider value={capabilities}>
      {children}
    </MotionConfigContext.Provider>
  );
};

export default MotionConfigProvider;
