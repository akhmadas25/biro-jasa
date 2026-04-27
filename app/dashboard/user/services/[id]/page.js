'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

export default function ServiceFormPage({ params }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    serviceTypePriority: 'standard',
    notes: '',
    subServiceType: '', // For STNK (pajak tahunan / 5 tahunan) and SIM (baru / perpanjang)
    documents: {} // To store base64 strings
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    params.then(p => setServiceId(p.id));
  }, [params]);

  const { data: services } = useSWR('/api/services', fetcher);
  const currentService = services?.find(s => s.id === serviceId);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [fieldName]: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { documents, ...cleanFormDetails } = formData;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: serviceId, // Must match an ID in DB in fully working app
          formDetails: cleanFormDetails,
          documentUrls: documents
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

          {currentService?.slug === 'stnk' && (
            <Select 
              id="subServiceType"
              label="Jenis Layanan STNK"
              value={formData.subServiceType}
              onChange={handleChange}
              options={[
                { label: 'Pilih Jenis', value: '' },
                { label: 'Pajak Tahunan', value: 'pajak_tahunan' },
                { label: 'Pajak 5 Tahunan', value: 'pajak_5_tahunan' }
              ]}
              required
            />
          )}

          {currentService?.slug === 'sim' && (
            <Select 
              id="subServiceType"
              label="Jenis Layanan SIM"
              value={formData.subServiceType}
              onChange={handleChange}
              options={[
                { label: 'Pilih Jenis', value: '' },
                { label: 'SIM Baru', value: 'sim_baru' },
                { label: 'Perpanjang SIM', value: 'perpanjang_sim' }
              ]}
              required
            />
          )}

          {/* Dynamic Document Fields */}
          {currentService?.slug === 'stnk' && formData.subServiceType === 'pajak_tahunan' && (
            <div className="mb-3">
              <label className="form-label font-medium mb-1 block">Foto STNK</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_stnk')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto KTP</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_ktp')} required />
            </div>
          )}

          {(currentService?.slug === 'stnk' && formData.subServiceType === 'pajak_5_tahunan') || currentService?.slug === 'ganti-plat' ? (
            <div className="mb-3">
              <label className="form-label font-medium mb-1 block">Foto STNK</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_stnk')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto KTP</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_ktp')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto BPKB</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_bpkb')} required />
              <label className="form-label font-medium mb-1 block mt-2">Gesekan Nomor Rangka & Mesin</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'gesekan_nomor')} required />
            </div>
          ) : null}

          {(currentService?.slug === 'balik-nama' || currentService?.slug === 'mutasi') && (
            <div className="mb-3">
              <label className="form-label font-medium mb-1 block">Foto STNK</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_stnk')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto KTP</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_ktp')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto BPKB</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_bpkb')} required />
              <label className="form-label font-medium mb-1 block mt-2">Gesekan Nomor Rangka & Mesin</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'gesekan_nomor')} required />
              <label className="form-label font-medium mb-1 block mt-2">Foto Kendaraan 4 Sisi</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_kendaraan_4sisi')} required />
            </div>
          )}

          {currentService?.slug === 'sim' && formData.subServiceType === 'sim_baru' && (
            <div className="mb-3">
              <label className="form-label font-medium mb-1 block">Foto KTP</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_ktp')} required />
            </div>
          )}

          {currentService?.slug === 'sim' && formData.subServiceType === 'perpanjang_sim' && (
            <div className="mb-3">
              <label className="form-label font-medium mb-1 block">Foto SIM Lama</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'foto_sim_lama')} required />
            </div>
          )}

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
