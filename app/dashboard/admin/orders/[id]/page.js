'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import ImageModal from '@/components/ui/ImageModal';

// Import Konfigurasi & Komponen
import { ORDER_DETAIL_CONFIG } from './constants';
import { ClientInfoPanel, FinancePanel, StatusPanel } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminOrderDetailPage({ params }) {
  const [orderId, setOrderId] = useState(null);
  const [estimatePrice, setEstimatePrice] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [fixedPrice, setFixedPrice] = useState('');
  const [estItems, setEstItems] = useState([{ label: '', price: '' }]);
  const [fixedItems, setFixedItems] = useState([{ label: '', price: '' }]);
  const [modal, setModal] = useState({ show: false, img: '', title: '' });
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    params.then(p => setOrderId(p.id));
  }, [params]);

  const { data: order, mutate } = useSWR(orderId ? `/api/orders/${orderId}` : null, fetcher);
  const { data: staffList } = useSWR('/api/users/staff', fetcher);

  useEffect(() => {
    if (order) {
      setEstimatePrice(order.estimatedPrice || '');
      setAgreedPrice(order.agreedPrice || '');
      setFixedPrice(order.fixedPrice || '');
      setPaymentInstructions(order.paymentInstructions || '');
      if (order.estimatedBreakdown) setEstItems(order.estimatedBreakdown);
      if (order.fixedBreakdown) setFixedItems(order.fixedBreakdown);
    }
  }, [order]);

  const updateOrder = async (payload) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) mutate();
      else {
        const errorData = await res.json();
        alert(`Gagal update: ${errorData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetEstimate = () => {
    const total = estItems.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
    updateOrder({
      estimatedPrice: total,
      estimatedBreakdown: estItems.map(item => ({ ...item, price: parseFloat(item.price) || 0 })),
      status: 'WAITING_ESTIMATE'
    });
  };

  const handleSetAgreed = () => {
    updateOrder({
      agreedPrice: parseFloat(agreedPrice) || 0,
      paymentInstructions,
      status: 'PAYMENT_PENDING'
    });
  };

  const handleSetFixed = () => {
    const total = fixedItems.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
    updateOrder({
      fixedPrice: total,
      fixedBreakdown: fixedItems.map(item => ({ ...item, price: parseFloat(item.price) || 0 })),
      status: 'COMPLETED'
    });
  };

  const handleApprovePayment = () => updateOrder({ paymentStatus: 'PAID', status: 'WAITING_DOCUMENTS' });
  const handleReceivePhysicalDocs = () => updateOrder({ status: 'DOCUMENTS_RECEIVED' });
  const handleAssignStaff = () => selectedStaffId && updateOrder({ staffId: selectedStaffId, status: 'PROCESSING' });
  const handleFinalizeOrder = () => updateOrder({ status: 'COMPLETED' });

  if (!order) return <div className="p-5 text-center text-secondary">Loading Detail...</div>;

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold h4 m-0 text-dark">{ORDER_DETAIL_CONFIG.TITLE} • {order.id.slice(-6).toUpperCase()}</h2>
          <p className="text-secondary small m-0 mt-1">
            Status: <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{order.status}</span>
          </p>
        </div>
      </header>

      <div className="row g-4">
        <div className="col-md-4">
          <ClientInfoPanel 
            order={order} 
            onImageClick={(img, title) => setModal({ show: true, img, title })}
            config={ORDER_DETAIL_CONFIG} 
          />
        </div>
        
        <div className="col-md-4">
          <FinancePanel 
            order={order}
            estItems={estItems} setEstItems={setEstItems}
            agreedPrice={agreedPrice} setAgreedPrice={setAgreedPrice}
            fixedItems={fixedItems} setFixedItems={setFixedItems}
            paymentInstructions={paymentInstructions} setPaymentInstructions={setPaymentInstructions}
            handleSetEstimate={handleSetEstimate}
            handleSetAgreed={handleSetAgreed}
            handleSetFixed={handleSetFixed}
            handleFinalizeOrder={handleFinalizeOrder}
            isUpdating={isUpdating}
            config={ORDER_DETAIL_CONFIG}
          />
        </div>

        <div className="col-md-4">
          <StatusPanel 
            order={order}
            staffList={staffList}
            selectedStaffId={selectedStaffId}
            setSelectedStaffId={setSelectedStaffId}
            handleApprovePayment={handleApprovePayment}
            handleReceivePhysicalDocs={handleReceivePhysicalDocs}
            handleAssignStaff={handleAssignStaff}
            onImageClick={(img, title) => setModal({ show: true, img, title })}
            isUpdating={isUpdating}
            config={ORDER_DETAIL_CONFIG}
          />
        </div>
      </div>

      <ImageModal 
        show={modal.show} 
        onClose={() => setModal({ ...modal, show: false })} 
        imageUrl={modal.img} 
        title={modal.title} 
      />
    </div>
  );
}
