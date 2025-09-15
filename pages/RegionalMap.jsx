import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Search } from 'lucide-react';
import Button from '../components/Button';
import RegionDetailModal from '../components/RegionDetailModal';
import TrendAtlas from '../components/TrendAtlas';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const RegionalMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrendId, setSelectedTrendId] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [mapData, setMapData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trends, setTrends] = useState([]);

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
    const trendsRef = ref(db, 'trends');
    const unsubscribe = onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trendsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setTrends(trendsArray);
        if (trendsArray.length > 0) {
          setSelectedTrendId(trendsArray[0].id);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Simulate fetching new data based on trend and time range
    const simulatedNewData = regions.map(region => ({
      ...region,
      interest: Math.floor(Math.random() * 81) + 20, // Random interest between 20 and 100
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trend Atlas</h1>
            <p className="text-gray-400">A visual exploration of global trend activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Trend</label>
              <select
                value={selectedTrendId}
                onChange={(e) => setSelectedTrendId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {trends.map(trend => (
                  <option key={trend.id} value={trend.id}>{trend.keyword}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Trend Atlas */}
        <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Global Interest for '{selectedTrend?.keyword}'</h2>
            <p className="text-gray-400 mb-4">Each region is a clickable card. The color and size of the card represent its interest level.</p>
            <TrendAtlas regions={sortedRegions} onRegionClick={handleRegionClick} />
        </div>
      </div>
      {isModalOpen && (
        <RegionDetailModal
          region={selectedRegion}
          trend={selectedTrend}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default RegionalMap;
