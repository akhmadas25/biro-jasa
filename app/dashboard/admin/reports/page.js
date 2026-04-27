'use client';

import React, { useRef } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  // Filter only completed orders for report
  const completedOrders = orders?.filter(o => o.status === 'COMPLETED') || [];

  const handlePrint = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const today = new Date().toLocaleDateString('id-ID');

    // JUDUL
    doc.setFontSize(18);
    doc.text('LAPORAN TRANSAKSI BIRO JASA', 148, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${today}`, 148, 26, { align: 'center' });
    doc.line(20, 30, 277, 30);

    // SUMMARY BOXES (Ringkasan)
    const totalEst = calculateTotalEstimated();
    const totalFix = calculateTotalFixed();
    const totalRef = calculateTotalRefund();

    doc.setFontSize(11);
    doc.text('RINGKASAN KEUANGAN:', 20, 40);
    doc.setFontSize(10);
    doc.text(`Total Estimasi: Rp ${totalEst.toLocaleString()}`, 20, 48);
    doc.text(`Total Biaya Riil (Fixed): Rp ${totalFix.toLocaleString()}`, 110, 48);
    doc.text(`Total Sisa/Kembalian: Rp ${totalRef.toLocaleString()}`, 200, 48);

    // TABEL DATA
    const tableData = completedOrders.map(order => {
      const breakdown = Array.isArray(order.fixedBreakdown)
        ? order.fixedBreakdown.map(item => `${item.label}: ${Number(item.price).toLocaleString()}`).join('\n')
        : '-';

      return [
        new Date(order.createdAt).toLocaleDateString('id-ID'),
        `${order.service?.name}\n(${order.user?.name || 'User'})`,
        breakdown,
        `Rp ${Number(order.estimatedPrice || 0).toLocaleString()}`,
        `Rp ${Number(order.fixedPrice || 0).toLocaleString()}`,
        `Rp ${(Number(order.estimatedPrice || 0) - Number(order.fixedPrice || 0)).toLocaleString()}`
      ];
    });

    autoTable(doc, {
      startY: 55,
      head: [['Tanggal', 'Layanan & User', 'Rincian Riil', 'Estimasi', 'Fixed', 'Kembalian']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: 'fill', fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' }
      }
    });

    // TANDA TANGAN
    const finalY = doc.lastAutoTable?.finalY || 55;
    const signY = finalY + 15;
    doc.text(`Tegal, ${today}`, 230, signY);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(session?.user?.name || 'ADMIN', 230, signY + 25);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('Biro Jasa Official', 230, signY + 30);

    doc.save(`Laporan_Biro_Jasa_${today.replace(/\//g, '-')}.pdf`);
  };

  const calculateTotalEstimated = () => completedOrders.reduce((acc, o) => acc + (Number(o.estimatedPrice) || 0), 0);
  const calculateTotalFixed = () => completedOrders.reduce((acc, o) => acc + (Number(o.fixedPrice) || 0), 0);
  const calculateTotalRefund = () => completedOrders.reduce((acc, o) => {
    const est = Number(o.estimatedPrice) || 0;
    const fix = Number(o.fixedPrice) || 0;
    return acc + (est - fix);
  }, 0);

  if (error) return <div className="p-5 text-center text-danger fw-bold">Gagal memuat data laporan.</div>;
  if (!orders) return <div className="p-5 text-center text-secondary fw-bold">Memuat Data Laporan...</div>;

  return (
    <div className="container py-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold h3 m-0">Laporan Transaksi Selesai</h2>
          <p className="text-secondary small m-0">Ringkasan keuangan dari pesanan yang telah tuntas.</p>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <i className="bi bi-file-earmark-pdf me-2"></i> Cetak PDF
        </Button>
      </header>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
            <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Total Estimasi</small>
            <h3 className="fw-bold text-primary m-0">Rp {calculateTotalEstimated().toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
            <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Biaya Riil (Fixed)</small>
            <h3 className="fw-bold text-success m-0">Rp {calculateTotalFixed().toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 p-3 p-md-4 text-center">
            <small className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Sisa Kembalian</small>
            <h3 className="fw-bold text-danger m-0">Rp {calculateTotalRefund().toLocaleString()}</h3>
          </div>
        </div>
      </div>

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
              {completedOrders.map(order => (
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
              {completedOrders.length === 0 && (
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
    </div>
  );
}
