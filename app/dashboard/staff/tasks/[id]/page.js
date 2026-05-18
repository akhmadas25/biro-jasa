'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import ImageModal from '@/components/ui/ImageModal';

// Import Konfigurasi & Komponen
import { STAFF_DETAIL_CONFIG } from './constants';
import { TaskSummary, StaffChatRoom } from './components';

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

  const { data: order, mutate } = useSWR(orderId ? `/api/orders/${orderId}` : null, fetcher, { refreshInterval: 1500 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.messages]);

  if (!order) return <div className="p-5 text-center text-secondary">Memuat Tugas...</div>;

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
        await fetch(`/api/orders/${orderId}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: reader.result }) });
        setIsSending(false);
        mutate();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-4">
      <Link href="/dashboard/staff/tasks" className="btn btn-sm btn-link text-decoration-none text-secondary mb-4 p-0">
        <i className="bi bi-arrow-left me-2"></i> Kembali ke Daftar Tugas
      </Link>

      <div className="row g-4 flex-column-reverse flex-lg-row">
        {/* Kolom Kiri: Info Tugas */}
        <div className="col-12 col-lg-5">
          <TaskSummary 
            order={order} 
            labels={STAFF_DETAIL_CONFIG.STATUS_LABELS} 
            onImageClick={(img, title) => setModal({ show: true, img, title })} 
          />
        </div>

        {/* Kolom Kanan: Chat Room */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 d-flex flex-column h-100" style={{ minHeight: 'calc(100vh - 200px)', maxHeight: '800px' }}>
            <div className="card-header bg-white border-bottom p-4">
               <h5 className="fw-bold m-0 small text-uppercase text-secondary tracking-wider">{STAFF_DETAIL_CONFIG.CHAT_TITLE}</h5>
            </div>

            <StaffChatRoom 
              messages={order.messages} 
              currentUserId={session?.user?.id} 
              labels={STAFF_DETAIL_CONFIG.SENDER_LABELS}
              onImageClick={(img, title) => setModal({ show: true, img, title })} 
            />

            <div className="card-footer bg-white border-top p-4">
              <form onSubmit={sendMessage} className="d-flex gap-2 align-items-center">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                <button type="button" className="btn btn-outline-secondary rounded-circle p-2" onClick={() => fileInputRef.current.click()} disabled={isSending}>
                  <i className="bi bi-camera"></i>
                </button>
                <div className="flex-grow-1">
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ketik pesan..." className="mb-0" />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0 py-2">
                  <i className="bi bi-send-fill text-white"></i>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ImageModal show={modal.show} onClose={() => setModal({ ...modal, show: false })} imageUrl={modal.img} title={modal.title} />
    </div>
  );
}
