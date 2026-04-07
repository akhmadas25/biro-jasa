'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Select from '@/components/ui/Select/Select';
import Button from '@/components/ui/Button/Button';

const fetcher = url => fetch(url).then(res => res.json());

export default function NewOrderPage() {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  const { data: services, error } = useSWR('/api/services', fetcher);

  const handleContinue = () => {
    if (selectedServiceId) {
      router.push(`/dashboard/user/services/${selectedServiceId}`);
    }
  };

  if (error) return <div>Gagal memuat daftar layanan.</div>;
  if (!services) return <div>Memuat layanan...</div>;

  const options = services.map(s => ({
    value: s.id,
    label: s.name
  }));

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto p-4 p-md-5 rounded-4" style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold mb-2 text-dark">Pesan Layanan Baru</h2>
        <p className="text-secondary mb-4">Pilih jenis layanan yang Anda butuhkan untuk memulai pengurusan berkas.</p>
        
        <Select 
          label="Pilih Jenis Layanan"
          options={options}
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="mb-4"
        />

        <Button 
          onClick={handleContinue} 
          disabled={!selectedServiceId}
          className="w-100 mt-2"
        >
          Lanjut Isi Formulir <i className="bi bi-arrow-right ms-2"></i>
        </Button>
      </div>
    </div>
  );
}
