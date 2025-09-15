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
  Target
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
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getMaturityColor = (maturity) => {
    switch (maturity) {
      case 'early': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'emerging': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'growing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'mature': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/trend/${trend.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                {trend.keyword}
              </h3>
              {getSentimentIcon(trend.sentiment)}
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMaturityColor(trend.maturity)}`}>
                {trend.maturity}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                {trend.category}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{trend.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">{trend.growth}</span>
                <span className="text-gray-400">growth</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">High impact</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              onClick={handleBookmark}
            >
              <Bookmark className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400">Related: AI, Technology, Innovation</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDetails}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View Details
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
