import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, Twitter, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../src/firebaseConfig';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import RadarScanner from '../components/RadarScanner';

const TrendRadar = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [displayedTrends, setDisplayedTrends] = useState([]);
  const navigate = useNavigate();

  const allTrends = {
    youtube: [
        { id: 'ai-revolution', title: 'AI Revolution: The Next Frontier', metric: '3.1M views' },
        { id: 'space-exploration', title: 'The Future of Space Exploration', metric: '2.5M views' },
        { id: 'sustainable-tech', title: 'Sustainable Tech Innovations', metric: '1.8M views' },
        { id: 'productivity-hacks-2024', title: 'Ultimate Productivity Hacks 2024', metric: '1.5M views' },
        { id: 'diy-smart-home', title: 'DIY Smart Home Automation', metric: '980k views' },
    ],
    instagram: [
        { id: 'digital-nomad', title: '#DigitalNomadLife', metric: '4.2M posts' },
        { id: 'eco-friendly', title: '#EcoFriendlyLiving', metric: '3.1M posts' },
        { id: 'generative-art', title: '#generativeart', metric: '2.8M posts' },
        { id: 'home-workout', title: '#HomeWorkout', metric: '2.2M posts' },
        { id: 'vegan-recipes', title: '#VeganRecipes', metric: '1.9M posts' },
    ],
    twitter: [
        { id: 'crypto-news', title: '#CryptoNews', metric: '5.5M tweets' },
        { id: 'tech-for-good', title: '#TechForGood', metric: '4.8M tweets' },
        { id: 'future-of-work', title: '#FutureOfWork', metric: '4.1M tweets' },
        { id: 'nft-community', title: '#NFTCommunity', metric: '3.5M tweets' },
        { id: 'esports', title: '#eSports', metric: '3.2M tweets' },
    ],
  };

  const themes = {
    youtube: {
        primary: 'bg-red-600',
        secondary: 'hover:bg-red-500/10',
        accent: 'text-red-400',
        icon: 'text-red-500',
        radar: '#FF0000',
        name: 'YouTube',
        border: 'border-red-500/30 hover:border-red-500/80'
    },
    instagram: {
        primary: 'bg-pink-600',
        secondary: 'hover:bg-pink-500/10',
        accent: 'text-pink-400',
        icon: 'text-pink-500',
        radar: '#E4405F',
        name: 'Instagram',
        border: 'border-pink-500/30 hover:border-pink-500/80'
    },
    twitter: {
        primary: 'bg-blue-600',
        secondary: 'hover:bg-blue-500/10',
        accent: 'text-blue-400',
        icon: 'text-blue-500',
        radar: '#1DA1F2',
        name: 'Twitter',
        border: 'border-blue-500/30 hover:border-blue-500/80'
    },
  };

  const handleTrendClick = async (item) => {
    const trendsRef = ref(db, 'trends');
    const q = query(trendsRef, orderByChild('keyword'), equalTo(item.title));
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const trendId = Object.keys(snapshot.val())[0];
      navigate(`/trend/${trendId}`);
    } else {
      console.warn(`Trend not found for keyword: ${item.title}`);
      // Fallback: Navigate to the first trend if the clicked one isn't found
      const allTrendsRef = ref(db, 'trends');
      const allTrendsSnapshot = await get(allTrendsRef);
      if (allTrendsSnapshot.exists()) {
        const allTrends = allTrendsSnapshot.val();
        const firstTrendId = Object.keys(allTrends)[0];
        navigate(`/trend/${firstTrendId}`);
      }
    }
  };

  const activeTheme = themes[activeTab];

  useEffect(() => {
    const shuffleAndSlice = (arr) => [...arr].sort(() => 0.5 - Math.random()).slice(0, 5);
    const updateTrends = () => setDisplayedTrends(shuffleAndSlice(allTrends[activeTab]));
    updateTrends();
    const intervalId = setInterval(updateTrends, 6000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  const platformIcons = {
    youtube: <Youtube className={`w-5 h-5 ${themes.youtube.icon}`} />,
    instagram: <Instagram className={`w-5 h-5 ${themes.instagram.icon}`} />,
    twitter: <Twitter className={`w-5 h-5 ${themes.twitter.icon}`} />,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,0,128,0.15)_0%,_rgba(0,0,0,0)_50%)]"></div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            Trend Radar
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div 
              className="lg:col-span-2 bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="flex mb-6 bg-black/20 p-1.5 rounded-xl border border-white/10">
                    {Object.keys(allTrends).map(platform => (
                        <TabButton 
                            key={platform} 
                            label={themes[platform].name} 
                            isActive={activeTab === platform} 
                            onClick={() => setActiveTab(platform)} 
                            theme={themes[platform]}
                        />
                    ))}
                </div>
                <AnimatePresence mode="popLayout">
                    <motion.div className="space-y-3" layout>
                        {displayedTrends.map(item => (
                            <motion.div
                                key={item.id}
                                onClick={() => handleTrendClick(item)}
                                className={`block p-px rounded-lg transition-all duration-300 group ${activeTheme.secondary} bg-gradient-to-r from-white/5 to-transparent cursor-pointer`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            >
                                <div className={`bg-gray-900/80 rounded-lg p-4 flex items-center justify-between border transition-colors ${activeTheme.border}`}>
                                    <div className="flex items-center min-w-0">
                                        {platformIcons[activeTab]}
                                        <span className="ml-4 text-lg font-medium text-gray-200 group-hover:text-white transition-colors truncate">{item.title}</span>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 ml-4">
                                        <span className="text-gray-400 text-sm mr-4 group-hover:text-white transition-colors">{item.metric}</span>
                                        <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white transform transition-transform duration-300 group-hover:rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <motion.div 
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            >
                <RadarScanner activePlatform={activeTab} trends={displayedTrends} theme={activeTheme} />
            </motion.div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ label, isActive, onClick, theme }) => (
    <button
      onClick={onClick}
      className={`relative flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
      {isActive && (
          <motion.div
              layoutId="active-tab-indicator"
              className={`absolute inset-0 rounded-lg ${theme.primary} z-0`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
          />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

export default TrendRadar;
