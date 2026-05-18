import React from 'react';

// 1. Sidebar Item Chat
export const ChatListItem = ({ chat, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-3 border-bottom cursor-pointer transition-all position-relative ${active ? 'bg-primary-subtle' : 'bg-white'}`}
    >
      {active && <div className="position-absolute start-0 top-0 bottom-0 bg-primary" style={{ width: '4px' }}></div>}
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
      <span className="badge bg-light text-secondary border small" style={{ fontSize: '0.65rem' }}>{chat.status}</span>
    </div>
  );
};

// 2. Bubble Chat
export const MessageBubble = ({ msg, isMe, labels, onImageClick }) => {
  const senderName = isMe ? labels.ADMIN : (msg.user?.role === 'STAFF' ? labels.STAFF : msg.user?.name);
  
  return (
    <div className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`p-3 rounded-4 shadow-sm small ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '75%' }}>
        <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>
          {senderName}
        </small>
        {msg.imageUrl && (
          <div 
            className="mb-2 rounded overflow-hidden cursor-pointer shadow-sm border border-white-50 bg-white" 
            style={{ maxWidth: '200px' }}
            onClick={() => onImageClick(msg.imageUrl, 'Gambar Chat')}
          >
            <img src={msg.imageUrl} alt="chat" className="img-fluid" />
          </div>
        )}
        {msg.content && <div>{msg.content}</div>}
      </div>
    </div>
  );
};

// 3. Quick Replies Bar
export const QuickReplies = ({ replies, onReplyClick }) => {
  return (
    <div className="d-flex gap-2 overflow-auto pb-3 mb-3 border-bottom" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {replies.map((reply, idx) => (
        <button key={idx} onClick={() => onReplyClick(reply)} className="btn btn-sm btn-outline-secondary border-light-subtle bg-light text-nowrap rounded-pill px-3">
          {reply}
        </button>
      ))}
    </div>
  );
};
