import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, TrendingUp, Globe, Calendar, Download, Search, Bell, ArrowLeft, Bookmark } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import CommandPalette from '../components/CommandPalette';
import NotificationPanel from '../components/NotificationPanel';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-xl">
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [allTrends, setAllTrends] = useState([]);

  const keywordColors = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];
  const regions = [
    { value: 'in', label: 'India' },
    { value: 'worldwide', label: 'Worldwide' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' }
  ];

  useEffect(() => {
    const trendsRef = ref(db, 'trends');
    const unsubscribe = onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trendsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setAllTrends(trendsArray);
      }
    });
    return () => unsubscribe();
  }, []);

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
        color: keywordColors[index % keywordColors.length]
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
    if (e.key === 'Enter') addKeyword();
  };

  const handleExport = () => {
    if (comparisonData.length === 0) return alert("No data to export!");
    const headers = ['month', ...keywords];
    const csvContent = [headers.join(','), ...comparisonData.map(row => headers.map(header => row[header]).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "keyword_comparison_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} trends={allTrends} />
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
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-1">Keyword Comparison</h1>
                <p className="text-gray-400">Compare cosmic trends across different galaxies and time sectors.</p>
              </div>
              <div className="flex items-center space-x-2">
                 <Link to="/"><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-1.5" />Dashboard</Button></Link>
                 <Link to="/alerts"><Button variant="outline" size="sm"><Bell className="w-4 h-4 mr-1.5" />Alerts</Button></Link>
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Keywords to Compare (up to 5)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {keywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full border"
                      style={{ borderColor: keywordColors[index % keywordColors.length], backgroundColor: `${keywordColors[index % keywordColors.length]}20` }}
                    >
                      <span className="text-white font-medium text-sm">{keyword}</span>
                      {keywords.length > 1 && (
                        <button onClick={() => removeKeyword(keyword)} className="text-gray-400 hover:text-white rounded-full hover:bg-white/10 p-0.5">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
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
                      className="flex-1 pl-4 pr-4 py-2.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <Button onClick={addKeyword} variant="solid">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {[ {label: 'Time Range', value: timeRange, onChange: setTimeRange, options: [{value: '3m', label: 'Last 3 months'}, {value: '6m', label: 'Last 6 months'}, {value: '12m', label: 'Last 12 months'}, {value: '2y', label: 'Last 2 years'}]}, {label: 'Region', value: region, onChange: setRegion, options: regions} ].map(item => (
                  <div key={item.label}> 
                    <label className="block text-sm font-medium text-gray-300 mb-2">{item.label}</label>
                    <select value={item.value} onChange={(e) => item.onChange(e.target.value)} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                      {item.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export Data</Button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center"><TrendingUp className="w-5 h-5 mr-3 text-purple-400" />Search Interest Over Time</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" />{regions.find(r => r.value === region)?.label}</div>
                    <div className="flex items-center"><Globe className="w-4 h-4 mr-1.5" />{timeRange === '12m' ? 'Last 12 months' : timeRange}</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={comparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>{keywords.map((k, i) => <linearGradient key={k} id={`colorGradient${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={keywordColors[i % keywordColors.length]} stopOpacity={0.4}/><stop offset="95%" stopColor={keywordColors[i % keywordColors.length]} stopOpacity={0}/></linearGradient>)}</defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff33', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    {keywords.map((keyword, index) => <React.Fragment key={keyword}><Line type="monotone" dataKey={keyword} stroke={keywordColors[index % keywordColors.length]} strokeWidth={2.5} dot={false} animationDuration={1500} /><Area type="monotone" dataKey={keyword} stroke="none" fill={`url(#colorGradient${index})`} animationDuration={1500} /></React.Fragment>)}
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Average Search Interest</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={averageInterestData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>{averageInterestData.map((e, i) => <linearGradient key={`barGradient-${i}`} id={`barGradient${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={e.color} stopOpacity={0.8} /><stop offset="100%" stopColor={e.color} stopOpacity={0.2} /></linearGradient>)}</defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="keyword" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} interval={0} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>{averageInterestData.map((e, i) => <Cell key={`cell-${i}`} fill={`url(#barGradient${i})`} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Keywords</h3>
                <div className="space-y-3">
                  {keywords.map((keyword, index) => <div key={keyword} className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: keywordColors[index % keywordColors.length] }}></div><span className="text-gray-300 truncate">{keyword}</span></div>)}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Related Queries</h3>
                <div className="space-y-4">
                  {relatedQueries.map((query, index) => (
                    <div key={index} className="border-b border-white/10 pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-white font-medium text-sm">{query.query}</p>
                        <span className="text-green-400 text-xs font-semibold whitespace-nowrap">{query.growth}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{query.volume} searches</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Keywords:</span><span className="text-white font-semibold">{keywords.length}/5</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Time Range:</span><span className="text-blue-400 font-semibold">{timeRange === '12m' ? 'Last 12 months' : timeRange}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Region:</span><span className="text-purple-400 font-semibold">{regions.find(r => r.value === region)?.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Data Points:</span><span className="text-green-400 font-semibold">{comparisonData.length}</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KeywordComparison;
