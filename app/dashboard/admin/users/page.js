'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';

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
        body: JSON.stringify({ userId: userId, role: newRole }),
      });
      mutate();
    } catch (error) {
      console.error('Update role error:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPERADMIN': return 'bg-danger';
      case 'STAFF': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold h3 m-0">Manajemen User</h2>
          <p className="text-secondary">Kelola hak akses dan peran staff biro jasa.</p>
        </div>
      </header>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0">Nama & Email</th>
                <th className="px-4 py-3 border-0">Role Sekarang</th>
                <th className="px-4 py-3 border-0 text-end">Aksi Perubahan Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{user.name || 'No Name'}</div>
                    <div className="text-secondary small">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${getRoleBadgeClass(user.role)} px-3 py-2 rounded-pill`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      {user.role === 'USER' ? (
                        <Button 
                          variant="success" 
                          className="btn-sm" 
                          onClick={() => handleUpdateRole(user.id, 'STAFF')}
                          isLoading={isUpdating === user.id}
                        >
                          Promosikan ke Staff
                        </Button>
                      ) : user.role === 'STAFF' ? (
                        <Button 
                          variant="secondary" 
                          className="btn-sm" 
                          onClick={() => handleUpdateRole(user.id, 'USER')}
                          isLoading={isUpdating === user.id}
                        >
                          Jadikan User Biasa
                        </Button>
                      ) : (
                        <span className="text-muted small italic">Admin tidak bisa diubah</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-secondary small">
                    Belum ada data user yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
