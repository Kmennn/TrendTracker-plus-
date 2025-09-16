import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendAtlas = ({ regions, onRegionClick }) => {
  const getGrowthIndicator = (growth) => {
    const value = parseInt(growth);
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getInterestColor = (interest) => {
    const intensity = Math.min(interest / 100, 1);
    const hue = 270 - intensity * 60; // Purple to Pink/Red
    return `hsl(${hue}, 90%, 65%)`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {regions.map((region, index) => (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03, boxShadow: '0px 0px 25px rgba(139, 92, 246, 0.5)' }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 cursor-pointer transition-all duration-300 ease-in-out group"
          onClick={() => onRegionClick(region)}
        >
          <div 
            className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at top, ${getInterestColor(region.interest)}, transparent 70%)`,
            }}
          />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-white text-md">{region.name}</h3>
              <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full">
                  {getGrowthIndicator(region.growth)}
                  <span className="text-xs font-semibold text-white">{region.growth}</span>
              </div>
            </div>
            <div className="text-sm text-gray-300">Interest: {region.interest}/100</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #8b5cf6, ${getInterestColor(region.interest)})`}}
                initial={{ width: 0 }}
                animate={{ width: `${region.interest}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrendAtlas;
