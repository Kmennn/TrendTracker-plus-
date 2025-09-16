import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, AppWindow, Compass, Map, MessageSquare, FileText, UserCog, Settings, LogOut, Zap
} from 'lucide-react';
import SearchBar from './SearchBar';
import Notifications from './Notifications'; // --- NEW: Import Notifications component

const Header = () => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/radar', label: 'Trend Radar', icon: AppWindow },
    { path: '/comparison', label: 'Compare', icon: BarChart3 },
    { path: '/map', label: 'Regional Map', icon: Map },
    { path: '/ai-chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/alerts', label: 'Alerts', icon: Zap },
  ];

  if (user?.role === 'Admin') {
    navLinks.push({ path: '/admin', label: 'Admin', icon: UserCog });
  }

  const NavItem = ({ path, label, icon: Icon }) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-30 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Compass size={28} className="text-purple-400" />
            <div className="hidden md:flex items-center space-x-2">
                {navLinks.map((link) => (
                    <NavItem key={link.path} {...link} />
                ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
                <SearchBar />
            </div>

            {/* --- NEW: Notifications component integrated --- */}
            <Notifications />

            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center">
                <img src={user?.avatar || '/avatar.png'} alt="User" className="w-9 h-9 rounded-full" />
              </button>
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5"
                  >
                    <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                      <p className="font-semibold">{user?.name || 'John Doe'}</p>
                      <p className="text-gray-400 truncate">{user?.email || 'john.doe@example.com'}</p>
                    </div>
                    <NavLink to="/settings" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><Settings size={16} className="mr-2"/> Settings</NavLink>
                    <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
