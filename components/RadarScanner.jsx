import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioTower } from 'lucide-react';
import './RadarScanner.css';

const RadarScanner = ({ activePlatform, trends, theme }) => {
  const [identifiedIndex, setIdentifiedIndex] = useState(0);
  const [sweepAngle, setSweepAngle] = useState(0);

  const dotPositions = useMemo(() => {
    return trends.map((_, index) => {
      const angle = (index / trends.length) * 360;
      const radius = 25 + Math.random() * 20;
      const x = 50 + radius * Math.cos((angle - 90) * (Math.PI / 180));
      const y = 50 + radius * Math.sin((angle - 90) * (Math.PI / 180));
      return { top: `${y}%`, left: `${x}%`, angle };
    });
  }, [trends]);

  useEffect(() => {
    if (trends.length === 0) return;
    const sweepInterval = setInterval(() => {
        setSweepAngle(prev => (prev + 0.5) % 360);
    }, 16);

    const trendInterval = setInterval(() => {
        setIdentifiedIndex(prev => (prev + 1) % trends.length);
    }, 3000);

    return () => {
        clearInterval(sweepInterval);
        clearInterval(trendInterval);
    }
  }, [trends.length]);

  const identifiedTrend = trends[identifiedIndex];

  return (
    <motion.div 
      className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center h-full text-center"
    >
      <div className="w-72 h-72 relative mb-6">
        <div className="absolute inset-0 border-2 border-white/10 rounded-full p-2">
            <div className="w-full h-full border border-white/10 rounded-full" />
        </div>

        <div className="radar-grid" />

        <div className="radar-container">
            <div className="radar-circle" style={{ borderColor: theme.radar, animationDelay: '0s' }}></div>
            <div className="radar-circle" style={{ borderColor: theme.radar, animationDelay: '-1.6s' }}></div>
            <div className="radar-circle" style={{ borderColor: theme.radar, animationDelay: '-3.2s' }}></div>
        </div>

        <motion.div 
            className="radar-sweep"
            style={{ 
                rotate: sweepAngle,
                background: `conic-gradient(from ${sweepAngle}deg at 50% 50%, transparent 0%, ${theme.radar}10 20%, ${theme.radar}40 30%, transparent 40%)`
            }}
        />

        {dotPositions.map((pos, index) => (
            <motion.div
                key={trends[index].id}
                className="absolute"
                style={{ top: pos.top, left: pos.left }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
            >
                <motion.div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ 
                        backgroundColor: theme.radar,
                        boxShadow: `0 0 10px ${theme.radar}`,
                    }}
                    animate={{ 
                        scale: identifiedIndex === index ? 1.5 : 1,
                        boxShadow: identifiedIndex === index ? `0 0 14px ${theme.radar}` : `0 0 10px ${theme.radar}`
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                />
            </motion.div>
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <RadioTower size={48} style={{ color: theme.radar, filter: `drop-shadow(0 0 8px ${theme.radar})` }} />
            </motion.div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">Scanning For Trends...</h3>
      <p className="text-gray-400 mb-4">
        Platform: <span style={{ color: theme.radar }}>{theme.name}</span>
      </p>

      <div className="h-12 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
            <motion.div
                key={identifiedTrend?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`font-semibold text-lg`}
                style={{ color: theme.radar }}
            >
                {identifiedTrend?.title}
            </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RadarScanner;