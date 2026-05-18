'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Select from '@/components/ui/Select/Select';
import Button from '@/components/ui/Button/Button';

// Import Konfigurasi
import { NEW_ORDER_CONFIG } from './constants';

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

  if (error) return <div className="p-5 text-center text-danger fw-bold">{NEW_ORDER_CONFIG.ERROR_TEXT}</div>;
  if (!services) return <div className="p-5 text-center text-secondary">{NEW_ORDER_CONFIG.LOADING_TEXT}</div>;

  const options = services.map(s => ({
    value: s.id,
    label: s.name
  }));

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto p-4 p-md-5 rounded-4" style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold mb-2 text-dark">{NEW_ORDER_CONFIG.TITLE}</h2>
        <p className="text-secondary mb-4">{NEW_ORDER_CONFIG.SUBTITLE}</p>
        
        <Select 
          label={NEW_ORDER_CONFIG.LABEL_SELECT}
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
          {NEW_ORDER_CONFIG.BUTTON_TEXT} <i className="bi bi-arrow-right ms-2"></i>
        </Button>
      </div>
    </div>
  );
}
