'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';

// Import Konfigurasi & Komponen
import { HISTORY_CONFIG } from './constants';
import { UserOrderCard } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function UserHistoryPage() {
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  if (error) return <div className="p-5 text-center text-danger fw-bold">Gagal memuat histori pesanan.</div>;
  if (!orders) return <div className="p-5 text-center text-secondary fw-bold">Memuat histori...</div>;

  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="fw-bold h2 text-dark m-0">{HISTORY_CONFIG.TITLE}</h1>
        <p className="text-secondary small m-0 mt-1">{HISTORY_CONFIG.SUBTITLE}</p>
      </header>

      <div className="row g-4">
        {ordersList.map(order => (
          <UserOrderCard key={order.id} order={order} config={HISTORY_CONFIG} />
        ))}
        
        {ordersList.length === 0 && (
          <div className="col-12 text-center py-5 opacity-50">
            <i className="bi bi-clock-history display-1 mb-3"></i>
            <h5>{HISTORY_CONFIG.EMPTY_MSG}</h5>
            <Link href="/#services" className="btn btn-outline-primary mt-3 rounded-pill">
              {HISTORY_CONFIG.LINK_START}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
