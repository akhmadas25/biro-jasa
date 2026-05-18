import React from 'react';

export const DocumentFields = ({ slug, subType, onFileChange, config, documents, errors = [] }) => {
  const FileInput = ({ label, field, isRequired = true }) => {
    const preview = documents?.[field];
    const hasError = errors.includes(field);
    const displayLabel = label + (isRequired ? '' : ' (Opsional)');
    return (
      <div className="mb-4">
        <label className="form-label fw-bold small text-secondary m-0 mb-2 d-flex align-items-center gap-2">
          {displayLabel}
          {preview && <span className="badge bg-success-subtle text-success rounded-pill border border-success-subtle px-2 py-1" style={{ fontSize: '0.6rem' }}><i className="bi bi-check-circle-fill me-1"></i>Siap Kirim</span>}
        </label>

        <div className={`p-3 rounded-4 border-2 ${preview ? 'border-success bg-success-subtle' : (hasError ? 'border-danger bg-danger-subtle' : 'border-dashed bg-white')} transition-all`} style={{ borderStyle: (preview || hasError) ? 'solid' : 'dashed' }}>
          <div className="d-flex align-items-center gap-3">
            {preview ? (
              <div className="rounded-3 overflow-hidden border-2 border-white shadow-sm flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                <img src={preview} alt="preview" className="w-100 h-100 object-fit-cover" />
              </div>
            ) : (
              <div className="rounded-3 d-flex align-items-center justify-content-center bg-light border flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-cloud-arrow-up fs-3 text-secondary"></i>
              </div>
            )}

            <div className="flex-grow-1 overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm border-0 bg-transparent p-0"
                onChange={(e) => onFileChange(e, field)}
                id={`file-${field}`}
                style={{ visibility: 'hidden', position: 'absolute', width: '1px' }}
              />
              <label htmlFor={`file-${field}`} className="btn btn-sm btn-outline-primary border-2 fw-bold rounded-pill px-3 cursor-pointer mb-1">
                {preview ? 'Ganti Berkas' : 'Pilih Berkas'}
              </label>
              <p className={`${hasError ? 'text-danger fw-bold' : 'text-muted'} m-0`} style={{ fontSize: '0.7rem' }}>
                {preview ? 'Berkas berhasil diunggah' : (hasError ? 'Wajib diunggah!' : 'Format: JPG, PNG, WEBP (Max 5MB)')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-light p-3 rounded-4 mb-4 border border-white">
      {slug === 'stnk' && subType === 'pajak_tahunan' && (
        <>
          <FileInput label={config.LABELS.DOC_STNK} field="foto_stnk" />
          <FileInput label={config.LABELS.DOC_KTP_STNK} field="foto_ktp" isRequired={false} />
        </>
      )}

      {slug === 'stnk' && subType === 'pajak_5_tahunan' && (
        <>
          <FileInput label={config.LABELS.DOC_STNK} field="foto_stnk" />
          <FileInput label={config.LABELS.DOC_KTP} field="foto_ktp" isRequired={false} />
          <FileInput label={config.LABELS.DOC_BPKB} field="foto_bpkb" />
        </>
      )}

      {(slug === 'balik-nama' || slug === 'mutasi') && (
        <>
          <FileInput label={config.LABELS.DOC_STNK} field="foto_stnk" />
          <FileInput label={config.LABELS.DOC_KTP_NEW} field="foto_ktp" isRequired={false} />
          <FileInput label={config.LABELS.DOC_BPKB} field="foto_bpkb" />
          <FileInput label={config.LABELS.DOC_VEHICLE} field="foto_kendaraan_4sisi" />
        </>
      )}

      {slug === 'sim' && subType === 'sim_baru' && (
        <FileInput label={config.LABELS.DOC_KTP} field="foto_ktp" isRequired={false} />
      )}

      {slug === 'sim' && subType === 'perpanjang_sim' && (
        <FileInput label={config.LABELS.DOC_SIM_OLD} field="foto_sim_lama" />
      )}
    </div>
  );
};
