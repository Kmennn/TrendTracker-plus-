import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BarChart3, AppWindow, Compass, Map, MessageSquare, FileText, UserCog, Settings, LogOut, Search, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    console.log('Search query:', e.target.value);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/radar', label: 'Trend Radar', icon: AppWindow },
    { path: '/comparison', label: 'Compare', icon: BarChart3 },
    { path: '/map', label: 'Regional Map', icon: Map },
    { path: '/ai-chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  if (user?.role === 'Admin') {
    navLinks.push({ path: '/admin', label: 'Admin', icon: UserCog });
  }

  const NavItem = ({ path, label, icon: Icon }) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
      onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <Compass size={28} className="text-purple-400" />
            </div>
             <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Main navigation links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <NavItem key={link.path} {...link} />
            ))}
          </div>

          {/* Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
             <div className="hidden md:block">
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search trends..." className="bg-gray-700/50 w-64 pl-10 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" value={searchQuery} onChange={handleSearchChange} />
                </div>
            </div>
            
            <button className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <Bell size={22} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
            </button>

            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center">
                <img src={user?.avatar} alt="User" className="w-9 h-9 rounded-full" />
              </button>
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5"
                  >
                    <div className="px-4 py-2 text-sm text-white border-b border-gray-600">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <NavLink to="/settings" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"><Settings size={16} className="mr-2"/> Settings</NavLink>
                    <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
             initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavItem key={link.path} {...link} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;