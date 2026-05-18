'use client';
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    const isMobile = window.innerWidth < 992;
    
    if (saved !== null) {
      setIsCollapsed(isMobile ? true : saved === 'true');
    } else {
      setIsCollapsed(isMobile);
    }
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isMounted) return null;

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      {/* Mobile Backdrop */}
      {!isCollapsed && isMounted && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-index-1000" 
          style={{ zIndex: 999 }}
          onClick={toggleSidebar}
        />
      )}

      <DashboardSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      
      <main 
        className="flex-grow-1"
        style={{ 
          marginLeft: '0', 
          minWidth: 0,
          minHeight: '100vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}
      >
        {/* Mobile Header */}
        <div className="d-lg-none bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top z-index-100">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light border-0 rounded-circle p-2" onClick={toggleSidebar}>
              <i className="bi bi-list fs-4"></i>
            </button>
            <span className="fw-bold">CV BS Jasa</span>
          </div>
        </div>

        <div 
          className="p-3 p-md-4"
          style={{ 
            '--sidebar-width': isCollapsed ? '80px' : '280px'
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 992px) {
              main {
                margin-left: ${isCollapsed ? '80px' : '280px'} !important;
              }
            }
          ` }} />
          <div className="h-100 container-fluid p-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
