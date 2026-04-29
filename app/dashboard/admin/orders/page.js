'use client';

import React from 'react';
import useSWR from 'swr';

// Import Konfigurasi & Komponen
import { ORDERS_CONFIG } from './constants';
import { OrdersTable } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminOrdersPage() {
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  if (error) return <div className="p-5 text-center text-danger fw-bold">Gagal memuat data pesanan.</div>;
  if (!orders) return <div className="p-5 text-center text-secondary fw-bold">Memuat pesanan...</div>;

  const ordersList = Array.isArray(orders) ? orders : [];

  return (
    <div className="container py-4">
      {/* Header Halaman */}
      <header className="mb-4">
        <h2 className="fw-bold h3 m-0">{ORDERS_CONFIG.TITLE}</h2>
        <p className="text-secondary small m-0">{ORDERS_CONFIG.SUBTITLE}</p>
      </header>

      <OrdersTable orders={ordersList} config={ORDERS_CONFIG} />
    </div>
  );
}
