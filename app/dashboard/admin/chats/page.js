'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import ImageModal from '@/components/ui/ImageModal';

// Import Konfigurasi & Komponen
import { CHAT_CONFIG } from './constants';
import { ChatListItem, MessageBubble, QuickReplies } from './components';

const fetcher = url => fetch(url).then(res => res.json());

export default function AdminChatsPage() {
  const { data: session } = useSession();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [modal, setModal] = useState({ show: false, img: '', title: '' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { data: chats, mutate: mutateChats } = useSWR('/api/admin/chats', fetcher, { refreshInterval: 5000 });
  const { data: currentOrder, mutate: mutateCurrentOrder } = useSWR(
    selectedOrderId ? `/api/orders/${selectedOrderId}` : null,
    fetcher,
    { refreshInterval: 1500 }
  );

  const chatsList = Array.isArray(chats) ? chats : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentOrder?.messages]);

  const sendMessage = async (payload) => {
    if (!selectedOrderId) return;
    let body = typeof payload === 'string' ? { content: payload } : (payload?.imageUrl ? { imageUrl: payload.imageUrl } : null);
    if (!body) {
      if (!message.trim()) return;
      body = { content: message };
    }

    setIsSending(true);
    await fetch(`/api/orders/${selectedOrderId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!payload) setMessage('');
    setIsSending(false);
    mutateCurrentOrder();
    mutateChats();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => sendMessage({ imageUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex w-100 bg-white rounded-4 shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* 1. Sidebar List */}
      <div className="border-end d-flex flex-column bg-white flex-shrink-0" style={{ width: '280px' }}>
        <h3 className="p-4 m-0 h5 fw-bold border-bottom">{CHAT_CONFIG.TITLE}</h3>
        <div className="flex-grow-1 overflow-auto">
          {chatsList.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              active={selectedOrderId === chat.id}
              onClick={() => setSelectedOrderId(chat.id)}
            />
          ))}
          {chatsList.length === 0 && (
            <p className="p-4 text-center text-secondary small opacity-50 italic">{CHAT_CONFIG.EMPTY_INBOX}</p>
          )}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light-subtle">
        {selectedOrderId ? (
          <>
            <header className="p-3 px-4 border-bottom bg-white d-flex align-items-center justify-content-between">
              <div>
                <h6 className="m-0 fw-bold">{currentOrder?.user?.name}</h6>
                <small className="text-secondary small">Order ID: {selectedOrderId.slice(-6).toUpperCase()} • {currentOrder?.service?.name}</small>
              </div>
            </header>

            <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3">
              {currentOrder?.messages?.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={session?.user?.id === msg.userId}
                  labels={CHAT_CONFIG.LABELS}
                  onImageClick={(img, title) => setModal({ show: true, img, title })}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-top">
              <QuickReplies replies={CHAT_CONFIG.QUICK_REPLIES} onReplyClick={(reply) => sendMessage(reply)} />

              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="d-flex gap-2 align-items-center">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                <button type="button" className="btn btn-outline-secondary rounded-circle p-2" onClick={() => fileInputRef.current.click()} disabled={isSending}>
                  <i className="bi bi-camera"></i>
                </button>
                <div className="flex-grow-1">
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={CHAT_CONFIG.INPUT_PLACEHOLDER} className="mb-0" />
                </div>
                <Button type="submit" isLoading={isSending} className="m-0 py-2 px-3">
                  <i className="bi bi-send-fill text-white"></i>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-secondary opacity-50">
            <i className="bi bi-chat-dots display-4 mb-3"></i>
            <p className="small">{CHAT_CONFIG.EMPTY_PICK_CHAT}</p>
          </div>
        )}
      </div>

      <ImageModal show={modal.show} onClose={() => setModal({ ...modal, show: false })} imageUrl={modal.img} title={modal.title} />
    </div>
  );
}
