import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose, trends }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Reset search query when palette is opened/closed
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle keyboard shortcuts within the palette
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  const filteredTrends = useMemo(() => {
    if (!searchQuery) return [];
    const searchLower = searchQuery.toLowerCase();
    return trends.filter(trend =>
      trend.keyword.toLowerCase().includes(searchLower) ||
      (trend.category && trend.category.toLowerCase().includes(searchLower))
    ).slice(0, 10); // Limit results
  }, [searchQuery, trends]);

  const handleSelectTrend = (trendId) => {
      navigate(`/trend/${trendId}`);
      onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-gray-900/80 border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl shadow-purple-500/10"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="flex items-center p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search trends, keywords, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
            />
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {searchQuery && filteredTrends.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                    <p>No results found for "{searchQuery}"</p>
                </div>
            )}
            {searchQuery && filteredTrends.length > 0 && (
                <ul>
                    <li className="px-2 py-1 text-xs text-gray-400 uppercase font-semibold">Trends</li>
                    {filteredTrends.map(trend => (
                        <li
                            key={trend.id}
                            onClick={() => handleSelectTrend(trend.id)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center">
                                <Hash className="w-4 h-4 text-gray-500 mr-3" />
                                <span className="text-white">{trend.keyword}</span>
                                <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">{trend.category}</span>
                            </div>
                            <span className="text-sm text-gray-400">View Details</span>
                        </li>
                    ))}
                </ul>
            )}
             {!searchQuery && (
                <div className="text-center text-gray-500 py-12">
                    <p>Start typing to search for trends.</p>
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
