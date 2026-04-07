'use client';
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const sidebarWidth = isCollapsed ? '80px' : '280px';

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      <DashboardSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <main 
        className="flex-grow-1 p-4"
        style={{ 
          marginLeft: sidebarWidth, 
          minWidth: 0,
          minHeight: '100vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}
      >
        <div className="h-100 container-fluid p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
