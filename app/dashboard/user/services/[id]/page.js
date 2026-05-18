'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import useSWR from 'swr';
import { toast } from 'react-toastify';

import { SERVICE_FORM_CONFIG } from '@/app/dashboard/user/services/[id]/constants';
import { DocumentFields } from '@/app/dashboard/user/services/[id]/components';

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
    subServiceType: '',
    documents: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
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
          documents: { ...prev.documents, [fieldName]: reader.result }
        }));
        // Clear error for this field
        setFormErrors(prev => prev.filter(f => f !== fieldName));
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
    
    // Document Validation Logic
    const requiredDocs = [];
    if (currentService?.slug === 'stnk') {
      requiredDocs.push('foto_stnk');
      if (formData.subServiceType === 'pajak_5_tahunan') requiredDocs.push('foto_bpkb');
    } else if (currentService?.slug === 'ganti-plat') {
      requiredDocs.push('foto_stnk', 'foto_bpkb');
    } else if (currentService?.slug === 'balik-nama' || currentService?.slug === 'mutasi') {
      requiredDocs.push('foto_stnk', 'foto_bpkb', 'foto_kendaraan_4sisi');
    } else if (currentService?.slug === 'sim' && formData.subServiceType === 'perpanjang_sim') {
      requiredDocs.push('foto_sim_lama');
    }

    const missingFields = requiredDocs.filter(field => !formData.documents[field]);
    setFormErrors(missingFields);
    
    if (missingFields.length > 0) {
      const labels = {
        foto_stnk: 'Foto STNK',
        foto_bpkb: 'Foto BPKB',
        foto_kendaraan_4sisi: 'Foto Kendaraan',
        foto_sim_lama: 'Foto SIM Lama'
      };
      toast.error(`Mohon unggah dokumen wajib: ${missingFields.map(f => labels[f] || f).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const { documents, ...cleanFormDetails } = formData;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: serviceId, formDetails: cleanFormDetails, documentUrls: documents })
      });
      const order = await res.json();
      if (res.ok) {
        toast.success('Pemesanan berhasil dibuat!');
        router.push(`/dashboard/user/orders/${order.id}`);
      } else {
        toast.error(order.error || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4 py-md-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white-70 backdrop-blur" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="fw-bold mb-2 text-center text-dark h4 h2-md">{SERVICE_FORM_CONFIG.TITLE}</h2>
        <p className="text-secondary text-center small mb-4">{SERVICE_FORM_CONFIG.SUBTITLE}</p>

        <form onSubmit={handleSubmit}>
          <Input id="fullName" label={SERVICE_FORM_CONFIG.LABELS.NAME} placeholder="Contoh: Budi Santoso" value={formData.fullName} onChange={handleChange} required />
          <Input id="phoneNumber" label={SERVICE_FORM_CONFIG.LABELS.PHONE} type="tel" placeholder="0812xxxxxx" value={formData.phoneNumber} onChange={handleChange} required />

          {currentService?.slug === 'stnk' && (
            <Select id="subServiceType" label="Pilih Jenis Pajak" value={formData.subServiceType} onChange={handleChange}
              options={[{ label: 'Pilih...', value: '' }, { label: 'Pajak Tahunan', value: 'pajak_tahunan' }, { label: 'Pajak 5 Tahunan', value: 'pajak_5_tahunan' }]} required />
          )}

          {currentService?.slug === 'sim' && (
            <Select id="subServiceType" label="Pilih Jenis SIM" value={formData.subServiceType} onChange={handleChange}
              options={[{ label: 'Pilih...', value: '' }, { label: 'SIM Baru', value: 'sim_baru' }, { label: 'Perpanjang SIM', value: 'perpanjang_sim' }]} required />
          )}

          <DocumentFields
            slug={currentService?.slug}
            subType={formData.subServiceType}
            onFileChange={handleFileChange}
            config={SERVICE_FORM_CONFIG}
            documents={formData.documents}
            errors={formErrors}
          />

          <Input id="notes" label={SERVICE_FORM_CONFIG.LABELS.NOTES} placeholder="Catatan tambahan..." value={formData.notes} onChange={handleChange} />

          <Button type="submit" isLoading={isSubmitting} className="w-100 mt-3 fw-bold py-3">
            {SERVICE_FORM_CONFIG.BUTTON_TEXT}
          </Button>
        </form>
      </div>
    </div>
  );
}
