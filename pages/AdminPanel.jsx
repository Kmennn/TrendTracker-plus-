import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Settings, 
  Database, 
  Activity, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Server,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Loader
} from 'lucide-react';
import Button from '../components/Button';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiRateLimit, setApiRateLimit] = useState(1000);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    console.log('Search query:', e.target.value);
  };

  const handleSaveChanges = () => {
    console.log('Saving settings:', { apiRateLimit, sessionTimeout, emailNotifications, maintenanceMode });
    alert('Settings saved!');
  };
  
  useEffect(() => {
    // Simulate data loading to prevent render errors
    const fetchData = () => {
      setTimeout(() => {
        setUsers([
          { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Analyst', status: 'active', lastLogin: new Date(Date.now() - 7200000) },
          { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'Viewer', status: 'inactive', lastLogin: new Date(Date.now() - 86400000) },
          { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Analyst', status: 'active', lastLogin: new Date(Date.now() - 1800000) }
        ]);
        
        setSystemStats({
          totalUsers: 247,
          activeUsers: 189,
          totalTrends: 1543,
          apiCalls: 45672,
          storageUsed: '2.4 TB',
          uptime: '99.8%'
        });
        
        setAlerts([
          { id: 1, type: 'warning', message: 'High API usage detected', timestamp: new Date(Date.now() - 1800000) },
          { id: 2, type: 'info', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 3600000) },
          { id: 3, type: 'error', message: 'Failed to sync external data source', timestamp: new Date(Date.now() - 7200000) }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-green-400 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.totalUsers}</h3>
          <p className="text-gray-400">Total Users</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.activeUsers}</h3>
          <p className="text-gray-400">Active Users</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-green-400 text-sm font-medium">+23%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.totalTrends}</h3>
          <p className="text-gray-400">Total Trends</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-orange-400" />
            <span className="text-yellow-400 text-sm font-medium">78%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.storageUsed}</h3>
          <p className="text-gray-400">Storage Used</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-8 h-8 text-cyan-400" />
            <span className="text-green-400 text-sm font-medium">{systemStats.uptime}</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.apiCalls.toLocaleString()}</h3>
          <p className="text-gray-400">API Calls Today</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Healthy</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{systemStats.uptime}</h3>
          <p className="text-gray-400">System Uptime</p>
        </div>
      </div>
      
      {/* Recent Alerts */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-gray-400 text-sm">{formatDate(alert.timestamp)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAlertColor(alert.type)}`}>
                {alert.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => alert('Filter button clicked!')}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button onClick={() => alert('Add User button clicked!')}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
      
      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white transition-colors" onClick={() => alert(`Viewing user: ${user.name}`)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors" onClick={() => alert(`Editing user: ${user.name}`)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors" onClick={() => alert(`Deleting user: ${user.name}`)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderSystemHealth = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Server Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">CPU Usage:</span>
              <span className="text-green-400">23%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory Usage:</span>
              <span className="text-yellow-400">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Disk Usage:</span>
              <span className="text-green-400">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network I/O:</span>
              <span className="text-green-400">Normal</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Database Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Connection Pool:</span>
              <span className="text-green-400">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Query Performance:</span>
              <span className="text-green-400">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Backup Status:</span>
              <span className="text-green-400">Up to date</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Replication:</span>
              <span className="text-green-400">Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Rate Limit</label>
            <input
              type="number"
              value={apiRateLimit}
              onChange={(e) => setApiRateLimit(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Enable Email Notifications</span>
            <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Maintenance Mode</span>
            <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="rounded" />
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={handleSaveChanges}>Save Settings</Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-lg text-white">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage users, monitor system health, and configure settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => alert('Export Logs button clicked!')}>
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'system' && renderSystemHealth()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;