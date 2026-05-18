import React, { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import ImageModal from '@/components/ui/ImageModal';

export const TaskCard = ({ task, onUpdate, processingId, config }) => {
  const [docs, setDocs] = useState(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modal, setModal] = useState({ show: false, img: '', title: '' });

  const theme = config.STATUS_THEMES[task.status] || { label: task.status, color: "secondary" };

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/${task.id}`);
      const data = await res.json();
      const validDocs = data.documentUrls || {};
      setDocs(validDocs);
      if (Object.keys(validDocs).length === 0) setErrorMsg('Data berkas digital kosong.');
    } catch (e) {
      setErrorMsg('Gagal memuat berkas.');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 d-flex flex-column">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <span className="fw-bold text-truncate me-2 small text-uppercase text-primary">{task.service?.name}</span>
          <span className={`badge bg-${theme.color} rounded-pill px-3 py-2 small`}>{theme.label}</span>
        </div>
        
        <div className="card-body p-4 flex-grow-1">
          <div className="mb-3">
            <label className="text-secondary small d-block mb-1">Pelanggan</label>
            <p className="fw-bold m-0 text-dark">{task.formDetails?.fullName || 'No Name'}</p>
          </div>

          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold small text-secondary text-uppercase m-0">Berkas Digital</h6>
              {!docs && !errorMsg && (
                <button className="btn btn-sm btn-link text-decoration-none p-0 small fw-bold" onClick={loadDocuments} disabled={isLoadingDocs}>
                  {isLoadingDocs ? 'Memuat...' : 'Tampilkan Berkas'}
                </button>
              )}
            </div>
            {errorMsg && <div className="text-danger small italic py-1">{errorMsg}</div>}
            {docs && (
              <div className="list-group list-group-flush small">
                {Object.entries(docs).map(([name, url], i) => (
                  <button key={i} onClick={() => setModal({ show: true, img: url, title: name.replace('_', ' ').toUpperCase() })} className="list-group-item list-group-item-action border-0 px-0 py-2 text-primary d-flex align-items-center bg-transparent">
                    <i className="bi bi-file-earmark-image-fill me-2 h5 m-0 text-info"></i>
                    <span className="text-decoration-underline text-capitalize">{name.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            )}
            {isLoadingDocs && <div className="py-2 text-center small text-muted"><div className="spinner-border spinner-border-sm me-2 text-info"></div>Memuat...</div>}
          </div>
        </div>
        
        <div className="card-footer bg-light border-top p-4 d-grid gap-2">
          {['ASSIGNED_TO_STAFF', 'DOCUMENTS_RECEIVED'].includes(task.status) && (
            <Button onClick={() => onUpdate(task.id, 'PROCESSING')} isLoading={processingId === task.id} variant="info" className="fw-bold shadow-sm">
              <i className="bi bi-box-seam me-2"></i> {config.BUTTONS.PROCESS}
            </Button>
          )}
          {task.status === 'PROCESSING' && (
            <Button onClick={() => onUpdate(task.id, 'STAFF_COMPLETED')} isLoading={processingId === task.id} variant="success" className="fw-bold shadow-sm">
              <i className="bi bi-check-circle-fill me-2"></i> {config.BUTTONS.COMPLETE}
            </Button>
          )}
          <a href={`/dashboard/staff/tasks/${task.id}`} className="btn btn-outline-primary fw-bold rounded-pill shadow-sm">
            <i className="bi bi-chat-dots me-2"></i> {config.BUTTONS.OPEN_DETAIL}
          </a>
          {['STAFF_COMPLETED', 'COMPLETED', 'READY_FOR_DELIVERY'].includes(task.status) && (
            <div className="alert alert-success border-0 rounded-3 p-2 mb-0 d-flex align-items-center justify-content-center fw-bold small text-success">
              <i className="bi bi-check-lg me-2"></i> Tugas Selesai
            </div>
          )}
        </div>
      </div>
      <ImageModal show={modal.show} onClose={() => setModal({ ...modal, show: false })} imageUrl={modal.img} title={modal.title} />
    </div>
  );
};
