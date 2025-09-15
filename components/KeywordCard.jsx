import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Search } from 'lucide-react';

const formatVolume = (volume) => {
    if (typeof volume === 'number') {
        if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
        if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
        if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
        return volume.toString();
    }
    return volume;
};

const KeywordCard = ({ keyword, volume, growth, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
    >
      <div className="flex items-center">
        <div className="p-2 bg-gray-700 rounded-md mr-4">
            <Search className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-white font-semibold">{keyword}</p>
          <div className="flex items-center text-gray-400 text-sm mt-1">
            <BarChart2 className="w-3 h-3 mr-1.5" />
            <span>{formatVolume(volume)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-green-400 text-sm font-semibold">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>{growth}</span>
      </div>
    </motion.div>
  );
};

export default KeywordCard;
