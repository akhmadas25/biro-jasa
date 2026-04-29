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
    <div className="d-flex flex-column flex-lg-row w-100 bg-white rounded-4 shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 10rem)', minHeight: '500px' }}>
      {/* 1. Sidebar List */}
      <div id="admin-chat-sidebar" className="border-end d-flex flex-column bg-white flex-shrink-0">
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 992px) {
            #admin-chat-sidebar { width: 300px !important; }
          }
          @media (max-width: 991px) {
            #admin-chat-sidebar { height: 35% !important; border-bottom: 1px solid #dee2e6; border-right: none !important; }
          }
        ` }} />
        <h3 className="p-3 m-0 h6 fw-bold border-bottom text-uppercase text-secondary tracking-wider">{CHAT_CONFIG.TITLE}</h3>
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
      <div className="flex-grow-1 d-flex flex-column bg-light-subtle overflow-hidden">
        {selectedOrderId ? (
          <>
            <header className="p-3 px-4 border-bottom bg-white d-flex align-items-center justify-content-between flex-shrink-0">
              <div>
                <h6 className="m-0 fw-bold">{currentOrder?.user?.name}</h6>
                <small className="text-secondary small" style={{ fontSize: '0.7rem' }}>Order ID: {selectedOrderId.slice(-6).toUpperCase()} • {currentOrder?.service?.name}</small>
              </div>
            </header>

            <div className="flex-grow-1 p-3 p-md-4 overflow-auto d-flex flex-column gap-3">
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

            <div className="p-3 p-md-4 bg-white border-top flex-shrink-0">
              <QuickReplies replies={CHAT_CONFIG.QUICK_REPLIES} onReplyClick={(reply) => sendMessage(reply)} />

              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="d-flex gap-2 align-items-center w-100">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                <button 
                  type="button" 
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                  style={{ width: '42px', height: '42px', border: '1px solid #e2e8f0' }} 
                  onClick={() => fileInputRef.current.click()} 
                  disabled={isSending}
                >
                  <i className="bi bi-camera text-secondary"></i>
                </button>
                <div className="flex-grow-1">
                  <input 
                    className="form-control rounded-pill border-0 bg-light px-4 py-2"
                    style={{ height: '42px' }}
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder={CHAT_CONFIG.INPUT_PLACEHOLDER}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSending || !message.trim()} 
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" 
                  style={{ width: '42px', height: '42px' }}
                >
                  {isSending ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-send-fill" style={{ transform: 'translateX(2px)' }}></i>
                  )}
                </button>
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
