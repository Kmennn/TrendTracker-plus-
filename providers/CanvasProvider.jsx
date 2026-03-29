/**
 * CanvasProvider
 * Provides a React Three Fiber canvas layer for future 3D backgrounds.
 * Currently renders nothing (empty canvas) — this is a readiness layer.
 */

import React, { createContext, useContext, useState } from 'react';
import { getUICapabilities } from '../motion/uiCapabilities';

const CanvasContext = createContext({
  isEnabled: false,
  setScene: () => {},
});

export const useCanvas = () => useContext(CanvasContext);

const CanvasProvider = ({ children }) => {
  const [currentScene, setCurrentScene] = useState(null);
  const capabilities = getUICapabilities();

  // Only enable canvas on capable devices
  const isEnabled = capabilities.enable3D;

  const value = {
    isEnabled,
    currentScene,
    setScene: setCurrentScene,
  };

  return (
    <CanvasContext.Provider value={value}>
      {/* 
        3D Canvas Layer (Background) - Currently Empty
        When enabled, this will render behind the UI layer.
        
        The actual Canvas component will be rendered here when needed:
        {isEnabled && currentScene && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas>
              {currentScene}
            </Canvas>
          </div>
        )}
      */}
      
      {/* UI Layer (Foreground) */}
      <div className="relative z-10">
        {children}
      </div>
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
