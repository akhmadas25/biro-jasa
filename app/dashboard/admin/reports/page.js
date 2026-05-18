'use client';

import React from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import Konfigurasi & Komponen Baru
import { REPORT_CONFIG } from './constants';
import { ReportStats, ReportTable } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const { data: orders, error } = useSWR('/api/orders', fetcher);

  // 1. Data Processing
  const completedOrders = orders?.filter(o => o.status === 'COMPLETED') || [];

  const totalEst = completedOrders.reduce((acc, o) => acc + (Number(o.estimatedPrice) || 0), 0);
  const totalFix = completedOrders.reduce((acc, o) => acc + (Number(o.fixedPrice) || 0), 0);
  const totalRef = totalEst - totalFix;

  // 2. PDF Logic (Logic dipusatkan di sini agar mudah di-debug)
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const today = new Date().toLocaleDateString('id-ID');

    // Header PDF
    doc.setFontSize(18);
    doc.text(REPORT_CONFIG.TITLE, 148, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${today}`, 148, 26, { align: 'center' });
    doc.line(20, 30, 277, 30);

    // Tabel di PDF
    const rows = completedOrders.map(order => [
      new Date(order.createdAt).toLocaleDateString('id-ID'),
      `${order.service?.name}\n(${order.user?.name || 'User'})`,
      Array.isArray(order.fixedBreakdown) ? order.fixedBreakdown.map(it => `${it.label}: ${Number(it.price).toLocaleString()}`).join('\n') : '-',
      `Rp ${Number(order.estimatedPrice || 0).toLocaleString()}`,
      `Rp ${Number(order.fixedPrice || 0).toLocaleString()}`,
      `Rp ${(Number(order.estimatedPrice || 0) - Number(order.fixedPrice || 0)).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [REPORT_CONFIG.TABLE_HEADERS],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: REPORT_CONFIG.COLORS.TABLE_HEADER, textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right', fontStyle: 'bold' } }
    });

    // Tanda Tangan di PDF
    const finalY = doc.lastAutoTable?.finalY || 55;
    const signY = finalY + 15;
    doc.text(`${REPORT_CONFIG.LOCATION}, ${today}`, 230, signY);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(session?.user?.name || 'ADMIN', 230, signY + 25);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(REPORT_CONFIG.OFFICIAL_NAME, 230, signY + 30);

    doc.save(`${REPORT_CONFIG.FILENAME_PREFIX}_${today.replace(/\//g, '-')}.pdf`);
  };

  if (error) return <div className="p-5 text-center text-danger fw-bold">Gagal memuat data.</div>;
  if (!orders) return <div className="p-5 text-center text-secondary fw-bold">Memuat...</div>;

  return (
    <div className="container py-4">
      {/* 1. Header Page */}
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold h3 m-0">{REPORT_CONFIG.TITLE}</h2>
          <p className="text-secondary small m-0">{REPORT_CONFIG.SUBTITLE}</p>
        </div>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <i className="bi bi-file-earmark-pdf me-2"></i> Cetak PDF
        </Button>
      </header>

      {/* 2. Statistik (Component) */}
      {/* <ReportStats
        totalEst={totalEst}
        totalFix={totalFix}
        totalRef={totalRef}
        config={REPORT_CONFIG}
      /> */}

      {/* 3. Tabel Data (Component) */}
      <ReportTable orders={completedOrders} />
    </div>
  );
}
