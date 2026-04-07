'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = url => fetch(url).then(res => res.json());

export default function UserHistoryPage() {
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  if (error) return <div className="p-5">Gagal memuat histori pesanan.</div>;
  if (!orders) return <div className="p-5">Memuat histori...</div>;

  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Riwayat Pesanan Saya</h1>
      <p style={styles.subtitle}>Lacak pesanan dan lihat detail negosiasi Anda.</p>

      <div style={styles.grid}>
        {ordersList.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{order.service?.name}</h3>
              <span style={{...styles.badge, ...(statusColors[order.status] || statusColors.default)}}>
                {order.status}
              </span>
            </div>
            
            <div style={styles.cardBody}>
              <p><strong>ID:</strong> {order.id.slice(-6).toUpperCase()}</p>
              <p><strong>Harga Estimate:</strong> {order.estimatedPrice ? `Rp ${order.estimatedPrice}` : 'Menunggu'}</p>
              <p><strong>Last Update:</strong> {new Date(order.updatedAt).toLocaleDateString('id-ID')}</p>
            </div>
            
            <div style={styles.cardFooter}>
              <Link href={`/dashboard/user/orders/${order.id}`} style={styles.btn}>
                Cek Detail & Chat
              </Link>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#6b7280' }}>
            Anda belum memiliki pesanan. <Link href="/#services" style={{color: '#4f46e5'}}>Mulai pesan sekarang!</Link>
          </p>
        )}
      </div>
    </div>
  );
}

const statusColors = {
  WAITING_ESTIMATE: { backgroundColor: '#fef3c7', color: '#d97706' },
  NEGOTIATING: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  default: { backgroundColor: '#f3f4f6', color: '#4b5563' }
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' },
  subtitle: { color: '#6b7280', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  cardHeader: { padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfdfd' },
  cardTitle: { margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' },
  cardBody: { padding: '1.5rem', fontSize: '0.9rem', color: '#4b5563', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  cardFooter: { padding: '1rem 1.5rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6' },
  btn: { display: 'block', width: '100%', textAlign: 'center', background: '#4f46e5', color: '#fff', padding: '0.6rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s ease' }
};
