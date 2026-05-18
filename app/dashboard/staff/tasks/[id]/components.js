import React from 'react';

// 1. Ringkasan Tugas (Panel Kiri)
export const TaskSummary = ({ order, onImageClick, labels }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-header bg-white border-bottom p-4">
        <h5 className="fw-bold m-0 small text-uppercase text-secondary tracking-wider">Ringkasan Tugas</h5>
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
           <span className="badge bg-info-subtle text-info px-3 mt-1 rounded-pill small">
             {labels[order.status] || order.status}
           </span>
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
                className="border rounded p-1 cursor-pointer shadow-sm hover-grow" 
                style={{ width: '60px', height: '60px', overflow: 'hidden' }}
                onClick={() => onImageClick(url, name.toUpperCase())}
              >
                 <img src={url} alt={name} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Chat Room khusus Staff (bisa berkomunikasi dengan Admin & User)
export const StaffChatRoom = ({ messages, currentUserId, onImageClick, labels }) => {
  return (
    <div className="card-body p-3 p-md-4 overflow-auto flex-grow-1 bg-light-subtle d-flex flex-column gap-3" style={{ maxHeight: '600px' }}>
      {messages?.length === 0 && <p className="text-center py-5 text-secondary opacity-50 small">Belum ada percakapan.</p>}
      {messages?.map((msg) => {
        const isMe = currentUserId === msg.userId;
        const sender = isMe ? labels.ME : (msg.user?.role === 'SUPERADMIN' ? labels.ADMIN : labels.USER);
        
        return (
          <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '90%', width: 'fit-content' }}>
              <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>
                {sender}
              </small>
              {msg.imageUrl && (
                <div 
                  className="mb-2 rounded overflow-hidden cursor-pointer shadow-sm border border-white-50" 
                  style={{ maxWidth: '200px' }}
                  onClick={() => onImageClick(msg.imageUrl, 'Gambar Chat')}
                >
                  <img src={msg.imageUrl} alt="chat" className="img-fluid" />
                </div>
              )}
              {msg.content && <div className="small">{msg.content}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
