'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Button from '@/components/ui/Button/Button';

const fetcher = url => fetch(url).then(res => res.json());

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
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ASSIGNED_TO_STAFF': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-dark';
      case 'STAFF_COMPLETED': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold h2 text-dark m-0">Tugas Lapangan</h1>
          <p className="text-secondary small m-0 mt-1">Daftar pesanan yang di-assign untuk Anda proses di lapangan.</p>
        </div>
      </header>

      <div className="row g-4">
        {tasksList.map(task => (
          <div key={task.id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 flex-column d-flex">
              <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                <span className="fw-bold text-truncate me-2 small uppercase text-primary">
                  {task.service?.name}
                </span>
                <span className={`badge ${getStatusBadgeClass(task.status)} rounded-pill px-3 py-2 small`}>
                  {task.status}
                </span>
              </div>
              
              <div className="card-body p-4 flex-grow-1">
                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Pelanggan</label>
                  <p className="fw-bold m-0">{task.formDetails?.fullName || 'No Name'}</p>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Hubungi Pelanggan</label>
                  <a 
                    href={`https://wa.me/${task.formDetails?.phoneNumber}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-success rounded-pill px-3"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    {task.formDetails?.phoneNumber}
                  </a>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold small text-secondary text-uppercase mb-2">Berkas Digital</h6>
                  {task.documentUrls?.length > 0 ? (
                    <div className="list-group list-group-flush small">
                      {task.documentUrls.map((url, i) => (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="list-group-item list-group-item-action border-0 px-0 py-1 text-primary d-flex align-items-center"
                        >
                          <i className="bi bi-file-earmark-pdf me-2"></i> Berkas {i + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="small text-muted italic">Berkas digital belum diupload.</p>
                  )}
                </div>
              </div>
              
              <div className="card-footer bg-light border-top p-4 d-grid gap-2">
                {task.status === 'ASSIGNED_TO_STAFF' && (
                  <Button 
                    onClick={() => updateStatus(task.id, 'PROCESSING')} 
                    isLoading={processingId === task.id}
                    variant="info"
                    className="fw-bold shadow-sm"
                  >
                    <i className="bi bi-box-seam me-2"></i> Terima Berkas Fisik
                  </Button>
                )}

                {task.status === 'PROCESSING' && (
                  <Button 
                    onClick={() => updateStatus(task.id, 'STAFF_COMPLETED')} 
                    isLoading={processingId === task.id}
                    variant="success"
                    className="fw-bold shadow-sm"
                  >
                    <i className="bi bi-check-circle-fill me-2"></i> Selesaikan Tugas
                  </Button>
                )}

                {(task.status === 'STAFF_COMPLETED' || task.status === 'COMPLETED' || task.status === 'READY_FOR_DELIVERY') && (
                  <div className="alert alert-success border-0 rounded-3 p-2 mb-0 d-flex align-items-center justify-content-center fw-bold small">
                    <i className="bi bi-check-lg me-2"></i> Selesai
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {tasksList.length === 0 && (
          <div className="col-12 text-center py-5 d-flex flex-column align-items-center">
            <i className="bi bi-clipboard-x display-1 text-secondary opacity-25 mb-3"></i>
            <h5 className="text-secondary fw-bold">Belum ada tugas untuk Anda.</h5>
            <p className="text-muted small">Cek kembali nanti setelah admin memberikan penugasan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
