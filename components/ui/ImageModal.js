'use client';

import React from 'react';

export default function ImageModal({ show, onClose, imageUrl, title }) {
  if (!show) return null;

  return (
    <div 
      className="modal show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-4 overflow-hidden">
          <div className="modal-header border-0 pb-0">
            <h6 className="modal-title fw-bold text-secondary">{title || 'Lihat Gambar'}</h6>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 text-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="img-fluid rounded-3 shadow-sm" 
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
              />
            ) : (
              <div className="py-5 text-muted italic">Gambar tidak tersedia.</div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}
