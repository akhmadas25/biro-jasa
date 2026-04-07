'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminOrderDetailPage({ params }) {
  const [orderId, setOrderId] = useState(null);
  const [estimatePrice, setEstimatePrice] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    params.then(p => setOrderId(p.id));
  }, [params]);

  const { data: order, mutate } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    fetcher
  );

  const { data: staffList } = useSWR(
    '/api/users/staff',
    fetcher
  );

  if (!order) return <div style={{ padding: '2rem' }}>Loading Detail...</div>;

  const updateOrder = async (payload) => {
    setIsUpdating(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    mutate();
    setIsUpdating(false);
  };

  const handleSetEstimate = () => updateOrder({ estimatedPrice: Number(estimatePrice), status: 'WAITING_ESTIMATE' });
  const handleSetAgreed = () => updateOrder({ 
    agreedPrice: Number(agreedPrice), 
    paymentInstructions,
    status: 'PAYMENT_PENDING' 
  });
  const handleApprovePayment = () => updateOrder({ paymentStatus: 'PAID', status: 'WAITING_DOCUMENTS' });
  const handleAssignStaff = () => {
    if (!selectedStaffId) return;
    updateOrder({ staffId: selectedStaffId, status: 'ASSIGNED_TO_STAFF' });
  };

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold h4 m-0 text-dark">Kelola Pesanan • {order.id.slice(-6).toUpperCase()}</h2>
          <p className="text-secondary small m-0 mt-1">
            Status: <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{order.status}</span>
          </p>
        </div>
      </header>

      <div className="row g-4">
        {/* Panel Info User */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Detail Klien</h6>
            <div className="mb-3">
              <label className="text-muted small d-block">Nama Lengkap</label>
              <span className="fw-semibold text-dark">{order.formDetails?.fullName}</span>
            </div>
            <div className="mb-3">
              <label className="text-muted small d-block">Nomor WhatsApp</label>
              <span className="fw-semibold text-dark">{order.formDetails?.phoneNumber}</span>
            </div>
            <div className="mb-0">
              <label className="text-muted small d-block">Catatan Khusus</label>
              <div className="p-3 bg-light rounded-3 small text-secondary mt-1">
                {order.formDetails?.notes || 'Tidak ada catatan.'}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Harga & Nego */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Estimasi & Harga Deal</h6>
            
            <div className="mb-4 pb-4 border-bottom">
              <label className="text-muted small d-block mb-2">Estimasi Saat Ini: <span className="text-dark fw-bold">{order.estimatedPrice ? `Rp ${order.estimatedPrice.toLocaleString()}` : 'Belum Ada'}</span></label>
              <div className="d-flex gap-2 align-items-center">
                <Input 
                  placeholder="Harga..." 
                  type="number"
                  value={estimatePrice} 
                  onChange={e => setEstimatePrice(e.target.value)} 
                  className="mb-0 flex-grow-1"
                />
                <Button size="sm" onClick={handleSetEstimate} isLoading={isUpdating} className="m-0">Set</Button>
              </div>
            </div>

            <div className="mb-0">
              <label className="text-muted small d-block mb-2">Harga Deal: <span className="text-success fw-bold">{order.agreedPrice ? `Rp ${order.agreedPrice.toLocaleString()}` : 'Belum Deal'}</span></label>
              <Input 
                type="number" 
                placeholder="Harga Final" 
                value={agreedPrice} 
                onChange={(e) => setAgreedPrice(e.target.value)} 
                className="mb-3"
              />
              <div className="mb-3">
                <label className="text-muted small d-block mb-1">Instruksi Pembayaran (Custom):</label>
                <textarea 
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="Contoh: Transfer ke Rek BCA 123... "
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  rows={3}
                />
              </div>
              <Button variant="success" className="w-100 shadow-sm text-white fw-bold" onClick={handleSetAgreed} isLoading={isUpdating} disabled={!agreedPrice}>
                <i className="bi bi-hammer me-2"></i> Ketok Palu (Deal)
              </Button>
            </div>
          </div>
        </div>

        {/* Panel Pembayaran & Staff */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Status & Penugasan</h6>
            
            <div className="mb-4 pb-4 border-bottom">
              <label className="text-muted small d-block mb-1">Pembayaran</label>
              <div className="d-flex align-items-center justify-content-between">
                <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'} px-3 py-2`}>
                  {order.paymentStatus}
                </span>
                {order.paymentProofUrl && (
                  <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-decoration-none">
                    <i className="bi bi-image me-1"></i> Bukti
                  </a>
                )}
              </div>
              {order.paymentStatus === 'PENDING_VERIFICATION' && (
                <Button variant="secondary" className="w-100 mt-2 btn-sm" onClick={handleApprovePayment} isLoading={isUpdating}>
                  Verifikasi Pembayaran
                </Button>
              )}
            </div>

            <div className="mb-0">
              <label className="text-muted small d-block mb-1">Staff Lapangan</label>
              <div className="p-2 bg-light rounded-3 mb-3 fw-bold small text-center text-primary">
                {order.staff?.name || 'BELUM DITUGASKAN'}
              </div>
              
              {order.status === 'DOCUMENTS_RECEIVED' && (
                <div className="mt-2">
                  <select 
                    className="form-select form-select-sm mb-2 border-0 bg-light"
                    value={selectedStaffId} 
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    <option value="">-- Pilih Staff --</option>
                    {staffList?.map(s => (
                      <option key={s.id} value={s.id}>{s.name || s.email}</option>
                    ))}
                  </select>
                  <Button className="w-100 btn-sm variant-secondary" onClick={handleAssignStaff} isLoading={isUpdating} disabled={!selectedStaffId}>
                    Tugaskan Staff
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

