import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Radar, 
  GitCompare, 
  Map, 
  MessageSquare, 
  FileText, 
  Shield, 
  Settings, 
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/radar', icon: <Radar size={20} />, label: 'Trend Radar' },
  { to: '/comparison', icon: <GitCompare size={20} />, label: 'Keyword Comparison' },
  { to: '/map', icon: <Map size={20} />, label: 'Regional Map' },
  { to: '/ai-chat', icon: <MessageSquare size={20} />, label: 'AI Chat' },
  { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
  { to: '/admin', icon: <Shield size={20} />, label: 'Admin Panel' },
  { to: '/settings', icon: <Settings size={20} />, label: 'User Settings' },
  { to: '/google-trends', icon: <TrendingUp size={20} />, label: 'Google Trends' },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div 
      className={`bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-40`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h2 className="text-2xl font-bold">Navigation</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-700">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-2">
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `flex items-center py-2 px-3 rounded transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ` + 
                  (isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white')
                }
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-4">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
