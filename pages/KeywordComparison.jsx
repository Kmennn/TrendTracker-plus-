import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, TrendingUp, Globe, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, Cell } from 'recharts';
import Button from '../components/Button';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700/80 backdrop-blur-sm p-4 rounded-lg border border-gray-600 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.stroke || pld.payload.color }}></div>
            <p className="text-gray-300 text-sm">{`${pld.name}: `}<span className="font-bold text-white">{pld.value}</span></p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const KeywordComparison = () => {
  const [keywords, setKeywords] = useState(['AI sustainability', 'Remote work']);
  const [newKeyword, setNewKeyword] = useState('');
  const [timeRange, setTimeRange] = useState('12m');
  const [region, setRegion] = useState('in');
  const [comparisonData, setComparisonData] = useState([]);
  const [averageInterestData, setAverageInterestData] = useState([]);
  const [relatedQueries, setRelatedQueries] = useState([]);

  const keywordColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];
  const regions = [
    { value: 'in', label: 'India' },
    { value: 'worldwide', label: 'Worldwide' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' }
  ];

  useEffect(() => {
    generateComparisonData();
    generateRelatedQueries();
  }, [keywords, timeRange, region]);

  useEffect(() => {
    calculateAverageInterest();
  }, [comparisonData]);

  const generateComparisonData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => {
      const dataPoint = { month };
      keywords.forEach((keyword) => {
        dataPoint[keyword] = Math.floor(Math.random() * 80) + 20;
      });
      return dataPoint;
    });
    setComparisonData(data);
  };

  const calculateAverageInterest = () => {
    if (comparisonData.length === 0) return;

    const avgData = keywords.map((keyword, index) => {
      const total = comparisonData.reduce((sum, dataPoint) => sum + dataPoint[keyword], 0);
      const average = total / comparisonData.length;
      return {
        keyword,
        value: Math.round(average),
        color: keywordColors[index]
      };
    });
    setAverageInterestData(avgData);
  };

  const generateRelatedQueries = () => {
    const queries = [
      { query: 'sustainable AI solutions', growth: '+245%', volume: '12K' },
      { query: 'green technology trends', growth: '+189%', volume: '8.5K' },
      { query: 'remote work productivity', growth: '+156%', volume: '15K' },
      { query: 'hybrid work models', growth: '+134%', volume: '11K' },
      { query: 'AI environmental impact', growth: '+98%', volume: '6.2K' }
    ];
    setRelatedQueries(queries);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && keywords.length < 5 && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter(k => k !== keywordToRemove));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  const handleExport = () => {
    if (comparisonData.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ['month', ...keywords];
    const csvContent = [
      headers.join(','),
      ...comparisonData.map(row => 
        headers.map(header => row[header]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "keyword_comparison_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Keyword Comparison Tool</h1>
          <p className="text-gray-400">Compare search trends for up to 5 keywords across different regions and time periods</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Keywords to Compare</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map((keyword, index) => (
                  <div
                    key={keyword}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border-2"
                    style={{ borderColor: keywordColors[index], backgroundColor: `${keywordColors[index]}20` }}
                  >
                    <span className="text-white font-medium">{keyword}</span>
                    {keywords.length > 1 && (
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {keywords.length < 5 && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add keyword to compare..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button onClick={addKeyword}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="3m">Last 3 months</option>
                  <option value="6m">Last 6 months</option>
                  <option value="12m">Last 12 months</option>
                  <option value="2y">Last 2 years</option>
                  <option value="5y">Last 5 years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {regions.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Search Interest Over Time
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {timeRange === '12m' ? 'Last 12 months' : timeRange}
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {regions.find(r => r.value === region)?.label}
                  </div>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={comparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    {keywords.map((_, index) => (
                      <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={keywordColors[index]} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={keywordColors[index]} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="month" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4A5568', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  {keywords.map((keyword, index) => (
                    <React.Fragment key={keyword}>
                      <Line
                        type="monotone"
                        dataKey={keyword}
                        stroke={keywordColors[index]}
                        strokeWidth={3}
                        dot={false}
                        animationDuration={1500}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={keyword} 
                        stroke="none" 
                        fill={`url(#colorGradient${index})`} 
                        animationDuration={1500}
                      />
                    </React.Fragment>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Average Search Interest</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageInterestData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                   <defs>
                    {averageInterestData.map((entry, index) => (
                        <linearGradient key={`barGradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.2} />
                        </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="keyword" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} interval={0} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {averageInterestData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Keywords</h3>
              <div className="space-y-3">
                {keywords.map((keyword, index) => (
                  <div key={keyword} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: keywordColors[index] }}
                    ></div>
                    <span className="text-gray-300">{keyword}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Related Queries</h3>
              <div className="space-y-4">
                {relatedQueries.map((query, index) => (
                  <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium text-sm">{query.query}</p>
                      <span className="text-green-400 text-xs font-semibold">{query.growth}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{query.volume} searches</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Keywords:</span>
                  <span className="text-white font-semibold">{keywords.length}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Range:</span>
                  <span className="text-blue-400">{timeRange === '12m' ? 'Last 12 months' : timeRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Region:</span>
                  <span className="text-purple-400">{regions.find(r => r.value === region)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Points:</span>
                  <span className="text-green-400">{comparisonData.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordComparison;
