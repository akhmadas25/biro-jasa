'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';
import ImageModal from '@/components/ui/ImageModal';

const fetcher = url => fetch(url).then(res => res.json());

function TaskItem({ task, onUpdate, processingId }) {
  const [docs, setDocs] = useState(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modal, setModal] = useState({ show: false, img: '', title: '' });

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/${task.id}`);
      if (!res.ok) throw new Error('Gagal mengambil detail dokumen');
      const data = await res.json();
      
      // Sanitasi data: pastikan documentUrls ada harganya
      const validDocs = data.documentUrls || {};
      setDocs(validDocs);
      
      if (Object.keys(validDocs).length === 0) {
        setErrorMsg('Data berkas digital kosong di pesanan ini.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Gagal memuat berkas. Coba lagi.');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const openImage = (title, base64) => {
    setModal({ show: true, img: base64, title: title });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ASSIGNED_TO_STAFF': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-dark';
      case 'STAFF_COMPLETED': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 flex-column d-flex">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <span className="fw-bold text-truncate me-2 small text-uppercase text-primary">
            {task.service?.name}
          </span>
          <span className={`badge ${getStatusBadgeClass(task.status)} rounded-pill px-3 py-2 small`}>
            {task.status}
          </span>
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
                <button 
                  className="btn btn-sm btn-link text-decoration-none p-0 small fw-bold" 
                  onClick={loadDocuments}
                  disabled={isLoadingDocs}
                >
                  {isLoadingDocs ? 'Memuat...' : 'Tampilkan Berkas'}
                </button>
              )}
            </div>

            {errorMsg && <div className="text-danger small italic py-1">{errorMsg}</div>}

            {docs && (
              <div className="list-group list-group-flush small">
                {Object.entries(docs).length > 0 ? Object.entries(docs).map(([name, url], i) => (
                  <button 
                    key={i} 
                    onClick={() => openImage(name.replace('_', ' ').toUpperCase(), url)}
                    className="list-group-item list-group-item-action border-0 px-0 py-2 text-primary d-flex align-items-center bg-transparent"
                  >
                    <i className="bi bi-file-earmark-image-fill me-2 h5 m-0 text-info"></i>
                    <span className="text-decoration-underline text-capitalize">{name.replace('_', ' ')}</span>
                  </button>
                )) : null}
              </div>
            )}

            <ImageModal 
                show={modal.show} 
                onClose={() => setModal({ ...modal, show: false })} 
                imageUrl={modal.img} 
                title={modal.title} 
            />
            
            {isLoadingDocs && (
              <div className="py-2 text-center small text-muted">
                <div className="spinner-border spinner-border-sm me-2 text-info"></div>
                Mengambil dokumen...
              </div>
            )}
          </div>
        </div>
        
        <div className="card-footer bg-light border-top p-4 d-grid gap-2">
          {(task.status === 'ASSIGNED_TO_STAFF' || task.status === 'DOCUMENTS_RECEIVED') && (
            <Button 
              onClick={() => onUpdate(task.id, 'PROCESSING')} 
              isLoading={processingId === task.id}
              variant="info"
              className="fw-bold shadow-sm"
            >
              <i className="bi bi-box-seam me-2"></i> Terima & Proses
            </Button>
          )}

          {task.status === 'PROCESSING' && (
            <Button 
              onClick={() => onUpdate(task.id, 'STAFF_COMPLETED')} 
              isLoading={processingId === task.id}
              variant="success"
              className="fw-bold shadow-sm"
            >
              <i className="bi bi-check-circle-fill me-2"></i> Selesaikan Tugas
            </Button>
          )}

          <a href={`/dashboard/staff/tasks/${task.id}`} className="btn btn-outline-primary fw-bold rounded-pill shadow-sm">
            <i className="bi bi-chat-dots me-2"></i> Buka Chat & Detail
          </a>

          {(task.status === 'STAFF_COMPLETED' || task.status === 'COMPLETED' || task.status === 'READY_FOR_DELIVERY') && (
            <div className="alert alert-success border-0 rounded-3 p-2 mb-0 d-flex align-items-center justify-content-center fw-bold small text-success">
              <i className="bi bi-check-lg me-2"></i> Tugas Selesai
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StaffTasksPage() {
  const { data: tasks, error, mutate } = useSWR('/api/orders', fetcher);
  const [processingId, setProcessingId] = useState(null);

  if (error) return <div className="p-5 text-center text-danger fw-bold">Gagal memuat tugas.</div>;
  if (!tasks) return <div className="p-5 text-center text-secondary fw-bold">Memuat Tugas...</div>;

  const tasksList = Array.isArray(tasks) ? tasks : [];

  const updateStatus = async (id, newStatus) => {
    setProcessingId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      mutate();
    } catch (e) {
      console.error('Update status error:', e);
      alert("Gagal update status.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold h2 text-dark m-0">Tugas Lapangan</h1>
          <p className="text-secondary small m-0 mt-1">Daftar pesanan aktif untuk Anda.</p>
        </div>
      </header>

      <div className="row g-4">
        {tasksList.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onUpdate={updateStatus} 
            processingId={processingId} 
          />
        ))}
        
        {tasksList.length === 0 && (
          <div className="col-12 text-center py-5 d-flex flex-column align-items-center">
            <i className="bi bi-clipboard-x display-1 text-secondary opacity-25 mb-3"></i>
            <h5 className="text-secondary fw-bold">Belum ada tugas untuk Anda.</h5>
            <p className="text-muted small">Cek kembali nanti setelah dikirim oleh Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
