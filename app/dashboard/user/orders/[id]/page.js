'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import ImageModal from '@/components/ui/ImageModal';

// Import Konfigurasi & Komponen
import { USER_ORDER_CONFIG } from './constants';
import { PricingPanel, ChatRoom, DocumentsPanel } from './components';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OrderChatPage({ params }) {
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
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

  if (!order) return <div className="p-5 text-center text-secondary">Memuat Halaman...</div>;

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

  const handleSetDelivery = async () => {
    setIsUpdating(true);
    await fetch(`/api/orders/${orderId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deliveryMethod, deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress : '', status: 'COMPLETED' }) });
    mutate();
    setIsUpdating(false);
  };

  return (
    <div className="container py-4">
      <div className="row g-4 flex-column-reverse flex-lg-row">
        {/* Kolom Kiri: Info & Harga */}
        <div className="col-12 col-lg-5">
           <header className="mb-4 d-flex justify-content-between align-items-center">
             <h4 className="fw-bold m-0 h5 h4-md">{USER_ORDER_CONFIG.TITLE}</h4>
             <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small">
               {USER_ORDER_CONFIG.STATUS_LABELS[order.status] || order.status}
             </span>
           </header>
           
           <DocumentsPanel 
             documentUrls={order.documentUrls} 
             onImageClick={(img) => setModal({ show: true, img, title: 'Berkas Digital' })} 
           />

           <PricingPanel 
             order={order} 
             mutate={mutate} 
             deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} 
             deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} 
             handleSetDelivery={handleSetDelivery} 
             isUpdating={isUpdating} 
           />
        </div>

        {/* Kolom Kanan: Chat Room */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 d-flex flex-column h-100" style={{ minHeight: 'calc(100vh - 150px)', maxHeight: '800px' }}>
            <div className="card-header bg-white border-bottom p-4">
              <h5 className="fw-bold m-0">{USER_ORDER_CONFIG.CHAT_TITLE}</h5>
            </div>

            <ChatRoom 
              messages={order.messages} 
              currentUserId={session?.user?.id} 
              labels={USER_ORDER_CONFIG.SENDER_LABELS}
              onImageClick={(img) => setModal({ show: true, img, title: 'Gambar Chat' })} 
            />

            <div className="card-footer bg-white border-top p-4">
              <form onSubmit={sendMessage} className="d-flex gap-2 align-items-center">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                <button type="button" className="btn btn-outline-secondary rounded-circle p-2" onClick={() => fileInputRef.current.click()} disabled={isSending}><i className="bi bi-camera"></i></button>
                <div className="flex-grow-1">
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ketik pesan..." className="mb-0" />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0 py-2"><i className="bi bi-send-fill text-white"></i></Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ImageModal show={modal.show} onClose={() => setModal({ ...modal, show: false })} imageUrl={modal.img} title={modal.title} />
    </div>
  );
}
