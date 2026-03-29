import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { useMediaQuery } from '../hooks/useMediaQuery';

const AppShell = () => {
  // Breakpoints mapping to Tailwind's default suite:
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on tablet, expand on desktop
  useEffect(() => {
    if (isTablet) {
      setIsSidebarCollapsed(true);
    } else if (isDesktop) {
      setIsSidebarCollapsed(false);
    }
  }, [isTablet, isDesktop]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Desktop & Tablet Sidebar */}
      {!isMobile && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      )}

      {/* Main Content Handler */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
           !isMobile ? (isSidebarCollapsed ? 'ml-[80px]' : 'ml-[256px]') : 'ml-0'
         }`}>
        
        {/* Header - Hidden on mobile if you want more space, or keep it. 
            Design choice: Keep Header for Search/Notifications on all devices? 
            Let's keep it but maybe simplify for mobile later. */}
        <Header />

        {/* Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden ${isMobile ? 'pb-24' : ''}`}>
           <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default AppShell;
