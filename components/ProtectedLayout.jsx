import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const ProtectedLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-950 text-white">
      {/* Background styles */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-gray-950 via-gray-950 to-transparent z-0"></div>
      <div className="absolute inset-0 h-full w-full bg-cover bg-center" style={{ backgroundImage: 'url(/background-stars.jpg)', opacity: 0.3 }}></div>

      {/* Sidebar is fixed and takes up space on the left */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Main content area, with a margin-left to avoid the sidebar */}
      <div
        className="relative transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        {/* Header and Outlet are now perfectly aligned within this container */}
        <Header />
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
