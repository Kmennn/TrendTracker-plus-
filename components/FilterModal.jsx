import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaturity, setSelectedMaturity] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Last 24 hours');
  const [selectedSentiment, setSelectedSentiment] = useState(null);
  const [minVolume, setMinVolume] = useState('');

  const categories = ['Technology', 'Health', 'Finance', 'Gaming', 'AI', 'Web3'];
  const maturityLevels = ['Emerging', 'Growing', 'Mature', 'Early'];
  const sentiments = ['Positive', 'Negative', 'Neutral'];

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      maturity: selectedMaturity,
      timePeriod: selectedTimePeriod,
      sentiment: selectedSentiment,
      minVolume: Number(minVolume) || 0,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 rounded-xl w-full max-w-3xl shadow-lg border border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Advanced Filters</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Categories</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(category => (
                      <label key={category} className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-purple-500 focus:ring-purple-600"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Maturity</label>
                    <div className="flex flex-wrap gap-2">
                        {maturityLevels.map(level => (
                            <button 
                                key={level} 
                                onClick={() => setSelectedMaturity(level)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${selectedMaturity === level ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="time-period" className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
                  <select 
                    id="time-period" 
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
                    value={selectedTimePeriod}
                    onChange={e => setSelectedTimePeriod(e.target.value)}
                  >
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Sentiment</label>
                  <div className="flex items-center space-x-4">
                    {sentiments.map(sentiment => (
                         <label key={sentiment} className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer">
                            <input 
                                type="radio" 
                                name="sentiment" 
                                className="w-4 h-4 bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600"
                                checked={selectedSentiment === sentiment}
                                onChange={() => setSelectedSentiment(sentiment)}
                            />
                            <span>{sentiment}</span>
                        </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="search-volume" className="block text-sm font-medium text-gray-300 mb-2">Minimum Search Volume</label>
                   <input
                    type="number"
                    id="search-volume"
                    placeholder="e.g., 10000"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    value={minVolume}
                    onChange={e => setMinVolume(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end gap-3 rounded-b-xl">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="solid" onClick={handleApply}>Apply Filters</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
