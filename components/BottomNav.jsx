import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radar, Map, MessageSquare, Menu, X, FileText, Settings, Landmark, Shield, GitCompare, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Home' },
    { to: '/radar', icon: <Radar size={24} />, label: 'Radar' },
    { to: '/ai-chat', icon: <MessageSquare size={24} />, label: 'AI' },
    { to: '/map', icon: <Map size={24} />, label: 'Map' },
  ];

  const secondaryLinks = [
    { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/comparison', icon: <GitCompare size={20} />, label: 'Compare' },
    { to: '/markets', icon: <Landmark size={20} />, label: 'Markets' },
    { to: '/google-trends', icon: <TrendingUp size={20} />, label: 'Trends' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/admin', icon: <Shield size={20} />, label: 'Admin' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-lg border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around p-2">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon}
              <span className="text-[10px] mt-1">{link.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isMenuOpen ? 'text-purple-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="text-[10px] mt-1">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-[70px] right-2 z-50 w-48 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-2 space-y-1">
              {secondaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300 hover:bg-white/10'
                    }`
                  }
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;
