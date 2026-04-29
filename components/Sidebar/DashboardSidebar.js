'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;

  const NavItem = ({ href, icon, label }) => {
    const isActive = pathname.startsWith(href);
    return (
      <Link href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        <i className={`bi ${icon}`}></i>
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : styles.expandedMobile}`}>
      <button className={styles.toggleBtn} onClick={onToggle}>
        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
      </button>

      {/* Mobile Close Button */}
      <button className="d-lg-none btn btn-link text-white position-absolute top-0 end-0 m-3 p-0" onClick={onToggle}>
        <i className="bi bi-x-lg fs-4"></i>
      </button>

      <Link href="/" className={styles.logo}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          width="32" 
          height="32" 
          className={!isCollapsed ? 'me-2' : ''}
        />
        {!isCollapsed && <span>CV BS Jasa</span>}
      </Link>

      <nav className={styles.nav}>
        {role === 'USER' && (
          <>
            <NavItem href="/dashboard/user/history" icon="bi-clock-history" label="Riwayat Pesanan" />
            <NavItem href="/dashboard/user/new-order" icon="bi-plus-circle" label="Pesan Baru" />
          </>
        )}

        {role === 'SUPERADMIN' && (
          <>
            <NavItem href="/dashboard/admin/orders" icon="bi-list-ul" label="Semua Pesanan" />
            <NavItem href="/dashboard/admin/chats" icon="bi-chat-dots" label="Pesan / Chat" />
            <NavItem href="/dashboard/admin/services" icon="bi-gear" label="Kelola Layanan" />
            <NavItem href="/dashboard/admin/users" icon="bi-people" label="Manajemen User" />
            <NavItem href="/dashboard/admin/reports" icon="bi-file-earmark-bar-graph" label="Laporan Keuangan" />
          </>
        )}

        {role === 'STAFF' && (
          <>
            <NavItem href="/dashboard/staff/tasks" icon="bi-clipboard-check" label="Tugas Lapangan" />
          </>
        )}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className={styles.userText}>
              <span className={styles.userName}>{session?.user?.name || 'User'}</span>
              <span className={styles.userRole}>{role}</span>
            </div>
          )}
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
          <i className="bi bi-box-arrow-right"></i>
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
