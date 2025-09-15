import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Bell, Bookmark, TrendingUp, ExternalLink, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TrendCard from '../components/TrendCard';
import KeywordCard from '../components/KeywordCard';
import Button from '../components/Button';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Analytics from '../components/Analytics';
import NotificationPanel from '../components/NotificationPanel';
import FilterModal from '../components/FilterModal';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [trends, setTrends] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [todaysHighlight, setTodaysHighlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    const trendsRef = ref(db, 'trends');
    const unsubscribe = onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trendsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          growth: `+${Math.floor(Math.random() * 300)}%`,
          sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
          maturity: ['emerging', 'growing', 'mature', 'early'][Math.floor(Math.random() * 4)],
          description: `This is a description for ${data[key].keyword}`,
          metrics: { searchVolume: data[key].volume, changePercent: Math.floor(Math.random() * 300) }
        }));
        setTrends(trendsArray);
        setTopKeywords(trendsArray.slice(0, 5).map(t => ({ 
          id: t.id,
          keyword: t.keyword, 
          volume: t.metrics.searchVolume, 
          growth: t.growth 
        })));
        if (trendsArray.length > 0) {
            setTodaysHighlight({
                id: trendsArray[0].id,
                title: trendsArray[0].keyword,
                description: trendsArray[0].description,
                growth: trendsArray[0].growth,
                growthValue: trendsArray[0].metrics.changePercent,
                impact: 'High',
                sectors: [trendsArray[0].category, 'Media', 'Marketing'],
                timeline: '6 months'
            });
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTrends = trends.filter(trend => {
    if (!trend || !trend.keyword || !trend.category) return false;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = trend.keyword.toLowerCase().includes(searchLower) ||
                          trend.category.toLowerCase().includes(searchLower);

    if (!appliedFilters) return matchesSearch;

    const matchesCategory = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(trend.category);
    const matchesMaturity = !appliedFilters.maturity || appliedFilters.maturity === trend.maturity;
    const matchesSentiment = !appliedFilters.sentiment || appliedFilters.sentiment.toLowerCase() === trend.sentiment;
    const matchesVolume = !appliedFilters.minVolume || trend.metrics.searchVolume >= appliedFilters.minVolume;
    
    // Note: Time period filtering is not implemented as the data is static.

    return matchesSearch && matchesCategory && matchesMaturity && matchesSentiment && matchesVolume;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trends..."
                  className="w-full max-w-lg pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                </Button>
                <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Trend Dashboard</h1>
                <p className="text-gray-400">Discover and analyze emerging trends in real-time</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/alerts">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Alerts
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <Analytics />

          {/* Today's Special Highlight */}
          {todaysHighlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Today's Special Highlight</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{todaysHighlight.title}</h3>
                  <p className="text-gray-300 mb-4">{todaysHighlight.description}</p>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm">
                      <span className="text-gray-400">Growth: </span>
                      <span className="text-green-400 font-semibold">{todaysHighlight.growth}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Impact: </span>
                      <span className="text-orange-400 font-semibold">{todaysHighlight.impact}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Timeline: </span>
                      <span className="text-blue-400 font-semibold">{todaysHighlight.timeline}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/trend/${todaysHighlight.id}`}>
                    <Button variant="solid" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explore
                    </Button>
                </Link>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Trends Feed */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-6">Trending Now</h2>
              <div className="space-y-6">
                {filteredTrends.map((trend, index) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TrendCard trend={trend} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                    <Button variant="outline" className="w-full" onClick={() => setIsFilterModalOpen(true)}>
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Keywords (24h)</h3>
                <div className="space-y-3">
                  {topKeywords.map((item, index) => (
                    <KeywordCard 
                        key={item.id}
                        index={index}
                        keyword={item.keyword}
                        volume={item.volume}
                        growth={item.growth}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
            onApplyFilters={setAppliedFilters} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
