import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Settings, Database, Activity, Shield, AlertTriangle, TrendingUp, BarChart3, Server,
  Eye, Edit, Trash2, Plus, Search, Filter, Download, Loader
} from 'lucide-react';
import Button from '../components/Button';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [trends, setTrends] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiRateLimit, setApiRateLimit] = useState(1000);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const trendsRef = ref(db, 'trends');
    onValue(trendsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setTrends(Object.keys(data).map(key => ({ id: key, ...data[key] })));
    });
    
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Analyst', status: 'active', lastLogin: new Date(Date.now() - 7200000) },
        { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'Viewer', status: 'inactive', lastLogin: new Date(Date.now() - 86400000) },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Analyst', status: 'active', lastLogin: new Date(Date.now() - 1800000) }
      ]);
      setSystemStats({ totalUsers: 247, activeUsers: 189, totalTrends: 1543, apiCalls: 45672, storageUsed: '2.4 TB', uptime: '99.8%' });
      setAlerts([
        { id: 1, type: 'warning', message: 'High API usage detected', timestamp: new Date(Date.now() - 1800000) },
        { id: 2, type: 'info', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 3600000) },
        { id: 3, type: 'error', message: 'Failed to sync external data source', timestamp: new Date(Date.now() - 7200000) }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveChanges = () => alert('Settings saved!');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusPill = (status) => {
    const styles = {
      active: 'bg-green-500/10 text-green-300 border-green-500/20',
      inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      suspended: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>{status}</span>;
  };

  const getAlertPill = (type) => {
    const styles = {
      error: 'bg-red-500/10 text-red-300 border-red-500/20',
      warning: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
      info: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[type] || styles.info}`}>{type}</span>;
  };

  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[ { icon: Users, title: 'Total Users', value: systemStats.totalUsers, change: '+12%', color: 'blue' }, { icon: Activity, title: 'Active Users', value: systemStats.activeUsers, change: '+8%', color: 'green' }, { icon: TrendingUp, title: 'Total Trends', value: systemStats.totalTrends, change: '+23%', color: 'purple' }, { icon: Database, title: 'Storage Used', value: systemStats.storageUsed, change: '78%', color: 'orange' }, { icon: Server, title: 'API Calls Today', value: systemStats.apiCalls.toLocaleString(), change: '99.8%', color: 'cyan' }, { icon: Shield, title: 'System Uptime', value: systemStats.uptime, change: 'Healthy', color: 'green' } ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 text-${item.color}-400`} />
                <span className={`text-${item.change.startsWith('+') ? 'green' : 'yellow'}-400 text-sm font-medium`}>{item.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-white">{item.value}</h3>
              <p className="text-gray-400">{item.title}</p>
            </motion.div>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-5 h-5 text-${alert.type === 'error' ? 'red' : 'yellow'}-400`} />
                <div>
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-gray-400 text-sm">{formatDate(alert.timestamp)}</p>
                </div>
              </div>
              {getAlertPill(alert.type)}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button><Plus className="w-4 h-4 mr-2" />Add User</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>{['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4"><p className="text-white font-medium">{user.name}</p><p className="text-gray-400 text-sm">{user.email}</p></td>
                <td className="px-6 py-4"><span className="text-gray-300">{user.role}</span></td>
                <td className="px-6 py-4">{getStatusPill(user.status)}</td>
                <td className="px-6 py-4 text-gray-300 text-sm">{formatDate(user.lastLogin)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button size="icon-sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                    <Button size="icon-sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                    <Button size="icon-sm" variant="outline" className="hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="grid md:grid-cols-2 gap-6">
    {[ { title: 'Server Status', stats: [ { label: 'CPU Usage', value: '23%', color: 'green' }, { label: 'Memory Usage', value: '67%', color: 'yellow' }, { label: 'Disk Usage', value: '45%', color: 'green' }, { label: 'Network I/O', value: 'Normal', color: 'green' } ] }, { title: 'Database Status', stats: [ { label: 'Connection Pool', value: 'Healthy', color: 'green' }, { label: 'Query Performance', value: 'Optimal', color: 'green' }, { label: 'Backup Status', value: 'Up to date', color: 'green' }, { label: 'Replication', value: 'Synced', color: 'green' } ] } ].map((card, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{card.title}</h3>
          <div className="space-y-3">
            {card.stats.map(stat => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-gray-400">{stat.label}:</span>
                <span className={`font-semibold text-${stat.color}-400`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-white mb-6">System Configuration</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">API Rate Limit (requests/min)</label>
          <input type="number" value={apiRateLimit} onChange={(e) => setApiRateLimit(parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
          <input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
          <div>
            <p className="font-medium text-white">Enable Email Notifications</p>
            <p className="text-sm text-gray-400">Receive alerts and summaries via email.</p>
          </div>
          <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="w-5 h-5 rounded text-purple-500 bg-black/40 border-white/20 focus:ring-purple-500/50" />
        </div>
        <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30">
          <div>
            <p className="font-medium text-red-300">Maintenance Mode</p>
            <p className="text-sm text-red-400/80">Temporarily disable access to the application for all users.</p>
          </div>
          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="w-5 h-5 rounded text-red-500 bg-black/40 border-white/20 focus:ring-red-500/50" />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </motion.div>
  );

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-950"><Loader className="w-12 h-12 text-purple-500 animate-spin" /><p className="ml-4 text-lg text-white">Loading Admin Panel...</p></div>;
  
  return (
    <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-1">Admin Panel</h1>
                <p className="text-gray-400 text-lg">Manage users, monitor system health, and configure settings</p>
            </div>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Logs</Button>
            </div>
        </header>

        <div className="mb-8">
            <div className="flex space-x-1 bg-black/30 backdrop-blur-sm border border-white/10 p-1 rounded-lg">
                {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab !== tab.id ? 'text-gray-400 hover:text-white' : ''}`}>
                    {activeTab === tab.id && <motion.div layoutId="active-admin-tab" className="absolute inset-0 bg-white/10 rounded-md" />}
                    <div className="relative z-10 flex items-center justify-center space-x-2"><tab.icon className="w-4 h-4" /><span>{tab.label}</span></div>
                </button>
                ))}
            </div>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'system' && renderSystemHealth()}
            {activeTab === 'settings' && renderSettings()}
        </motion.div>
    </div>
  );
};

export default AdminPanel;
