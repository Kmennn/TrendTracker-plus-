import React from 'react';
import { motion } from 'framer-motion';
import { X, Globe } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const RegionDetailModal = ({ region, trend, onClose }) => {
  const navigate = useNavigate();

  if (!region || !trend) return null;

  const detailedTrends = [
    { name: 'AI in Healthcare', interest: 92, growth: '+35%' },
    { name: 'Machine Learning Startups', interest: 88, growth: '+28%' },
    { name: 'AI Ethics Regulations', interest: 75, growth: '+15%' },
  ];

  const handleViewMore = () => {
    onClose();
    navigate(`/trend/${trend.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{region.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Overall Trend: {trend.keyword}</h3>
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="text-gray-400">Interest Level</p>
                <p className="text-2xl font-bold text-white">{region.interest}/100</p>
              </div>
              <div>
                <p className="text-gray-400">Growth</p>
                <p className="text-2xl font-bold text-green-400">{region.growth}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Trending Topics in {region.name}</h3>
            <div className="space-y-3">
              {detailedTrends.map((item, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-white">{item.name}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">{item.interest}/100</span>
                    <span className="text-sm text-green-400">{item.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="solid"
            size="lg"
            onClick={handleViewMore}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Globe className="w-5 h-5 mr-3" />
            View More Insights for {region.name}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegionDetailModal;
