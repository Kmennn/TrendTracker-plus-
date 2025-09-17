import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bookmark, 
  Share2, 
  ExternalLink,
  Clock,
  Target,
  ChevronRight
} from 'lucide-react';
import Button from './Button';
import ShareModal from './ShareModal';

const TrendCard = ({ trend }) => {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleBookmark = (e) => {
    e.stopPropagation();
    console.log(`Bookmarking trend: ${trend.keyword}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/trend/${trend.id}`);
  };
  
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getMaturityColor = (maturity) => {
    switch (maturity) {
      case 'early': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'emerging': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'growing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'mature': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const categoryColors = {
    'Technology': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Art': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Music': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Science': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Sports': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Business': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Food': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Travel': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Fashion': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Lifestyle': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };
  
  const categoryColor = categoryColors[trend.category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${categoryColor}`}>
                    {trend.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${getMaturityColor(trend.maturity)}`}>
                    {trend.maturity}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-2">
                {trend.keyword}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trend.description}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex items-center space-x-2">
              {getSentimentIcon(trend.sentiment)}
              <span className="text-lg font-semibold text-white">{trend.growth}</span>
            </div>
            <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  onClick={handleBookmark}
                >
                  <Bookmark className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>2 hours ago</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Target className="w-4 h-4" />
                <span>High impact</span>
              </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleViewDetails}
            className="group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors duration-300"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        trendId={trend.id} 
      />
    </>
  );
};

export default TrendCard;
