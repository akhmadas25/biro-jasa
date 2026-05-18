import React from 'react';

export const ReportStats = ({ totalEst, totalFix, totalRef, config }) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
          <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Total Estimasi</small>
          <h3 className="fw-bold m-0" style={{ color: config.COLORS.PRIMARY }}>Rp {totalEst.toLocaleString()}</h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
          <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Biaya Riil (Fixed)</small>
          <h3 className="fw-bold m-0" style={{ color: config.COLORS.SUCCESS }}>Rp {totalFix.toLocaleString()}</h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
          <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Sisa Kembalian</small>
          <h3 className="fw-bold m-0" style={{ color: config.COLORS.DANGER }}>Rp {totalRef.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};

export const ReportTable = ({ orders }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3 border-0">Tanggal</th>
              <th className="px-4 py-3 border-0">Layanan & User</th>
              <th className="px-4 py-3 border-0">Rincian Riil</th>
              <th className="px-4 py-3 border-0 text-end">Estimasi</th>
              <th className="px-4 py-3 border-0 text-end">Fixed</th>
              <th className="px-4 py-3 border-0 text-end">Kembalian</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-4 py-3 small">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-4 py-3">
                  <div className="fw-bold text-dark">{order.service?.name}</div>
                  <div className="text-secondary small">{order.user?.name || 'User'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '250px' }}>
                    {Array.isArray(order.fixedBreakdown) ? (
                      order.fixedBreakdown.map((item, i) => (
                        <span key={i} className="badge bg-light text-dark border fw-normal small px-2 py-1" style={{ fontSize: '0.65rem' }}>
                          {item.label}: {Number(item.price).toLocaleString()}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small italic">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-end fw-medium">
                  Rp {Number(order.estimatedPrice || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-end fw-medium text-success">
                  Rp {(Number(order.fixedPrice) || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-end fw-bold text-danger">
                  Rp {((Number(order.estimatedPrice) || 0) - (Number(order.fixedPrice) || 0)).toLocaleString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 text-secondary">
                  Belum ada data pesanan selesai untuk laporan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
