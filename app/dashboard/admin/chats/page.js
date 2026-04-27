'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import ImageModal from '@/components/ui/ImageModal';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminChatsPage() {
  const { data: session } = useSession();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [modal, setModal] = useState({ show: false, img: '', title: '' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Poll list of chats
  const { data: chats, mutate: mutateChats } = useSWR('/api/admin/chats', fetcher, { refreshInterval: 5000 });

  // Poll individual chat if selected
  const { data: currentOrder, mutate: mutateCurrentOrder } = useSWR(
    selectedOrderId ? `/api/orders/${selectedOrderId}` : null,
    fetcher,
    { refreshInterval: 1500 }
  );

  const chatsList = Array.isArray(chats) ? chats : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentOrder?.messages]);

  const quickReplies = [
    "Halo, berkas sedang kami proses.",
    "Mohon lakukan pembayaran sesuai instruksi di atas.",
    "Pembayaran sudah kami terima, segera kami proses ke lapangan.",
    "Berkas sudah selesai, silakan pilih metode pengambilan di dashboard Anda.",
    "Ada kendala pada berkas Anda, mohon hubungi kami kembali."
  ];

  const sendMessage = async (payload) => {
    if (!selectedOrderId) return;
    
    let body = {};
    if (typeof payload === 'string') {
      body = { content: payload };
    } else if (payload?.imageUrl) {
      body = { imageUrl: payload.imageUrl };
    } else {
      if (!message.trim()) return;
      body = { content: message };
    }

    setIsSending(true);
    await fetch(`/api/orders/${selectedOrderId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (typeof payload !== 'string' && !payload?.imageUrl) setMessage('');
    setIsSending(false);
    mutateCurrentOrder();
    mutateChats();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage({ imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex w-100 bg-white rounded-4 shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 5rem)', minWidth: 0 }}>
      {/* Sidebar List Chats */}
      <div className="border-end d-flex flex-column bg-white flex-shrink-0" style={{ width: '280px' }}>
        <h3 className="p-4 m-0 h5 fw-bold border-bottom">Inbox Chat</h3>
        <div className="flex-grow-1 overflow-auto">
          {chatsList.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedOrderId(chat.id)}
              className={`p-3 border-bottom cursor-pointer transition-all position-relative ${selectedOrderId === chat.id ? 'bg-primary-subtle' : ''}`}
            >
              {selectedOrderId === chat.id && (
                <div className="position-absolute start-0 top-0 bottom-0 bg-primary" style={{ width: '4px' }}></div>
              )}
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold small">{chat.user?.name || 'User'}</span>
                <span className="badge bg-primary-subtle text-primary x-small" style={{ fontSize: '0.7rem' }}>{chat.service?.name}</span>
              </div>
              <p className="text-secondary small mb-1 text-truncate">
                {chat.messages?.[0]?.imageUrl ? (
                  <span className="text-primary italic"><i className="bi bi-image me-1"></i> [Gambar]</span>
                ) : (
                  chat.messages?.[0]?.content || "Tidak ada pesan"
                )}
              </p>
              <span className="badge bg-light text-secondary border small">{chat.status}</span>
            </div>
          ))}
          {chatsList.length === 0 && (
            <p className="p-4 text-center text-secondary small opacity-50 italic">
              {chats?.error ? 'Gagal memuat chat' : 'Belum ada chat aktif.'}
            </p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light-subtle" style={{ minWidth: 0 }}>
        {selectedOrderId ? (
          <>
            <header className="p-3 px-4 border-bottom bg-white d-flex align-items-center justify-content-between">
              <div>
                <h6 className="m-0 fw-bold">{currentOrder?.user?.name}</h6>
                <small className="text-secondary">Order ID: {selectedOrderId.slice(-6).toUpperCase()} • {currentOrder?.service?.name}</small>
              </div>
            </header>

            <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3">
              {currentOrder?.messages?.map(msg => {
                const isMe = session?.user?.id === msg.userId;
                return (
                  <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-3 rounded-4 shadow-sm small ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                      style={{ maxWidth: '75%' }}
                    >
                      <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>
                        {isMe ? 'Anda (Admin)' : (msg.user?.role === 'STAFF' ? 'Staff Lapangan' : msg.user?.name)}
                      </small>
                      {msg.imageUrl && (
                        <div 
                          className="mb-2 rounded overflow-hidden cursor-pointer shadow-sm border border-white-50 bg-white" 
                          style={{ maxWidth: '200px' }}
                          onClick={() => setModal({ show: true, img: msg.imageUrl, title: 'Gambar Chat' })}
                        >
                          <img src={msg.imageUrl} alt="chat" className="img-fluid" />
                        </div>
                      )}
                      {msg.content && <div>{msg.content}</div>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-top">
              {/* Quick Replies */}
              <div className="d-flex gap-2 overflow-auto pb-3 mb-3 border-bottom no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(reply)}
                    className="btn btn-sm btn-outline-secondary border-light-subtle bg-light text-nowrap rounded-pill px-3"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="d-flex gap-2 align-items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary rounded-circle p-2" 
                  onClick={() => fileInputRef.current.click()}
                  disabled={isSending}
                  style={{ width: '40px', height: '40px', flexShrink: 0 }}
                >
                  <i className="bi bi-camera"></i>
                </button>
                <div className="flex-grow-1">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik balasan..."
                    className="mb-0"
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0 py-2 px-3">
                   <i className="bi bi-send-fill text-white"></i>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-secondary">
            <i className="bi bi-chat-dots display-4 mb-3 opacity-25"></i>
            <p className="small">Pilih salah satu chat untuk membalas pesan pelanggan.</p>
          </div>
        )}
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
