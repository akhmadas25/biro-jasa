'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminOrdersPage() {
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  if (error) return <div className="p-5">Failed to load orders.</div>;
  if (!orders) return <div className="p-5">Loading orders...</div>;

  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard Admin</h1>
      <p style={styles.subtitle}>Kelola semua pesanan, negosiasi, dan penugasan staff.</p>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID Pesanan</th>
              <th style={styles.th}>Layanan</th>
              <th style={styles.th}>Pelanggan</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map(order => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.idBadge}>{order.id.slice(-6).toUpperCase()}</span>
                </td>
                <td style={styles.td}><strong>{order.service?.name}</strong></td>
                <td style={styles.td}>{order.user?.name || order.user?.email}</td>
                <td style={styles.td}>
                  <span style={{...styles.statusBadge, ...(statusColors[order.status] || statusColors.default)}}>
                    {order.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <Link href={`/dashboard/admin/orders/${order.id}`} style={styles.actionBtn}>
                    Kelola
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada pesanan masuk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const statusColors = {
  WAITING_ESTIMATE: { backgroundColor: '#fef3c7', color: '#d97706' },
  NEGOTIATING: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  PAYMENT_VERIFY: { backgroundColor: '#cffafe', color: '#0891b2' },
  PAID: { backgroundColor: '#dcfce7', color: '#16a34a' },
  default: { backgroundColor: '#f3f4f6', color: '#4b5563' }
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' },
  subtitle: { color: '#6b7280', marginBottom: '2rem' },
  tableContainer: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '1rem 1.5rem', background: '#f9fafb', color: '#374151', fontWeight: '600', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', color: '#4b5563' },
  tr: { transition: 'background-color 0.2s ease', ':hover': { backgroundColor: '#f9fafb' } },
  idBadge: { background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'monospace' },
  statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '500' },
  actionBtn: { textDecoration: 'none', background: '#111827', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s ease' }
};
