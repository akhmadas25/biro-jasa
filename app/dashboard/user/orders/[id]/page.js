'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import UploadPanel from '@/components/UploadPanel';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OrderChatPage({ params }) {
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const messagesEndRef = useRef(null);

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': 'Menunggu Verifikasi',
      'WAITING_ESTIMATE': 'Menunggu Estimasi Harga',
      'NEGOTIATING': 'Negosiasi Harga',
      'DEAL': 'Harga Disepakati',
      'PAYMENT_PENDING': 'Menunggu Pembayaran',
      'PAYMENT_VERIFY': 'Menunggu Verifikasi Pembayaran',
      'PAID': 'Pembayaran Berhasil',
      'WAITING_DOCUMENTS': 'Menunggu Upload Berkas',
      'DOCUMENTS_RECEIVED': 'Berkas Digital Diterima',
      'ASSIGNED_TO_STAFF': 'Menunggu Petugas Lapangan',
      'PROCESSING': 'Berkas Sedang Diproses Petugas',
      'STAFF_COMPLETED': 'Proses Selesai - Pilih Pengambilan',
      'READY_FOR_DELIVERY': 'Siap Dikirim / Diambil',
      'COMPLETED': 'Selesai',
      'CANCELLED': 'Dibatalkan'
    };
    return labels[status] || status;
  };

  useEffect(() => {
    params.then(p => setOrderId(p.id));
  }, [params]);

  const { data: order, mutate } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    fetcher,
    { refreshInterval: 1500 }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.messages]);

  if (!order) return <div className="p-5 text-center">Memuat Chat...</div>;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    await fetch(`/api/orders/${orderId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    setMessage('');
    setIsSending(false);
    mutate();
  };

  const handleSetDelivery = async () => {
    setIsUpdating(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress : '',
        status: 'COMPLETED'
      })
    });
    mutate();
    setIsUpdating(false);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Column: Order Detail */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-bottom p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold m-0">Detail Pesanan</h5>
                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small">
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Layanan</label>
                  <span className="fw-bold h6">{order.service?.name}</span>
                </div>
                
                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Estimasi Harga</label>
                  <span className="fw-bold text-dark">
                    {order.estimatedPrice ? `Rp ${order.estimatedPrice.toLocaleString()}` : 'Menunggu Admin'}
                  </span>
                </div>

                {order.agreedPrice && (
                  <div className="mb-3">
                    <label className="text-secondary small d-block mb-1">Harga Deal</label>
                    <span className="fw-bold text-success h5">Rp {order.agreedPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payment Instructions */}
              {order.status === 'PAYMENT_PENDING' && order.paymentInstructions && (
                <div className="alert alert-primary border-0 rounded-4 p-4 mb-4">
                  <h6 className="fw-bold mb-2">🏦 Instruksi Pembayaran</h6>
                  <div className="small text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                    {order.paymentInstructions}
                  </div>
                </div>
              )}

              {/* Action Panels */}
              {order.status === 'PAYMENT_PENDING' && order.paymentStatus === 'UNPAID' && (
                <UploadPanel 
                  orderId={order.id} 
                  title="Upload Bukti Transfer" 
                  type="payment" 
                  onSuccess={mutate} 
                />
              )}

              {order.status === 'WAITING_DOCUMENTS' && (
                <UploadPanel 
                  orderId={order.id} 
                  title="Upload Berkas Persyaratan" 
                  type="document" 
                  onSuccess={mutate} 
                />
              )}

              {/* Delivery Section */}
              {order.status === 'STAFF_COMPLETED' && (
                <div className="card bg-light border-0 rounded-4 p-4 mt-2">
                  <h6 className="fw-bold mb-3">Metode Pengambilan Berkas</h6>
                  <div className="d-flex gap-4 mb-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        id="pickup" 
                        checked={deliveryMethod === 'PICKUP'} 
                        onChange={() => setDeliveryMethod('PICKUP')} 
                      />
                      <label className="form-check-label" htmlFor="pickup">Ambil di Kantor</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        id="delivery" 
                        checked={deliveryMethod === 'DELIVERY'} 
                        onChange={() => setDeliveryMethod('DELIVERY')} 
                      />
                      <label className="form-check-label" htmlFor="delivery">Kirim ke Alamat</label>
                    </div>
                  </div>
                  {deliveryMethod === 'DELIVERY' && (
                    <div className="mb-3">
                      <Input 
                        placeholder="Alamat Lengkap..." 
                        value={deliveryAddress} 
                        onChange={(e) => setDeliveryAddress(e.target.value)} 
                        className="mb-0"
                      />
                    </div>
                  )}
                  <Button onClick={handleSetDelivery} isLoading={isUpdating} className="w-100 shadow-sm">
                    Konfirmasi Selesai
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Room */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 d-flex flex-column h-100" style={{ minHeight: '600px' }}>
            <div className="card-header bg-white border-bottom p-4">
              <h5 className="fw-bold m-0">Ruang Negosiasi</h5>
            </div>
            
            <div className="card-body p-4 overflow-auto flex-grow-1 bg-light-subtle d-flex flex-column gap-3" style={{ maxHeight: '600px' }}>
              {order.messages?.length === 0 && (
                <div className="text-center py-5 text-secondary opacity-50">
                  <p className="small m-0">Belum ada percakapan.</p>
                </div>
              )}
              {order.messages?.map((msg) => {
                const isMe = session?.user?.id === msg.userId;
                return (
                  <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div 
                      className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                      style={{ maxWidth: '75%' }}
                    >
                      <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>
                        {isMe ? 'Anda' : msg.user?.name}
                      </small>
                      <div className="small">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="card-footer bg-white border-top p-4">
              <form onSubmit={sendMessage} className="d-flex gap-3 align-items-center">
                <div className="flex-grow-1">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="mb-0"
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0">
                  Kirim
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
