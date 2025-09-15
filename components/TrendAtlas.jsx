import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendAtlas = ({ regions, onRegionClick }) => {
  const getGrowthIndicator = (growth) => {
    if (growth.startsWith('+')) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (growth.startsWith('-')) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getInterestColor = (interest) => {
    const intensity = Math.min(interest / 100, 1);
    const hue = 240 + (1 - intensity) * 120; // from blue to purple/pink
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {regions.map((region, index) => (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-lg p-4 cursor-pointer border border-gray-700 hover:border-purple-500"
          style={{
            background: `radial-gradient(circle, ${getInterestColor(region.interest)} 10%, #1F2937 80%)`,
          }}
          onClick={() => onRegionClick(region)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white mb-2">{region.name}</h3>
            <div className="flex items-center space-x-1">
                {getGrowthIndicator(region.growth)}
                <span className="text-sm font-semibold text-white">{region.growth}</span>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            Interest: {region.interest}/100
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrendAtlas;
