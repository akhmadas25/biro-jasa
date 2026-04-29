import React from 'react';

export const HeroSection = ({ config }) => {
  return (
    <section className="position-relative py-5 pt-lg-0">
      <div className="blob" style={{ top: '-100px', left: '-100px' }}></div>
      <div className="blob" style={{ bottom: '0', right: '-100px', background: 'radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>
      
      <div className="container position-relative">
        <div className="row align-items-center min-vh-100 py-5">
          <div className="col-lg-6 animate-fade-in text-center text-lg-start">
            <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">
              <i className="bi bi-patch-check-fill me-2"></i> {config.BADGE}
            </span>
            <h1 className="display-3 fw-bold mb-4 pe-lg-5" style={{ color: '#111827', lineHeight: '1.1' }}>
              Urus Dokumen <span className="text-warning">Kendaraan</span> Kini Lebih Efisien
            </h1>
            <p className="lead text-secondary mb-5 pe-lg-5">
              {config.SUBTITLE}
            </p>
            
            <div className="hero-search d-flex align-items-center p-2 mb-5 mx-auto mx-lg-0" style={{ maxWidth: '500px' }}>
              <div className="ps-3 pe-2 text-secondary">
                <i className="bi bi-search fs-5"></i>
              </div>
              <input 
                type="text" 
                className="form-control border-0 shadow-none bg-transparent" 
                placeholder={config.SEARCH_PLACEHOLDER} 
              />
              <button className="btn btn-warning rounded-pill px-4 text-white fw-bold py-2 ms-2 shadow-sm">
                Cari
              </button>
            </div>

            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4">
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex -space-x-2">
                   <img src="https://i.pravatar.cc/40?u=1" className="rounded-circle border border-white border-2" width="40" height="40" alt="user" />
                   <img src="https://i.pravatar.cc/40?u=2" className="rounded-circle border border-white border-2" width="40" height="40" alt="user" />
                   <img src="https://i.pravatar.cc/40?u=3" className="rounded-circle border border-white border-2" width="40" height="40" alt="user" />
                </div>
                <span className="small text-secondary fw-semibold">{config.STATS_CLIENTS}</span>
              </div>
              <div className="vr d-none d-sm-block"></div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-star-fill text-warning"></i>
                <span className="small text-secondary fw-semibold">{config.STATS_RATING}</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0 position-relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="position-relative animate-float">
              <div className="position-relative rounded-5 overflow-hidden shadow-lg p-3 bg-white border border-light">
                <img 
                  src="/hero-illustration.png" 
                  alt="CV BS Jasa Professional" 
                  className="img-fluid rounded-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
