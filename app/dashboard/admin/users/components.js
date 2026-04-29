import React from 'react';
import Button from '@/components/ui/Button/Button';

export const UserTableRow = ({ user, onUpdate, isUpdating, config }) => {
  const theme = config.ROLE_THEMES[user.role] || config.ROLE_THEMES.USER;

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="fw-bold text-dark">{user.name || 'Anonymous'}</div>
        <div className="text-secondary small">{user.email}</div>
      </td>
      <td className="px-4 py-3">
        <span className={`badge bg-${theme.color} px-3 py-2 rounded-pill`}>
          {theme.label}
        </span>
      </td>
      <td className="px-4 py-3 text-end">
        <div className="d-flex gap-2 justify-content-end">
          {user.role === 'USER' && (
            <Button variant="success" className="btn-sm" onClick={() => onUpdate(user.id, 'STAFF')} isLoading={isUpdating === user.id}>
              {config.ACTIONS.PROMOTE_TO_STAFF}
            </Button>
          )}
          {user.role === 'STAFF' && (
            <Button variant="secondary" className="btn-sm" onClick={() => onUpdate(user.id, 'USER')} isLoading={isUpdating === user.id}>
              {config.ACTIONS.DEMOTE_TO_USER}
            </Button>
          )}
          {user.role === 'SUPERADMIN' && (
            <span className="text-muted small italic opacity-50">{config.ACTIONS.ADMIN_LOCKED}</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export const UserTable = ({ users, onUpdate, isUpdating, config }) => {
  return (
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
            {(users || []).map(user => (
              <UserTableRow key={user.id} user={user} onUpdate={onUpdate} isUpdating={isUpdating} config={config} />
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-5 text-secondary small">Belum ada data user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
