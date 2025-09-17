import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Calendar, Filter, Plus, Eye, Edit, Share2, Clock, TrendingUp,
  BarChart3, PieChart, X, CheckCircle, Trash2, Search, Bell
} from 'lucide-react';
import Button from '../components/Button';
import CommandPalette from '../components/CommandPalette';
import NotificationPanel from '../components/NotificationPanel';
import AnimatedNumber from '../components/AnimatedNumber';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const ReportCardSkeleton = () => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shimmer">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
        <div>
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-6 w-24 bg-white/10 rounded-full"></div>
    </div>
    <div className="h-4 bg-white/10 rounded w-full mb-5"></div>
    <div className="grid grid-cols-3 gap-4 mb-5">
      <div className="h-12 bg-white/10 rounded-lg"></div>
      <div className="h-12 bg-white/10 rounded-lg"></div>
      <div className="h-12 bg-white/10 rounded-lg"></div>
    </div>
    <div className="h-4 bg-white/10 rounded w-1/2 mb-5"></div>
    <div className="flex items-center space-x-2">
      <div className="h-10 bg-white/10 rounded-lg w-full"></div>
      <div className="h-10 bg-white/10 rounded-lg w-10"></div>
      <div className="h-10 bg-white/10 rounded-lg w-10"></div>
      <div className="h-10 bg-white/10 rounded-lg w-10"></div>
    </div>
  </div>
);

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    info: <Eye className="w-5 h-5 text-blue-400" />,
    download: <Download className="w-5 h-5 text-purple-400" />,
    share: <Share2 className="w-5 h-5 text-pink-400" />,
    edit: <Edit className="w-5 h-5 text-yellow-400" />,
    delete: <Trash2 className="w-5 h-5 text-red-400" />,
  };

  return (
    <motion.div
      layout initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -70, opacity: 0 }}
      className="fixed top-6 right-6 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-white p-4 z-[100] flex items-center shadow-lg"
      onClick={onClose}
    >
      <div className="mr-3">{icons[type] || icons.info}</div>
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
};

const ReportsModule = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewedReport, setViewedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState(null);
  const [newReportData, setNewReportData] = useState({ title: '', type: 'trend-analysis', description: '' });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const trendsRef = ref(db, 'trends');
    onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTrends(Object.keys(data).map(key => ({ id: key, ...data[key] })));
    });

    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    setTimeout(() => {
      setReports([
        { id: 1, title: 'Q4 2024 Trend Analysis', type: 'trend-analysis', status: 'completed', createdAt: new Date('2025-09-15T18:30:00'), updatedAt: new Date('2025-09-15T21:41:00'), author: 'AI System', description: 'Comprehensive analysis of emerging trends in technology and sustainability for Q4 2024.', pages: 24, charts: 8, insights: 15 },
        { id: 2, title: 'Regional Market Comparison', type: 'market-analysis', status: 'completed', createdAt: new Date('2025-09-14T11:00:00'), updatedAt: new Date('2025-09-15T20:41:00'), author: 'John Smith', description: 'Geographic distribution analysis of key market trends across North America, Europe, and Asia.', pages: 18, charts: 12, insights: 22 },
        { id: 3, title: 'AI Technology Forecast 2025', type: 'forecast', status: 'in-progress', createdAt: new Date('2025-09-13T09:00:00'), updatedAt: new Date('2025-09-15T22:11:00'), author: 'Sarah Johnson', description: 'Predictive analysis of AI technology adoption and growth patterns for the upcoming year.', pages: 32, charts: 15, insights: 28 },
        { id: 4, title: 'Weekly Trend Summary', type: 'summary', status: 'scheduled', createdAt: new Date(), updatedAt: new Date(), author: 'Auto-Generated', description: 'Automated weekly compilation of trending topics, keywords, and social media metrics.', pages: 10, charts: 5, insights: 12 }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    const newReport = {
      id: reports.length + 5, title: newReportData.title || 'Untitled Report', type: newReportData.type,
      status: 'draft', createdAt: new Date(), updatedAt: new Date(), author: 'Current User',
      description: newReportData.description, pages: Math.floor(Math.random() * 20) + 5,
      charts: Math.floor(Math.random() * 10) + 2, insights: Math.floor(Math.random() * 15) + 5,
    };
    setReports([newReport, ...reports]);
    setShowCreateModal(false);
    setNewReportData({ title: '', type: 'trend-analysis', description: '' });
    showNotification(`Report "${newReport.title}" created!`, 'success');
  };

  const handleDelete = (reportId, reportTitle) => {
    setReports(reports.filter(report => report.id !== reportId));
    showNotification(`Report "${reportTitle}" deleted!`, 'delete');
  };

  const handleAction = (action, report) => {
    let message = '';
    switch (action) {
      case 'View': setViewedReport(report); message = `Opening report: "${report.title}"`; break;
      case 'Download': message = `Downloading "${report.title}"...`; break;
      case 'Share': message = `Sharing options for "${report.title}"`; break;
      case 'Edit': message = `Editing report: "${report.title}"`; break;
      default: message = 'Action triggered!';
    }
    showNotification(message, action.toLowerCase());
  };

  const getStatusPill = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border";
    switch (status) {
      case 'completed': return <div className={`${base} bg-green-500/10 text-green-300 border-green-500/20`}><div className="w-2 h-2 rounded-full bg-green-500"></div>Completed</div>;
      case 'in-progress': return <div className={`${base} bg-yellow-500/10 text-yellow-300 border-yellow-500/20`}><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>In Progress</div>;
      case 'scheduled': return <div className={`${base} bg-blue-500/10 text-blue-300 border-blue-500/20`}><Clock className="w-3 h-3" />Scheduled</div>;
      default: return <div className={`${base} bg-gray-500/10 text-gray-400 border-gray-500/20`}>Draft</div>;
    }
  };

  const getTypeIcon = (type) => {
    const props = { className: "w-6 h-6" };
    switch (type) {
      case 'trend-analysis': return <TrendingUp {...props} />;
      case 'market-analysis': return <BarChart3 {...props} />;
      case 'forecast': return <PieChart {...props} />;
      case 'summary': return <FileText {...props} />;
      default: return <FileText {...props} />;
    }
  };

  const filteredReports = reports.filter(report => filterType === 'all' || report.type === filterType);
  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} trends={trends} />
      <AnimatePresence>{notification && <Notification key={notification.id} {...notification} onClose={() => setNotification(null)} />}</AnimatePresence>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent"></div>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/background-stars.jpg)', opacity: 0.3 }}></div>

      <main className="p-6 sm:p-8 z-10 w-full">
        <div className="w-full max-w-8xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <Button variant="outline" className="w-full max-w-lg justify-start text-gray-400" onClick={() => setIsCommandPaletteOpen(true)}>
                  <Search className="w-5 h-5 mr-3" />
                  Search trends or reports...
                  <kbd className="ml-auto hidden sm:flex items-center text-xs bg-white/10 px-2 py-1 rounded">⌘K</kbd>
                </Button>
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <Bell className="w-6 h-6 text-gray-400 hover:text-white" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-950"></span>
                </Button>
                <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-1">Reports & Analytics</h1>
                <p className="text-gray-400 text-lg">Generate, manage, and export comprehensive trend reports.</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button variant="outline"><Calendar className="w-4 h-4 mr-2" />Schedule</Button>
                <Button onClick={() => setShowCreateModal(true)}><Plus className="w-4 h-4 mr-2" />New Report</Button>
              </div>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <option value="all">All Reports</option>
                <option value="trend-analysis">Trend Analysis</option>
                <option value="market-analysis">Market Analysis</option>
                <option value="forecast">Forecasts</option>
                <option value="summary">Summaries</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              {isLoading ? 'Loading reports...' : `${filteredReports.length} reports found`}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <ReportCardSkeleton key={i} />) : filteredReports.map((report, index) => (
              <motion.div
                key={report.id} layout initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-purple-500/50 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 group-hover:bg-purple-600/20 group-hover:text-purple-300 transition-all rounded-lg flex items-center justify-center text-gray-400">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{report.title}</h3>
                        <p className="text-gray-400 text-sm">by {report.author}</p>
                      </div>
                    </div>
                    {getStatusPill(report.status)}
                  </div>
                  <p className="text-gray-400 text-sm mb-5 h-10">{report.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-5 text-center bg-black/40 p-3 rounded-lg">
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.pages} /></p>
                      <p className="text-gray-400 text-xs">Pages</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.charts} /></p>
                      <p className="text-gray-400 text-xs">Charts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.insights} /></p>
                      <p className="text-gray-400 text-xs">Insights</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-5">
                    <Clock className="w-3 h-3" />
                    <span>Updated {formatDate(report.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => handleAction('View', report)} size="sm" className="flex-1"><Eye className="w-4 h-4 mr-2" />View Report</Button>
                  <Button onClick={() => handleAction('Download', report)} size="icon-sm" variant="outline"><Download className="w-4 h-4" /></Button>
                  <Button onClick={() => handleAction('Share', report)} size="icon-sm" variant="outline"><Share2 className="w-4 h-4" /></Button>
                  <Button onClick={() => handleAction('Edit', report)} size="icon-sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                  <Button onClick={() => handleDelete(report.id, report.title)} size="icon-sm" variant="outline" className="hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>{showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} className="bg-gray-950 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleCreateReport}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Report</h2>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}><X className="w-5 h-5" /></Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Report Title</label>
                    <input name="title" type="text" value={newReportData.title} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="e.g., Q1 2026 Fintech Trends" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Report Type</label>
                    <select name="type" value={newReportData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                      <option value="trend-analysis">Trend Analysis</option>
                      <option value="market-analysis">Market Analysis</option>
                      <option value="forecast">Forecast</option>
                      <option value="summary">Summary</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                    <textarea name="description" value={newReportData.description} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" rows="3" placeholder="A brief summary..."></textarea>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button type="submit">Create Report</Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}</AnimatePresence>

        <AnimatePresence>{viewedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewedReport(null)}>
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} className="bg-gray-950 border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{viewedReport.title}</h2>
                  <div className="flex items-center gap-2"><p className='text-gray-400 text-sm'>by {viewedReport.author}</p>{getStatusPill(viewedReport.status)}</div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setViewedReport(null)}><X className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-6">
                <p className="text-gray-300">{viewedReport.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-black/40 p-4 rounded-lg">
                  <div>
                    <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.pages} /></p>
                    <p className="text-gray-400 text-sm">Pages</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.charts} /></p>
                    <p className="text-gray-400 text-sm">Charts</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.insights} /></p>
                    <p className="text-gray-400 text-sm">Insights</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center space-x-1.5"><Calendar className="w-3 h-3" /><span>Created: {formatDate(viewedReport.createdAt)}</span></div>
                  <div className="flex items-center space-x-1.5"><Clock className="w-3 h-3" /><span>Last Updated: {formatDate(viewedReport.updatedAt)}</span></div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setViewedReport(null)}>Close</Button>
                  <Button>Download PDF</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}</AnimatePresence>
      </main>
    </div>
  );
};

export default ReportsModule;
