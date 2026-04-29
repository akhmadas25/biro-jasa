import React from 'react';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import UploadPanel from '@/components/UploadPanel';

// 1. Panel Rincian Harga & Pembayaran
export const PricingPanel = ({ order, mutate, deliveryMethod, setDeliveryMethod, deliveryAddress, setDeliveryAddress, handleSetDelivery, isUpdating }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-body p-4">
        <label className="text-secondary small d-block mb-2 text-uppercase fw-bold">Estimasi Harga</label>
        <div className="p-3 bg-light rounded-4 mb-3">
          <span className="fw-bold text-dark d-block mb-2 h5">
            {order.estimatedPrice ? `Rp ${order.estimatedPrice.toLocaleString()}` : 'Menunggu Admin'}
          </span>
          {order.estimatedBreakdown?.map((item, i) => (
            <div key={i} className="d-flex justify-content-between small text-secondary mb-1">
              <span>{item.label}</span>
              <span>Rp {Number(item.price).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {order.agreedPrice && (
          <div className="mb-4">
            <label className="text-secondary small d-block mb-1">Harga Deal</label>
            <span className="fw-bold text-success h5">Rp {order.agreedPrice.toLocaleString()}</span>
          </div>
        )}

        {/* Payment Instructions */}
        {order.status === 'PAYMENT_PENDING' && order.paymentInstructions && (
          <div className="alert alert-primary border-0 rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-2 small text-uppercase">🏦 Bank Transfer</h6>
            <div className="small text-dark text-break" style={{ whiteSpace: 'pre-wrap' }}>{order.paymentInstructions}</div>
          </div>
        )}

        {order.status === 'PAYMENT_PENDING' && order.paymentStatus === 'UNPAID' && (
          <UploadPanel orderId={order.id} title="Upload Bukti Transfer" type="payment" onSuccess={mutate} />
        )}

        {/* Delivery Options */}
        {order.status === 'STAFF_COMPLETED' && (
          <div className="card bg-light border-0 rounded-4 p-4 mt-2">
            <h6 className="fw-bold mb-3 small text-uppercase">Opsi Pengambilan</h6>
            <div className="d-flex gap-4 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="radio" checked={deliveryMethod === 'PICKUP'} onChange={() => setDeliveryMethod('PICKUP')} />
                <label className="form-check-label small">Ambil di Kantor</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} />
                <label className="form-check-label small">Kirim ke Alamat</label>
              </div>
            </div>
            {deliveryMethod === 'DELIVERY' && (
              <Input placeholder="Alamat Lengkap..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="mb-3" />
            )}
            <Button onClick={handleSetDelivery} isLoading={isUpdating} className="w-100 fw-bold">Konfirmasi Selesai</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Ruang Chat
export const ChatRoom = ({ messages, currentUserId, onImageClick, labels }) => {
  return (
    <div className="card-body p-3 p-md-4 overflow-auto flex-grow-1 bg-light-subtle d-flex flex-column gap-3" style={{ maxHeight: '600px' }}>
      {messages?.length === 0 && <p className="text-center py-5 text-secondary opacity-50 small">Belum ada percakapan.</p>}
      {messages?.map(msg => {
        const isMe = currentUserId === msg.userId;
        const sender = isMe ? labels.ME : (msg.user?.role === 'SUPERADMIN' ? labels.ADMIN : msg.user?.name);
        return (
          <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '90%', width: 'fit-content' }}>
              <small className={`d-block mb-1 fw-bold ${isMe ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '0.65rem' }}>{sender}</small>
              {msg.imageUrl && (
                <div className="mb-2 rounded overflow-hidden cursor-pointer shadow-sm border border-white-50" style={{ maxWidth: '200px' }} onClick={() => onImageClick(msg.imageUrl)}>
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

// 3. Panel Berkas Digital
export const DocumentsPanel = ({ documentUrls, onImageClick }) => {
  if (!documentUrls || Object.keys(documentUrls).length === 0) return null;

  const labelMap = {
    foto_stnk: 'Foto STNK',
    foto_ktp: 'Foto KTP',
    foto_bpkb: 'Foto BPKB',
    gesekan_nomor: 'Gesekan Nomor',
    foto_kendaraan_4sisi: 'Foto Kendaraan',
    foto_sim_lama: 'Foto SIM Lama'
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-body p-4">
        <label className="text-secondary small d-block mb-3 text-uppercase fw-bold">Berkas yang Dikirim</label>
        <div className="row g-2">
          {Object.entries(documentUrls).map(([key, url]) => (
            <div key={key} className="col-4 col-md-3 text-center">
              <div 
                className="ratio ratio-1x1 rounded-3 overflow-hidden border cursor-pointer shadow-sm-hover transition-all" 
                onClick={() => onImageClick(url)}
                style={{ backgroundColor: '#f8f9fa' }}
              >
                <img src={url} alt={key} className="object-fit-cover w-100 h-100" />
              </div>
              <small className="d-block mt-1 text-secondary text-truncate" style={{ fontSize: '0.6rem' }}>
                {labelMap[key] || key}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
