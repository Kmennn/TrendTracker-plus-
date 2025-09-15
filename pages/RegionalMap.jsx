import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Search, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import RegionDetailModal from '../components/RegionDetailModal';
import DataNebula from '../components/DataNebula';

const RegionalMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState('AI Technology');
  const [timeRange, setTimeRange] = useState('7d');
  const [mapData, setMapData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const trends = [
    'AI Technology',
    'Sustainable Energy',
    'Remote Work',
    'Electric Vehicles',
    'Digital Health'
  ];

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
  }, [selectedTrend, timeRange, searchTerm]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  const sortedRegions = [...mapData].sort((a, b) => b.interest - a.interest);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trend Universe</h1>
            <p className="text-gray-400">Explore a nebula of trending topics and insights</p>
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
                value={selectedTrend}
                onChange={(e) => setSelectedTrend(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {trends.map(trend => (
                  <option key={trend} value={trend}>{trend}</option>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Constellations</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search the universe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Data Nebula and Rankings */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Data Nebula Visualization */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Data Nebula</h2>
            <p className="text-gray-400 mb-4">A cosmic view of interest levels for '{selectedTrend}'.</p>
            <DataNebula data={sortedRegions} onRegionClick={handleRegionClick} />
          </div>

          {/* Regional Rankings List */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Brightest Stars</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {sortedRegions
                  .map((region, index) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => handleRegionClick(region)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{region.name}</p>
                          <p className="text-gray-400 text-sm">Interest: {region.interest}/100</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-semibold text-sm">{region.growth}</p>
                        <div className="flex items-center text-gray-400 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </div>
                      </div>
                    </motion.div>
                  ))
                }
              </div>
            </div>
          </div>
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
