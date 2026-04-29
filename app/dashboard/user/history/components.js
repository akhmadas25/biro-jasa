import React from 'react';
import Link from 'next/link';

export const UserOrderCard = ({ order, config }) => {
  const theme = config.STATUS_THEMES[order.status] || config.STATUS_THEMES.default;

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 d-flex flex-column">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0 small text-uppercase text-primary">{order.service?.name}</h5>
          <span className={`badge bg-${theme.color} rounded-pill px-3 py-2 small`}>{theme.label}</span>
        </div>
        
        <div className="card-body p-4 flex-grow-1">
          <div className="mb-3">
            <label className="text-secondary small d-block mb-1">ID Pesanan</label>
            <p className="fw-mono m-0 text-dark">#{order.id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="mb-3">
            <label className="text-secondary small d-block mb-1">Harga Estimasi</label>
            <p className="fw-bold m-0 text-dark">
              {order.estimatedPrice ? `Rp ${order.estimatedPrice.toLocaleString()}` : 'Menunggu Admin...'}
            </p>
          </div>
          <div className="mb-0">
            <label className="text-secondary small d-block mb-1">Update Terakhir</label>
            <p className="small m-0 text-muted">{new Date(order.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div className="card-footer bg-light border-top p-4">
          <Link href={`/dashboard/user/orders/${order.id}`} className="btn btn-primary w-100 fw-bold rounded-pill shadow-sm">
            {config.BUTTON_TEXT}
          </Link>
        </div>
      </div>
    </div>
  );
};
