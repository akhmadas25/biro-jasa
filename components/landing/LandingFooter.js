import React from 'react';
import Link from 'next/link';

export const LandingFooter = ({ config }) => {
  return (
    <footer className="py-5 bg-white border-top">
      <div className="container py-5">
        <div className="row gy-5">
          <div className="col-lg-4">
            <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center mb-4" href="/">
              <img
                src="/logo.png"
                alt="CV BS Jasa Logo"
                height="40"
                className="me-2"
              />
              <span>CV <span className="text-warning">BS JASA</span></span>
            </Link>
            <p className="text-secondary mb-4 pe-lg-5">
              {config.DESCRIPTION}
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-whatsapp fs-5"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-4">Navigasi</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2"><Link href="/" className="text-decoration-none text-secondary hover-text-warning">Home</Link></li>
              <li className="mb-2"><Link href="#services" className="text-decoration-none text-secondary hover-text-warning">Layanan</Link></li>
              <li className="mb-2"><Link href="/login" className="text-decoration-none text-secondary hover-text-warning">Login Member</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4">
            <h6 className="fw-bold mb-4">Layanan Populer</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2">Perpanjangan STNK Tahunan</li>
              <li className="mb-2">Ganti Plat 5 Tahunan</li>
              <li className="mb-2">Mutasi & Balik Nama</li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4">
            <h6 className="fw-bold mb-4">Kontak Kami</h6>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-warning-subtle p-2 rounded-circle text-warning lh-1"><i className="bi bi-geo-alt"></i></div>
              <span className="small text-secondary">Tegal, Indonesia</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning-subtle p-2 rounded-circle text-warning lh-1"><i className="bi bi-envelope"></i></div>
              <span className="small text-secondary">halo@bsjasa.id</span>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-top text-center">
          <p className="text-muted small">{config.COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
};
