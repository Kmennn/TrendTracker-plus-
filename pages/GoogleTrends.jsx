
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Search } from 'lucide-react';

// A mapping of categories to icons and colors to add some visual flair
const categoryStyles = {
  all: { icon: <TrendingUp />, color: '#6366F1' }, // Indigo
  business: { icon: <BarChart />, color: '#10B981' }, // Emerald
  tech: { icon: <Search />, color: '#3B82F6' }, // Blue
  // Add more categories as needed
};

const GoogleTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/daily-trends');
        // The API returns data for today, so we get the first item
        const todaysTrends = response.data.trending_searches[0]?.searches || [];
        setTrends(todaysTrends);
      } catch (err) {
        setError('Could not fetch trends. Please check your API key and try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [category]);

  // Animation variants for the container and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Today's<span className="text-indigo-400"> Trending Searches</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Discover what the world is searching for right now, powered by Google Trends and SerpApi.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 text-red-300 p-6 rounded-2xl max-w-lg mx-auto text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {trends.map((trend, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-gray-800/60 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-shadow duration-300 border border-gray-700/50"
            >
              <img src={trend.image_url} alt={trend.title} className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-100 truncate">{trend.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{trend.subtitle}</p>
                <a
                  href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                >
                  Explore Trend <TrendingUp className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GoogleTrends;
