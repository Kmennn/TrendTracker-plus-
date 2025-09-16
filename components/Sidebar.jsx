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
  ChevronRight,
  Landmark
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/markets', icon: <Landmark size={20} />, label: 'Markets' },
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
    <aside 
      className={`bg-gradient-to-b from-gray-900/70 to-gray-950/80 backdrop-blur-lg text-white p-4 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-40 border-r border-white/10`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">TrendTraker+</h2>}
        <button onClick={toggleSidebar} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-2">
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''} ` + 
                  (isActive 
                    ? 'bg-purple-600/30 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white')
                }
                title={isCollapsed ? item.label : ''}
              >
                <div className="group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
                {!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-sm text-gray-300">© 2024 TrendTraker+</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
