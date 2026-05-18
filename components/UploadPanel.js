'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import styles from './UploadPanel.module.css';
import { toast } from 'react-toastify';

export default function UploadPanel({ orderId, title, type, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih berkas terlebih dahulu!");
      return;
    }

    // Validation: Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran berkas terlalu besar (Maks 5MB)");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadRes.ok) {
        // Update Order
        const payload = type === 'payment' 
          ? { paymentProofUrl: uploadData.url, paymentStatus: 'PENDING_VERIFICATION' }
          : { documentUrls: [uploadData.url], status: 'DOCUMENTS_RECEIVED' };

        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        toast.success("Berhasil diunggah!");
        onSuccess();
      } else {
        toast.error(uploadData.error || 'Upload gagal');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <h4>{title}</h4>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className={styles.fileInput} />
      <Button onClick={handleUpload} isLoading={isUploading} disabled={!file} className={styles.btn}>
        Upload
      </Button>
    </div>
  );
}
