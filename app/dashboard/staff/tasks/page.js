'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';

// Import Konfigurasi & Komponen
import { STAFF_TASK_CONFIG } from './constants';
import { TaskCard } from './components';

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
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success("Status diperbarui!");
        mutate();
      } else {
        toast.error("Gagal update status.");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom">
        <h1 className="fw-bold h2 text-dark m-0">{STAFF_TASK_CONFIG.TITLE}</h1>
        <p className="text-secondary small m-0 mt-1">{STAFF_TASK_CONFIG.SUBTITLE}</p>
      </header>

      <div className="row g-4">
        {tasksList.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdate={updateStatus} 
            processingId={processingId} 
            config={STAFF_TASK_CONFIG}
          />
        ))}
        
        {tasksList.length === 0 && (
          <div className="col-12 text-center py-5 d-flex flex-column align-items-center opacity-50">
            <i className="bi bi-clipboard-x display-1 mb-3"></i>
            <h5 className="fw-bold">{STAFF_TASK_CONFIG.EMPTY_TITLE}</h5>
            <p className="small">{STAFF_TASK_CONFIG.EMPTY_SUBTITLE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
