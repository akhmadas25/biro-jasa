import React from 'react';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';

// 1. Panel Informasi Klien & Dokumen
export const ClientInfoPanel = ({ order, onImageClick, config }) => {
  const docs = order.documentUrls || order.formDetails?.documents;
  
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">{config.SECTIONS.INFO}</h6>
      <div className="mb-3">
        <label className="text-muted small d-block">Nama Lengkap</label>
        <span className="fw-semibold text-dark">{order.formDetails?.fullName}</span>
      </div>
      <div className="mb-3">
        <label className="text-muted small d-block">Nomor WhatsApp</label>
        <span className="fw-semibold text-dark">{order.formDetails?.phoneNumber}</span>
      </div>
      <div className="mb-0">
        <label className="text-muted small d-block">Catatan Khusus</label>
        <div className="p-3 bg-light rounded-3 small text-secondary mt-1">
          {order.formDetails?.notes || 'Tidak ada catatan.'}
        </div>
      </div>

      {docs && Object.keys(docs).length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Dokumen Persyaratan</h6>
          <div className="d-flex flex-wrap gap-3">
            {Object.entries(docs).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  onClick={() => onImageClick(value, key.replace(/_/g, ' ').toUpperCase())} 
                  className="d-block border rounded p-1 mb-1 shadow-sm cursor-pointer" 
                  style={{ width: '70px', height: '70px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src={value} alt={key} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <small className="text-muted text-capitalize" style={{ fontSize: '0.7rem' }}>{key.replace(/_/g, ' ')}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Panel Keuangan (Estimasi, Nego, Fixed)
export const FinancePanel = ({ 
  order, 
  estItems, setEstItems, 
  agreedPrice, setAgreedPrice,
  fixedItems, setFixedItems,
  paymentInstructions, setPaymentInstructions,
  handleSetEstimate, handleSetAgreed, handleSetFixed, handleFinalizeOrder,
  isUpdating, config 
}) => {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Keuangan & Harga</h6>

      {/* ESTIMASI SECTION */}
      <div className="mb-4 pb-4 border-bottom">
        <label className="text-muted small d-block mb-2">Estimasi: <span className="text-dark fw-bold">{order.estimatedPrice ? `Rp ${order.estimatedPrice.toLocaleString()}` : 'Belum Ada'}</span></label>

        <div className="bg-light p-3 rounded-3 mb-3">
          <small className="fw-bold d-block mb-2 text-secondary">Rincian Estimasi:</small>
          {estItems.map((item, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2">
              <input className="form-control form-control-sm" placeholder="Label" value={item.label} onChange={e => {
                const newItems = [...estItems]; newItems[idx].label = e.target.value; setEstItems(newItems);
              }} />
              <input className="form-control form-control-sm w-50" type="number" placeholder="Harga" value={item.price} onChange={e => {
                const newItems = [...estItems]; newItems[idx].price = e.target.value; setEstItems(newItems);
              }} />
              <button className="btn btn-sm btn-outline-danger" onClick={() => setEstItems(estItems.filter((_, i) => i !== idx))}>×</button>
            </div>
          ))}
          <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => setEstItems([...estItems, { label: '', price: '' }])}>+ Tambah Baris</button>
          <div className="mt-2 text-end">
            <small className="fw-bold">Total: Rp {estItems.reduce((acc, curr) => acc + Number(curr.price), 0).toLocaleString()}</small>
          </div>
        </div>
        <Button size="sm" className="w-100 m-0" onClick={handleSetEstimate} isLoading={isUpdating}>Update Estimasi</Button>
      </div>

      {/* DEAL SECTION */}
      <div className="mb-4 pb-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="text-muted small d-block m-0">Harga Deal: <span className="text-success fw-bold">{order.agreedPrice ? `Rp ${order.agreedPrice.toLocaleString()}` : 'Belum Deal'}</span></label>
          {!order.agreedPrice && order.estimatedPrice && (
             <button className="btn btn-sm btn-link text-decoration-none p-0 small" style={{fontSize: '0.7rem'}} onClick={() => setAgreedPrice(order.estimatedPrice)}>Salin dari Estimasi</button>
          )}
        </div>
        <Input type="number" placeholder="Harga Final" value={agreedPrice} onChange={(e) => setAgreedPrice(e.target.value)} className="mb-2" />
        <div className="mb-3">
          <label className="text-muted small d-block mb-1">Instruksi Pembayaran:</label>
          <textarea className="form-control form-control-sm bg-light border-0 rounded-3" placeholder="Contoh: Transfer ke Rek BCA..." value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)} rows={2} />
        </div>
        <Button variant="success" className="w-100 shadow-sm text-white fw-bold m-0" onClick={handleSetAgreed} isLoading={isUpdating} disabled={!agreedPrice || !order.estimatedPrice}>Set Harga & Lanjut Bayar</Button>
      </div>

      {/* FIXED SECTION */}
      {['STAFF_COMPLETED', 'READY_FOR_DELIVERY', 'COMPLETED'].includes(order.status) ? (
        <div className="mb-0">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="text-muted small d-block m-0">Harga Fixed: <span className="text-primary fw-bold">{order.fixedPrice ? `Rp ${order.fixedPrice.toLocaleString()}` : 'Belum Ada'}</span></label>
            {!order.fixedPrice && estItems[0]?.label && order.status !== 'COMPLETED' && (
               <button className="btn btn-sm btn-link text-decoration-none p-0 small" style={{fontSize: '0.7rem'}} onClick={() => setFixedItems([...estItems])}>Salin dari Estimasi</button>
            )}
          </div>
          
          <div className="bg-light p-3 rounded-3 mb-3">
            <small className="fw-bold d-block mb-2 text-secondary">Rincian Riil / Fixed:</small>
            {fixedItems.map((item, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2">
                <input className="form-control form-control-sm" placeholder="Label" value={item.label} disabled={order.status === 'COMPLETED'} onChange={e => {
                  const newItems = [...fixedItems]; newItems[idx].label = e.target.value; setFixedItems(newItems);
                }} />
                <input className="form-control form-control-sm w-50" type="number" placeholder="Harga" value={item.price} disabled={order.status === 'COMPLETED'} onChange={e => {
                  const newItems = [...fixedItems]; newItems[idx].price = e.target.value; setFixedItems(newItems);
                }} />
                {order.status !== 'COMPLETED' && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setFixedItems(fixedItems.filter((_, i) => i !== idx))}>×</button>
                )}
              </div>
            ))}
            {order.status !== 'COMPLETED' && <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => setFixedItems([...fixedItems, { label: '', price: '' }])}>+ Tambah Baris</button>}
            <div className="mt-2 text-end">
              <small className="fw-bold">Total: Rp {fixedItems.reduce((acc, curr) => acc + Number(curr.price), 0).toLocaleString()}</small>
            </div>
          </div>
          {order.status !== 'COMPLETED' && (
            <Button variant="primary" className="w-100 shadow-sm text-white fw-bold m-0" onClick={handleSetFixed} isLoading={isUpdating} disabled={!order.agreedPrice}>Simpan Rincian Fixed</Button>
          )}
          {order.status === 'COMPLETED' && <div className="alert alert-success border-0 rounded-3 p-2 small text-center mb-0"><i className="bi bi-lock-fill me-1"></i> Data Terkunci</div>}
          {['STAFF_COMPLETED', 'READY_FOR_DELIVERY'].includes(order.status) && (
             <Button variant="success" className="w-100 shadow-sm text-white fw-bold mt-2" onClick={handleFinalizeOrder} isLoading={isUpdating}>Selesaikan & Simpan ke Laporan</Button>
          )}
          {order.estimatedPrice && order.fixedPrice && (
            <div className="mt-3 p-2 bg-warning-subtle rounded-3 small text-center">
              Sisa Kembalian: <strong className="text-danger">Rp {(order.estimatedPrice - order.fixedPrice).toLocaleString()}</strong>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-light rounded-3 text-center opacity-50">
          <small className="text-secondary italic">Rincian Fixed tersedia setelah Staff selesai.</small>
        </div>
      )}
    </div>
  );
};

// 3. Panel Status & Penugasan
export const StatusPanel = ({ 
  order, staffList, selectedStaffId, setSelectedStaffId, 
  handleApprovePayment, handleReceivePhysicalDocs, handleAssignStaff,
  onImageClick, isUpdating, config 
}) => {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Status & Penugasan</h6>

      <div className="mb-4 pb-4 border-bottom">
        <label className="text-muted small d-block mb-1">{config.SECTIONS.VERIFICATION}</label>
        <div className="d-flex align-items-center justify-content-between">
          <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'} px-3 py-2`}>{order.paymentStatus}</span>
          {order.paymentProofUrl && (
            <button onClick={() => onImageClick(order.paymentProofUrl, 'BUKTI PEMBAYARAN')} className="btn btn-sm btn-link text-decoration-none">
              <i className="bi bi-image me-1"></i> Bukti
            </button>
          )}
        </div>
        {order.paymentStatus === 'PENDING_VERIFICATION' && (
          <Button variant="secondary" className="w-100 mt-2 btn-sm" onClick={handleApprovePayment} isLoading={isUpdating}>Verifikasi Pembayaran</Button>
        )}
      </div>

      <div className="mb-0">
        <label className="text-muted small d-block mb-1">{config.BADGE_STAFF}</label>
        <div className="p-2 bg-light rounded-3 mb-3 fw-bold small text-center text-primary">{order.staff?.name || 'BELUM DITUGASKAN'}</div>

        {order.status === 'WAITING_DOCUMENTS' && (
          <Button variant="info" className="w-100 btn-sm text-white mb-2" onClick={handleReceivePhysicalDocs} isLoading={isUpdating}>Konfirmasi Berkas Fisik</Button>
        )}

        {order.status === 'DOCUMENTS_RECEIVED' && (
          <div className="mt-2">
            <select className="form-select form-select-sm mb-2 border-0 bg-light" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
              <option value="">-- Pilih Staff --</option>
              {staffList?.map(s => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
            </select>
            <Button className="w-100 btn-sm variant-secondary" onClick={handleAssignStaff} isLoading={isUpdating} disabled={!selectedStaffId}>Tugaskan Staff</Button>
          </div>
        )}
      </div>
    </div>
  );
};
