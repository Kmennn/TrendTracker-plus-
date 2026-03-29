import React from 'react';
import { motion } from 'framer-motion';
import { RadioTower } from 'lucide-react';

const EmptyState = ({ message, description, actionLabel, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-black/20 border border-white/5 relative overflow-hidden"
    >
      {/* Animated Background Ripples */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-32 h-32 rounded-full border border-purple-500/50"
        />
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute w-32 h-32 rounded-full border border-blue-500/50"
        />
      </div>

      <div className="relative z-10 mb-6 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <RadioTower className="w-10 h-10 text-purple-400" />
      </div>

      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200 mb-2">
        {message}
      </h3>
      
      <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <button 
          onClick={onAction}
          className="bg-white text-gray-900 hover:bg-purple-50 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
