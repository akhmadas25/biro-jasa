'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import ImageModal from '@/components/ui/ImageModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function StaffOrderChatPage({ params }) {
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [modal, setModal] = useState({ show: false, img: '', title: '' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  if (!order) return <div className="p-5 text-center">Memuat Tugas...</div>;

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIsSending(true);
        await fetch(`/api/orders/${orderId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: reader.result })
        });
        setIsSending(false);
        mutate();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-4">
      <Link href="/dashboard/staff/tasks" className="btn btn-sm btn-outline-secondary mb-4 rounded-pill">
        <i className="bi bi-arrow-left me-2"></i> Kembali ke Daftar Tugas
      </Link>

      <div className="row g-4">
        {/* Left Column: Task Overview */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-bottom p-4">
              <h5 className="fw-bold m-0">Ringkasan Tugas</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                 <label className="text-secondary small d-block mb-1">Pelanggan</label>
                 <p className="fw-bold h6 text-dark m-0">{order.formDetails?.fullName}</p>
                 <small className="text-secondary">{order.formDetails?.phoneNumber}</small>
              </div>
              
              <div className="mb-4">
                 <label className="text-secondary small d-block mb-1">Layanan</label>
                 <p className="fw-bold m-0">{order.service?.name}</p>
                 <span className="badge bg-info-subtle text-info px-3 mt-1 rounded-pill">{order.status}</span>
              </div>

              {order.formDetails?.notes && (
                <div className="mb-4">
                   <label className="text-secondary small d-block mb-1">Catatan User</label>
                   <div className="bg-light p-3 rounded-3 small italic">{order.formDetails.notes}</div>
                </div>
              )}

              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold small text-secondary text-uppercase mb-3">Dokumen Pendukung</h6>
                <div className="d-flex flex-wrap gap-2">
                  {order.documentUrls && Object.entries(order.documentUrls).map(([name, url], i) => (
                    <div 
                      key={i} 
                      className="border rounded p-1 cursor-pointer shadow-sm" 
                      style={{ width: '60px', height: '60px', overflow: 'hidden' }}
                      onClick={() => setModal({ show: true, img: url, title: name.toUpperCase() })}
                    >
                       <img src={url} alt={name} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat with User */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 d-flex flex-column h-100" style={{ minHeight: '600px' }}>
            <div className="card-header bg-white border-bottom p-4">
               <h5 className="fw-bold m-0">Chat dengan Pelanggan</h5>
            </div>

            <div className="card-body p-4 overflow-auto flex-grow-1 bg-light-subtle d-flex flex-column gap-3" style={{ maxHeight: '600px' }}>
              {order.messages?.map((msg) => {
                const isMe = session?.user?.id === msg.userId;
                return (
                  <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                      style={{ maxWidth: '75%' }}
                    >
                      <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>
                        {isMe ? 'Anda' : (msg.user?.role === 'SUPERADMIN' ? 'Admin' : 'Pelanggan')}
                      </small>
                      {msg.imageUrl && (
                        <div 
                          className="mb-2 rounded overflow-hidden cursor-pointer shadow-sm border border-white-50" 
                          style={{ maxWidth: '200px' }}
                          onClick={() => setModal({ show: true, img: msg.imageUrl, title: 'Gambar Chat' })}
                        >
                          <img src={msg.imageUrl} alt="chat" className="img-fluid" />
                        </div>
                      )}
                      {msg.content && <div className="small">{msg.content}</div>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="card-footer bg-white border-top p-4">
              <form onSubmit={sendMessage} className="d-flex gap-2 align-items-center">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                <button type="button" className="btn btn-outline-secondary rounded-circle p-2" onClick={() => fileInputRef.current.click()} disabled={isSending}>
                  <i className="bi bi-camera"></i>
                </button>
                <div className="flex-grow-1">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik pesan ke pelanggan..."
                    className="mb-0"
                  />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0 py-2">
                  <i className="bi bi-send-fill text-white"></i>
                </Button>
              </form>
            </div>
          </div>
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
