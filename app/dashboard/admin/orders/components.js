import React from 'react';
import Link from 'next/link';

export const OrderTableRow = ({ order, config }) => {
  const theme = config.STATUS_THEMES[order.status] || { label: order.status, color: "light" };
  
  return (
    <tr key={order.id}>
      <td className="px-4 py-3 small text-secondary">
        {new Date(order.createdAt).toLocaleDateString('id-ID')}
      </td>
      <td className="px-4 py-3 fw-medium">#{order.id.slice(-6).toUpperCase()}</td>
      <td className="px-4 py-3">
        <div className="fw-bold">{order.user?.name}</div>
        <small className="text-secondary">{order.user?.email}</small>
      </td>
      <td className="px-4 py-3">
        <span className="badge bg-light text-dark border fw-normal">{order.service?.name}</span>
      </td>
      <td className="px-4 py-3">
        {order.staff ? (
          <span className="small"><i className="bi bi-person-badge me-1"></i>{order.staff.name}</span>
        ) : (
          <span className="text-muted small italic">Belum diassign</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`badge bg-${theme.color} shadow-sm`}>{theme.label}</span>
      </td>
      <td className="px-4 py-3">
        <Link href={`/dashboard/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
          Detail
        </Link>
      </td>
    </tr>
  );
};

export const OrdersTable = ({ orders, config }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              {config.TABLE_HEADERS.map((header, i) => (
                <th key={i} className="px-4 py-3 border-0 small text-uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <OrderTableRow key={order.id} order={order} config={config} />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={config.TABLE_HEADERS.length} className="text-center py-5 text-secondary">
                  Belum ada pesanan masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
