'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

// Import Konfigurasi & Komponen
import { USER_MGMT_CONFIG } from './constants';
import { UserTable } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminUsersPage() {
  const { data: users, mutate } = useSWR('/api/admin/users', fetcher);
  const [isUpdating, setIsUpdating] = useState(null);

  const handleUpdateRole = async (userId, newRole) => {
    setIsUpdating(userId);
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      mutate();
    } catch (error) {
      console.error('Update role error:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h2 className="fw-bold h3 m-0">{USER_MGMT_CONFIG.TITLE}</h2>
        <p className="text-secondary small m-0">{USER_MGMT_CONFIG.SUBTITLE}</p>
      </header>

      <UserTable 
        users={users} 
        onUpdate={handleUpdateRole} 
        isUpdating={isUpdating} 
        config={USER_MGMT_CONFIG} 
      />
    </div>
  );
}
