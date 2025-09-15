import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell, CreditCard, Camera } from 'lucide-react';
import Button from '../components/Button';

// A simple toggle switch component
const ToggleSwitch = ({ enabled, setEnabled }) => (
  <button
    type="button"
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
      enabled ? 'bg-purple-600' : 'bg-gray-600'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);


const UserSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState({
    trendAlerts: true,
    weeklySummary: true,
    comments: false,
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    // Ideally, show a success toast message here
    alert('Profile updated successfully!');
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    // Mock password change logic
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 ml-64">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="flex space-x-1 sm:space-x-8 border-b border-gray-700 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-3 px-1 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-800 rounded-xl shadow-lg"
        >
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
                <div className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                        <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
                        <button type="button" className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-bold">{user?.name}</h3>
                          <p className="text-gray-400 text-sm capitalize">{user?.role} Account</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full max-w-md bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full max-w-md bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700/50 px-8 py-4 rounded-b-xl flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange}>
              <div className="p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                <div className="space-y-6 max-w-md">
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>
              </div>
              <div className="bg-gray-700/50 px-8 py-4 rounded-b-xl flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <div className="p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white">New Trend Alerts</h4>
                            <p className="text-gray-400 text-sm">Get notified when new significant trends emerge.</p>
                        </div>
                        <ToggleSwitch enabled={notifications.trendAlerts} setEnabled={(val) => setNotifications(p => ({...p, trendAlerts: val}))} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white">Weekly Summary</h4>
                            <p className="text-gray-400 text-sm">Receive a weekly digest of top trends.</p>
                        </div>
                        <ToggleSwitch enabled={notifications.weeklySummary} setEnabled={(val) => setNotifications(p => ({...p, weeklySummary: val}))} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white">Comments & Mentions</h4>
                            <p className="text-gray-400 text-sm">Get notified about discussions on trends you follow.</p>
                        </div>
                        <ToggleSwitch enabled={notifications.comments} setEnabled={(val) => setNotifications(p => ({...p, comments: val}))} />
                    </div>
                </div>
              </div>
               <div className="bg-gray-700/50 px-8 py-4 rounded-b-xl flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
             <div className="p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Your Plan</h2>
               <div className="bg-gray-700/50 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-600 text-purple-100 rounded-full text-sm font-semibold mb-2">Pro Plan</span>
                    <p className="text-gray-300">Your plan renews on January 1, 2025.</p>
                  </div>
                  <Button variant="outline" className="mt-4 sm:mt-0">Manage Subscription</Button>
               </div>
               
               <div className="mt-8 pt-8 border-t border-gray-700">
                 <h3 className="text-lg font-semibold text-white mb-4">Delete Account</h3>
                 <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-red-300 mb-4 sm:mb-0 sm:mr-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="danger">Delete My Account</Button>
                 </div>
               </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default UserSettings;