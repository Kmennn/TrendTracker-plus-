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
      className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg hover:border-purple-500/50 transition-colors duration-200 group"
    >
      <div className="flex items-center">
        <div className="p-2 bg-gray-900/50 rounded-md mr-4 border border-white/10 group-hover:border-purple-500/50">
            <Search className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </div>
        <div>
          <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">{keyword}</p>
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
