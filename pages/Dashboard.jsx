
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
import CommandPalette from '../components/CommandPalette';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [trends, setTrends] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [todaysHighlight, setTodaysHighlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
 
  const placeholderTrends = [
    { id: '1', keyword: 'AI in Healthcare', category: 'Technology', growth: '+85%', sentiment: 'positive', maturity: 'early', description: 'This is a description for AI in Healthcare', metrics: { searchVolume: 15000, changePercent: 85 } },
    { id: '2', keyword: 'Generative Art', category: 'Art', growth: '+120%', sentiment: 'positive', maturity: 'growing', description: 'Exploring the rise of AI in creating art.', metrics: { searchVolume: 8000, changePercent: 120 } },
    { id: '3', keyword: 'Lo-fi Beats', category: 'Music', growth: '+50%', sentiment: 'neutral', maturity: 'mature', description: 'The enduring popularity of lo-fi music for focus and relaxation.', metrics: { searchVolume: 25000, changePercent: 50 } },
    { id: '4', keyword: 'Quantum Computing Breakthroughs', category: 'Science', growth: '+200%', sentiment: 'positive', maturity: 'emerging', description: 'Recent advancements in quantum computing technology.', metrics: { searchVolume: 10000, changePercent: 200 } },
    { id: '5', keyword: 'Esports Popularity', category: 'Sports', growth: '+75%', sentiment: 'positive', maturity: 'growing', description: 'The increasing global audience for competitive gaming.', metrics: { searchVolume: 30000, changePercent: 75 } },
    { id: '6', keyword: 'Sustainable Business Practices', category: 'Business', growth: '+100%', sentiment: 'positive', maturity: 'mature', description: 'Companies adopting environmentally friendly operations.', metrics: { searchVolume: 18000, changePercent: 100 } },
  ];

  const displayedTrends = trends.length > 0 ? trends : placeholderTrends;

  const filteredTrends = displayedTrends.filter(trend => {
    if (!trend || !trend.keyword) return false;
    const matchesCategory = selectedCategory === 'All' || (trend.category && trend.category.toLowerCase() === selectedCategory.toLowerCase());
    if (!appliedFilters) return matchesCategory;
    const matchesMaturity = !appliedFilters.maturity || appliedFilters.maturity === trend.maturity;
    const matchesSentiment = !appliedFilters.sentiment || appliedFilters.sentiment.toLowerCase() === trend.sentiment;
    const matchesVolume = !appliedFilters.minVolume || trend.metrics.searchVolume >= appliedFilters.minVolume;
    return matchesCategory && matchesMaturity && matchesSentiment && matchesVolume;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 text-white">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-xl">Loading cosmic data...</div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
        <CommandPalette 
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            trends={displayedTrends}
        />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent"></div>
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/background-stars.jpg)', opacity: 0.3 }}
        ></div>
      </div>

      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <main className={`flex-1 p-6 sm:p-8 transition-all duration-300 ease-in-out z-10`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full max-w-lg justify-start text-gray-400"
                  onClick={() => setIsCommandPaletteOpen(true)}
                >
                  <Search className="w-5 h-5 mr-3" />
                  Search trends...
                  <kbd className="ml-auto hidden sm:flex items-center text-xs bg-white/10 px-2 py-1 rounded">
                    ⌘K
                  </kbd>
                </Button>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                </Button>
                <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-1">
                  Dashboard
                </h1>
                <p className="text-gray-400">Navigating the universe of trends.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-1.5" />Home</Button></Link>
                <Link to="/alerts"><Button variant="outline" size="sm"><Bell className="w-4 h-4 mr-1.5" />Alerts</Button></Link>
                <Link to="/saved"><Button variant="outline" size="sm"><Bookmark className="w-4 h-4 mr-1.5" />Saved</Button></Link>
              </div>
            </div>
          </header>

          <Analytics />

          {todaysHighlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/10 border border-purple-500/30 rounded-2xl p-6 mb-10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold text-sm tracking-widest uppercase">Highlight</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{todaysHighlight.title}</h3>
                  <p className="text-gray-300 mb-4 max-w-2xl">{todaysHighlight.description}</p>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm"><span className="text-gray-400">Growth: </span><span className="text-green-400 font-semibold">{todaysHighlight.growth}</span></div>
                    <div className="text-sm"><span className="text-gray-400">Impact: </span><span className="text-orange-400 font-semibold">{todaysHighlight.impact}</span></div>
                    <div className="text-sm"><span className="text-gray-400">Timeline: </span><span className="text-blue-400 font-semibold">{todaysHighlight.timeline}</span></div>
                  </div>
                </div>
                <Button variant="solid" size="sm" onClick={() => navigate(`/trend/${todaysHighlight.id}`)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore Trend
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-6">Trending Nebulae</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                  {['All', 'Technology', 'Art', 'Music', 'Science', 'Sports', 'Business'].map(cat => (
                    <Button 
                      key={cat}
                      variant={selectedCategory === cat ? 'solid' : 'outline'} 
                      size="sm" 
                      onClick={() => setSelectedCategory(cat)}
                      className="rounded-full"
                    >
                      {cat}
                    </Button>
                  ))}
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredTrends.map((trend, index) => (
                    <motion.div
                      key={trend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TrendCard trend={trend} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <aside className="space-y-8">
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Constellation Filters</h3>
                    <Button variant="outline" className="w-full" onClick={() => setIsFilterModalOpen(true)}>
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
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
            </aside>
          </div>
        </div>
        <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
            onApplyFilters={setAppliedFilters} 
        />
      </main>
    </div>
  );
};

export default Dashboard;
