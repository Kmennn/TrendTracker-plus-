import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Share2,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  X,
  CheckCircle,
  Trash2
} from 'lucide-react';
import Button from '../components/Button';
import AnimatedNumber from '../components/AnimatedNumber';

// A placeholder skeleton component for loading states
const ReportCardSkeleton = () => (
  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 shimmer">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-700/50 rounded-lg"></div>
        <div>
          <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-700/50 rounded-full"></div>
    </div>
    <div className="h-4 bg-gray-700/50 rounded w-full mb-4"></div>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="h-8 bg-gray-700/50 rounded"></div>
      <div className="h-8 bg-gray-700/50 rounded"></div>
      <div className="h-8 bg-gray-700/50 rounded"></div>
    </div>
    <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
    <div className="flex items-center space-x-2">
       <div className="h-8 bg-gray-700/50 rounded w-full"></div>
       <div className="h-8 bg-gray-700/50 rounded w-10"></div>
       <div className="h-8 bg-gray-700/50 rounded w-10"></div>
       <div className="h-8 bg-gray-700/50 rounded w-10"></div>
    </div>
  </div>
);

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        info: <Eye className="w-5 h-5" />,
        download: <Download className="w-5 h-5" />,
        share: <Share2 className="w-5 h-5" />,
        edit: <Edit className="w-5 h-5" />,
    };

    return (
        <motion.div
            layout
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-5 right-5 bg-gray-800 border border-gray-700/50 rounded-lg text-white p-4 z-[100] flex items-center shadow-2xl`}
            onClick={onClose}
        >
            <div className="mr-3 text-purple-400">{icons[type] || icons.info}</div>
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

  const showNotification = (message, type = 'info') => {
    setNotification({ id: Date.now(), message, type });
  };
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: 'Q4 2024 Trend Analysis',
          type: 'trend-analysis',
          status: 'completed',
          createdAt: new Date('2025-09-15T18:30:00'),
          updatedAt: new Date('2025-09-15T21:41:00'),
          author: 'AI System',
          description: 'Comprehensive analysis of emerging trends in technology and sustainability for Q4 2024.',
          pages: 24,
          charts: 8,
          insights: 15
        },
        {
          id: 2,
          title: 'Regional Market Comparison',
          type: 'market-analysis',
          status: 'completed',
          createdAt: new Date('2025-09-14T11:00:00'),
          updatedAt: new Date('2025-09-15T20:41:00'),
          author: 'John Smith',
          description: 'Geographic distribution analysis of key market trends across North America, Europe, and Asia.',
          pages: 18,
          charts: 12,
          insights: 22
        },
        {
          id: 3,
          title: 'AI Technology Forecast 2025',
          type: 'forecast',
          status: 'in-progress',
          createdAt: new Date('2025-09-13T09:00:00'),
          updatedAt: new Date('2025-09-15T22:11:00'),
          author: 'Sarah Johnson',
          description: 'Predictive analysis of AI technology adoption and growth patterns for the upcoming year.',
          pages: 32,
          charts: 15,
          insights: 28
        },
        {
          id: 4,
          title: 'Weekly Trend Summary',
          type: 'summary',
          status: 'scheduled',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Auto-Generated',
          description: 'Automated weekly compilation of trending topics, keywords, and social media metrics.',
          pages: 10,
          charts: 5,
          insights: 12
        }
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
            id: reports.length + 5, // semi-random id
            title: newReportData.title || 'Untitled Report',
            type: newReportData.type,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Current User',
            description: newReportData.description,
            pages: Math.floor(Math.random() * 20) + 5,
            charts: Math.floor(Math.random() * 10) + 2,
            insights: Math.floor(Math.random() * 15) + 5,
        };
        setReports([newReport, ...reports]);
        setShowCreateModal(false);
        setNewReportData({ title: '', type: 'trend-analysis', description: '' });
        showNotification(`Report "${newReport.title}" created!`, 'success');
    };
    
    const handleDelete = (reportId, reportTitle) => {
      setReports(reports.filter(report => report.id !== reportId));
      showNotification(`Report "${reportTitle}" deleted!`, 'success');
    };

    const handleAction = (action, report) => {
        let message = '';
        switch (action) {
            case 'View':
                setViewedReport(report);
                message = `Opening report: "${report.title}"`; 
                break;
            case 'Download': message = `Downloading "${report.title}"...`; break;
            case 'Share': message = `Sharing options for "${report.title}"`; break;
            case 'Edit': message = `Editing report: "${report.title}"`; break;
            default: message = 'Action triggered!';
        }
        showNotification(message, action.toLowerCase());
    };
  
  const getStatusPill = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border-2 flex items-center gap-1.5";
    switch (status) {
      case 'completed': return <div className={`${baseClasses} bg-green-500/10 text-green-400 border-green-500/20`}><div className="w-2 h-2 rounded-full bg-green-500"></div>Completed</div>;
      case 'in-progress': return <div className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`}><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>In Progress</div>;
      case 'scheduled': return <div className={`${baseClasses} bg-blue-500/10 text-blue-400 border-blue-500/20`}><Clock className="w-3 h-3"/>Scheduled</div>;
      default: return <div className={`${baseClasses} bg-gray-500/10 text-gray-400 border-gray-500/20`}>Draft</div>;
    }
  };
  
  const getTypeIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case 'trend-analysis': return <TrendingUp {...iconProps} />;
      case 'market-analysis': return <BarChart3 {...iconProps} />;
      case 'forecast': return <PieChart {...iconProps} />;
      case 'summary': return <FileText {...iconProps} />;
      default: return <FileText {...iconProps} />;
    }
  };
  
  const filteredReports = reports.filter(report => 
    filterType === 'all' || report.type === filterType
  );
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <AnimatePresence>
          {notification && <Notification key={notification.id} message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-400 text-lg">Generate, manage, and export comprehensive trend reports.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="bg-transparent hover:bg-gray-800">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </motion.div>
        
        {/* Filters and Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
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
        
        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ReportCardSkeleton key={i} />)
          ) : (
            filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 group hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-800 group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-all rounded-lg flex items-center justify-center text-gray-400">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{report.title}</h3>
                        <p className="text-gray-400 text-sm">by {report.author}</p>
                      </div>
                    </div>
                    {getStatusPill(report.status)}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-5 h-10">{report.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-5 text-center bg-gray-800/50 p-3 rounded-lg">
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.pages} /></p>
                      <p className="text-gray-400 text-xs font-medium">Pages</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.charts} /></p>
                      <p className="text-gray-400 text-xs font-medium">Charts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white"><AnimatedNumber value={report.insights} /></p>
                      <p className="text-gray-400 text-xs font-medium">Insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formatDate(report.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={() => handleAction('View', report)} size="sm" variant="outline" className="flex-1 bg-transparent hover:bg-purple-600 hover:text-white border-gray-700 hover:border-purple-600">
                    <Eye className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                  <Button onClick={() => handleAction('Download', report)} size="icon-sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleAction('Share', report)} size="icon-sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleAction('Edit', report)} size="icon-sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                   <Button onClick={() => handleDelete(report.id, report.title)} size="icon-sm" variant="ghost" className="text-gray-400 hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create New Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleCreateReport}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Report</h2>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowCreateModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="text-sm font-medium text-gray-400 mb-1 block">Report Title</label>
                        <input id="title" name="title" type="text" value={newReportData.title} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Q1 2026 Fintech Trends" required />
                    </div>
                    <div>
                        <label htmlFor="type" className="text-sm font-medium text-gray-400 mb-1 block">Report Type</label>
                        <select id="type" name="type" value={newReportData.type} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="trend-analysis">Trend Analysis</option>
                            <option value="market-analysis">Market Analysis</option>
                            <option value="forecast">Forecast</option>
                            <option value="summary">Summary</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="text-sm font-medium text-gray-400 mb-1 block">Description</label>
                        <textarea id="description" name="description" value={newReportData.description} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="A brief summary of the report's contents..."></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Create Report</Button>
                    </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* View Report Modal */}
      <AnimatePresence>
        {viewedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setViewedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{viewedReport.title}</h2>
                    <p className='text-gray-400 text-sm'>by {viewedReport.author} - {getStatusPill(viewedReport.status)}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => setViewedReport(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                    <p className="text-gray-300">{viewedReport.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-gray-800/50 p-4 rounded-lg">
                        <div>
                            <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.pages} /></p>
                            <p className="text-gray-400 text-sm font-medium">Pages</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.charts} /></p>
                            <p className="text-gray-400 text-sm font-medium">Charts</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white"><AnimatedNumber value={viewedReport.insights} /></p>
                            <p className="text-gray-400 text-sm font-medium">Insights</p>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2">
                        <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>Created: {formatDate(viewedReport.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Clock className="w-3 h-3" />
                            <span>Last Updated: {formatDate(viewedReport.updatedAt)}</span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setViewedReport(null)}>Close</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">Download PDF</Button>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsModule;
