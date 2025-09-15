import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Share2,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import Button from '../components/Button';

const ReportsModule = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    setReports([
      {
        id: 1,
        title: 'Q4 2024 Trend Analysis Report',
        type: 'trend-analysis',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 3600000),
        author: 'AI System',
        description: 'Comprehensive analysis of emerging trends in technology and sustainability',
        pages: 24,
        charts: 8,
        insights: 15
      },
      {
        id: 2,
        title: 'Regional Market Comparison',
        type: 'market-analysis',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 7200000),
        author: 'John Smith',
        description: 'Geographic distribution analysis of key market trends',
        pages: 18,
        charts: 12,
        insights: 22
      },
      {
        id: 3,
        title: 'AI Technology Forecast 2025',
        type: 'forecast',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 1800000),
        author: 'Sarah Johnson',
        description: 'Predictive analysis of AI technology adoption and growth patterns',
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
        description: 'Automated weekly compilation of trending topics and metrics',
        pages: 8,
        charts: 5,
        insights: 10
      }
    ]);
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'trend-analysis': return <TrendingUp className="w-4 h-4" />;
      case 'market-analysis': return <BarChart3 className="w-4 h-4" />;
      case 'forecast': return <PieChart className="w-4 h-4" />;
      case 'summary': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };
  
  const filteredReports = reports.filter(report => 
    filterType === 'all' || report.type === filterType
  );
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-400">Generate, manage, and export comprehensive trend reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Reports</option>
                <option value="trend-analysis">Trend Analysis</option>
                <option value="market-analysis">Market Analysis</option>
                <option value="forecast">Forecasts</option>
                <option value="summary">Summaries</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{filteredReports.length} reports found</span>
            </div>
          </div>
        </div>
        
        {/* Reports Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{report.title}</h3>
                    <p className="text-gray-400 text-sm">by {report.author}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{report.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-white font-semibold">{report.pages}</p>
                  <p className="text-gray-400 text-xs">Pages</p>
                </div>
                <div>
                  <p className="text-white font-semibold">{report.charts}</p>
                  <p className="text-gray-400 text-xs">Charts</p>
                </div>
                <div>
                  <p className="text-white font-semibold">{report.insights}</p>
                  <p className="text-gray-400 text-xs">Insights</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {formatDate(report.updatedAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">Trend Analysis</h3>
                <p className="text-gray-400 text-sm">Generate comprehensive trend reports</p>
              </div>
            </div>
            <Button size="sm" className="w-full">
              Create Trend Report
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Market Analysis</h3>
                <p className="text-gray-400 text-sm">Analyze market trends and opportunities</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Create Market Report
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-white font-semibold">Scheduled Reports</h3>
                <p className="text-gray-400 text-sm">Automate regular report generation</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Setup Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;