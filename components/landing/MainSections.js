import React from 'react';
import Link from 'next/link';

const getIcon = (slug) => {
  switch(slug) {
    case 'stnk': return 'bi-card-text';
    case 'mutasi': return 'bi-arrow-left-right';
    case 'balik-nama': return 'bi-person-badge';
    case 'ganti-plat': return 'bi-regex';
    case 'sim': return 'bi-person-vcard';
    default: return 'bi-gear';
  }
};

export const ServicesSection = ({ services, config }) => {
  return (
    <section id="services" className="py-5 bg-white position-relative">
      <div className="container py-5">
        <div className="text-center mb-5 animate-fade-in">
          <h6 className="text-warning fw-bold text-uppercase ls-wide small mb-2">{config.SECTION_TITLE}</h6>
          <h2 className="display-5 fw-bold mb-4 text-dark">{config.MAIN_HEADING}</h2>
          <p className="text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>{config.SUBTEXT}</p>
        </div>
        
        <div className="row g-4">
          {services.map((item, index) => (
            <div className="col-lg-4 col-md-6 animate-fade-in" key={index} style={{ animationDelay: `${0.1 * index}s` }}>
              <Link href={`/dashboard/user/services/${item.id}`} className="text-decoration-none h-100 d-block">
                <div className="card h-100 service-card p-5 border-0 shadow-sm rounded-4">
                  <div className="mb-4 bg-light p-3 rounded-4 d-inline-flex text-warning fs-3 shadow-sm">
                    <i className={`bi ${getIcon(item.slug)}`}></i>
                  </div>
                  <h4 className="fw-bold mb-3 text-dark">{item.name}</h4>
                  <p className="text-secondary small line-clamp-2">{item.description}</p>
                  <div className="text-warning fw-bold d-flex align-items-center gap-2 mt-auto">
                    Lihat Detail <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTASection = ({ config }) => {
  return (
    <section className="py-5 mb-5 overflow-hidden">
      <div className="container py-5 bg-dark rounded-5 p-5 text-white position-relative shadow-lg">
        <div className="row align-items-center text-center text-lg-start">
          <div className="col-lg-8">
            <h2 className="display-6 fw-bold mb-3 text-white">{config.HEADING}</h2>
            {/* Pakai text-white murni biar nggak ada alasan dia berubah item */}
            <p className="mb-0 text-white opacity-75 fw-medium" style={{ color: 'white' }}>{config.SUBTEXT}</p>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
             <Link href="/register" className="btn btn-warning btn-lg text-white rounded-pill px-5 fw-bold shadow-sm">
               {config.BUTTON_TEXT}
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
