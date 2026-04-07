'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';

export default function ServiceFormPage({ params }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    serviceTypePriority: 'standard',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ideally, serviceId is fetched from params or DB, here we mock simple extraction
  React.useEffect(() => {
    params.then(p => setServiceId(p.id));
  }, [params]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: serviceId, // Must match an ID in DB in fully working app
          formDetails: formData
        })
      });
      
      const order = await res.json();
      if (res.ok) {
        // Redirect to chat/negotiation area
        router.push(`/dashboard/user/orders/${order.id}`);
      } else {
        alert(order.error || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>Lengkapi Data Formulir</h1>
        <p style={styles.subtitle}>Berikan detail dasar agar Admin dapat memberikan estimasi harga yang akurat.</p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            id="fullName"
            label="Nama Lengkap"
            placeholder="Masukkan nama sesuai indentitas"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          
          <Input 
            id="phoneNumber"
            label="Nomor WhatsApp"
            type="tel"
            placeholder="0812xxxxxx"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <Select 
            id="serviceTypePriority"
            label="Prioritas Layanan"
            value={formData.serviceTypePriority}
            onChange={handleChange}
            options={[
              { label: 'Standar (Sesuai antrean)', value: 'standard' },
              { label: 'Ekspres (Lebih Cepat)', value: 'express' }
            ]}
          />

          <Input 
            id="notes"
            label="Catatan Tambahan (Opsional)"
            placeholder="Misal: Perpanjang STNK mobil tahun 2018..."
            value={formData.notes}
            onChange={handleChange}
          />
          
          <div style={styles.actions}>
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Kirim & Lanjut ke Negosiasi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', // Sleek background
  },
  glassCard: {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '3rem 2rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '2.5rem',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  actions: {
    marginTop: '2rem'
  }
};
