import React from 'react';
import { motion } from 'framer-motion';
import './DataNebula.css';

const Orb = ({ region, index, onClick }) => {
  const growthValue = parseInt(region.growth, 10);

  const getGlowColor = (growth) => {
    if (growth >= 25) return '#3b82f6'; // blue-500
    if (growth >= 15) return '#60a5fa'; // blue-400
    if (growth > 0) return '#a855f7'; // purple-600
    return '#6b7280'; // gray-500
  };

  const glowColor = getGlowColor(growthValue);
  const animationDuration = 3 + (30 - growthValue) / 10;
  const isHotspot = growthValue >= 20;

  return (
    <motion.div
      className="orb-container"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      onClick={() => onClick(region)}
    >
      <motion.div
        className="orb-body"
        style={{ '--glow-color': glowColor, background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        animate={{ animation: `breathe ${animationDuration}s infinite ease-in-out` }}
        whileHover={{ scale: 1.15 }}
      >
        {isHotspot && (
          <div className="sparkle-wrapper">
            {[...Array(5)].map((_, i) => <div key={i} className="sparkle" style={{ '--glow-color': glowColor }} />)}
          </div>
        )}
        <div className="orb-interest">{region.interest}</div>
        <div className="orb-growth" style={{ color: growthValue < 0 ? '#fca5a5' : '#86efac' }}>
          {region.growth}
        </div>
      </motion.div>
      <div className="orb-name">{region.name}</div>
    </motion.div>
  );
};

const DataNebula = ({ data, onRegionClick }) => {
  return (
    <div className="data-nebula">
      {data.map((region, i) => (
        <Orb key={region.id} region={region} index={i} onClick={onRegionClick} />
      ))}
    </div>
  );
};

export default DataNebula;
