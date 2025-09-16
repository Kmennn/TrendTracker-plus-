import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Search, Bell, ArrowLeft, Bookmark, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import CommandPalette from '../components/CommandPalette';
import NotificationPanel from '../components/NotificationPanel';
import RegionDetailModal from '../components/RegionDetailModal';
import TrendAtlas from '../components/TrendAtlas';

const RegionalMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrendId, setSelectedTrendId] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [mapData, setMapData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trends, setTrends] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const regions = [
    { id: 'us', name: 'United States', interest: 100, growth: '+23%' },
    { id: 'uk', name: 'United Kingdom', interest: 87, growth: '+18%' },
    { id: 'de', name: 'Germany', interest: 82, growth: '+15%' },
    { id: 'jp', name: 'Japan', interest: 78, growth: '+12%' },
    { id: 'ca', name: 'Canada', interest: 75, growth: '+20%' },
    { id: 'au', name: 'Australia', interest: 72, growth: '+16%' },
    { id: 'fr', name: 'France', interest: 69, growth: '+14%' },
    { id: 'br', name: 'Brazil', interest: 65, growth: '+28%' },
    { id: 'in', name: 'India', interest: 62, growth: '+30%' },
    { id: 'cn', name: 'China', interest: 58, growth: '+8%' },
    { id: 'ru', name: 'Russia', interest: 55, growth: '-5%' },
    { id: 'za', name: 'South Africa', interest: 45, growth: '+19%' },
    { id: 'mx', name: 'Mexico', interest: 50, growth: '+22%' },
    { id: 'it', name: 'Italy', interest: 60, growth: '+11%' },
    { id: 'es', name: 'Spain', interest: 63, growth: '+13%' },
  ];

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
        const trendsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTrends(trendsArray);
        if (trendsArray.length > 0 && !selectedTrendId) {
          setSelectedTrendId(trendsArray[0].id);
        }
      }
    });
    return () => unsubscribe();
  }, [selectedTrendId]);

  useEffect(() => {
    const simulatedNewData = regions.map(region => ({
      ...region,
      interest: Math.floor(Math.random() * 81) + 20,
      growth: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 30)}%`,
    }));
    const filteredData = simulatedNewData.filter(region =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMapData(filteredData);
  }, [selectedTrendId, timeRange, searchTerm]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  const sortedRegions = [...mapData].sort((a, b) => b.interest - a.interest);
  const selectedTrend = trends.find(t => t.id === selectedTrendId);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} trends={trends} />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent"></div>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/background-stars.jpg)', opacity: 0.3 }}></div>

      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <main className={`flex-1 p-6 sm:p-8 transition-all duration-300 ease-in-out z-10`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
        <div className="w-full max-w-7xl mx-auto">
          <header className="mb-10">
            <div className="flex justify-between items-center mb-6">
               <div className="flex-1">
                 <Button variant="outline" className="w-full max-w-lg justify-start text-gray-400" onClick={() => setIsCommandPaletteOpen(true)}>
                   <Search className="w-5 h-5 mr-3" />
                   Search trends...
                   <kbd className="ml-auto hidden sm:flex items-center text-xs bg-white/10 px-2 py-1 rounded">⌘K</kbd>
                 </Button>
               </div>
               <div className="relative">
                 <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                   <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                   <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-950"></span>
                 </Button>
                 <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
               </div>
             </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-1">Trend Atlas</h1>
                <p className="text-gray-400">A visual exploration of global trend activity.</p>
              </div>
              <div className="flex items-center space-x-2">
                 <Link to="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-1.5" />Dashboard</Button></Link>
                 <Link to="/comparison"><Button variant="outline" size="sm"><Globe className="w-4 h-4 mr-1.5" />Compare</Button></Link>
                 <Link to="/saved"><Button variant="outline" size="sm"><Bookmark className="w-4 h-4 mr-1.5" />Saved</Button></Link>
              </div>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Trend</label>
                <select
                  value={selectedTrendId}
                  onChange={(e) => setSelectedTrendId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {trends.map(trend => <option key={trend.id} value={trend.id}>{trend.keyword}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Regions</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a region..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Global Interest for '{selectedTrend?.keyword}'</h2>
            <p className="text-gray-400 mb-6">Each region is a clickable card. The color and size of the card represent its interest level.</p>
            <TrendAtlas regions={sortedRegions} onRegionClick={handleRegionClick} />
          </motion.div>
        </div>

        {isModalOpen && (
          <RegionDetailModal
            region={selectedRegion}
            trend={selectedTrend}
            onClose={closeModal}
          />
        )}
      </main>
    </div>
  );
};

export default RegionalMap;
