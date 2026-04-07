import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { isActive: true }
  });

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

  return (
    <main className="position-relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="position-relative py-5 pt-lg-0">
        <div className="blob" style={{ top: '-100px', left: '-100px' }}></div>
        <div className="blob" style={{ bottom: '0', right: '-100px', background: 'radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>
        
        <div className="container position-relative">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6 animate-fade-in text-center text-lg-start">
              <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">
                <i className="bi bi-patch-check-fill me-2"></i> Terpercaya & Cepat
              </span>
              <h1 className="display-3 fw-bold mb-4 pe-lg-5" style={{ color: '#111827', lineHeight: '1.1' }}>
                Urus Dokumen <span className="text-warning">Kendaraan</span> Kini Lebih Efisien
              </h1>
              <p className="lead text-secondary mb-5 pe-lg-5">
                Solusi profesional untuk STNK, Mutasi, dan BPKB tanpa antri. Kami buat proses birokrasi menjadi sangat mudah bagi Anda.
              </p>
              
              {/* Hero Search Bar */}
              <div className="hero-search d-flex align-items-center p-2 mb-5 mx-auto mx-lg-0" style={{ maxWidth: '500px' }}>
                <div className="ps-3 pe-2 text-secondary">
                  <i className="bi bi-search fs-5"></i>
                </div>
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none bg-transparent" 
                  placeholder="Cari layanan yang Anda butuhkan..." 
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
                  <span className="small text-secondary fw-semibold">100k+ Klien Puas</span>
                </div>
                <div className="vr d-none d-sm-block"></div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-star-fill text-warning"></i>
                  <span className="small text-secondary fw-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0 position-relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="position-relative animate-float">
                <div className="position-relative rounded-5 overflow-hidden shadow-lg p-3 bg-white border border-light">
                  <img 
                    src="/hero-illustration.png" 
                    alt="Biro Jasa Professional" 
                    className="img-fluid rounded-4"
                  />
                </div>
                
                {/* Floating Stats Badges */}
                <div className="stats-badge position-absolute top-10 start-0 translate-middle-x d-none d-md-flex">
                  <div className="bg-warning text-white p-2 rounded-3 d-flex align-items-center justify-content-center h5 m-0 shadow-sm">
                    <i className="bi bi-rocket-takeoff"></i>
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">100k+</h6>
                    <p className="m-0 x-small text-secondary" style={{ fontSize: '0.7rem' }}>Klien Terlayani</p>
                  </div>
                </div>

                <div className="stats-badge position-absolute bottom-10 end-0 translate-middle-x d-none d-md-flex" style={{ bottom: '15%' }}>
                   <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center h5 m-0 shadow-sm">
                    <i className="bi bi-check2-circle"></i>
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold">50k+</h6>
                    <p className="m-0 x-small text-secondary" style={{ fontSize: '0.7rem' }}>Selesai Berhasil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-white position-relative">
        <div className="container py-5">
          <div className="text-center mb-5 animate-fade-in">
            <h6 className="text-warning fw-bold text-uppercase ls-wide small mb-2">Layanan Utama</h6>
            <h2 className="display-5 fw-bold mb-4 text-dark">Solusi Tepat Untuk Anda</h2>
            <p className="text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
              Pilih dari berbagai layanan administrasi kendaraan kami yang telah terstandarisasi dan terpercaya.
            </p>
          </div>
          
          <div className="row g-4">
            {services.map((item, index) => (
              <div className="col-lg-4 col-md-6 animate-fade-in" key={index} style={{ animationDelay: `${0.1 * index}s` }}>
                <Link href={`/dashboard/user/services/${item.id}`} className="text-decoration-none h-100 d-block">
                  <div className="card h-100 service-card p-5">
                    <div className="mb-4 bg-light p-3 rounded-4 d-inline-flex text-warning fs-3 shadow-sm">
                      <i className={`bi ${getIcon(item.slug)}`}></i>
                    </div>
                    <h4 className="fw-bold mb-3 text-dark">{item.name}</h4>
                    <p className="text-secondary mb-4 small line-clamp-2">{item.description}</p>
                    <div className="text-warning fw-bold d-flex align-items-center gap-2 group-hover-translate-x mt-auto">
                      Lihat Detail <i className="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-5 mb-5 overflow-hidden">
        <div className="container py-5 bg-dark rounded-5 p-5 text-white position-relative">
          <div className="row align-items-center text-center text-lg-start">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Siap Urus Surat Kendaraan Hari Ini?</h2>
              <p className="text-secondary-emphasis mb-0">Dapatkan layanan tercepat dan terpercaya untuk seluruh kebutuhan administrasi Anda.</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
               <Link href="/register" className="btn btn-warning btn-lg text-white rounded-pill px-5 fw-bold shadow">
                 Mulai Sekarang
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-white border-top">
        <div className="container py-5">
          <div className="row gy-5">
            <div className="col-lg-4">
              <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center mb-4" href="/">
                <div className="bg-warning-subtle p-2 rounded-3 me-2 d-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-check text-warning"></i>
                </div>
                <span>BIRO <span className="text-warning">JASA</span></span>
              </Link>
              <p className="text-secondary mb-4 pe-lg-5">
                Solusi administrasi kendaraan tercepat di Indonesia. Kami menangani STNK, Mutasi, dan BPKB dengan profesional.
              </p>
              <div className="d-flex gap-3">
                 <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-facebook fs-5"></i></a>
                 <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-instagram fs-5"></i></a>
                 <a href="#" className="btn btn-light rounded-circle p-2 text-warning lh-1"><i className="bi bi-twitter-x fs-5"></i></a>
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
                <li className="mb-2">Pengurusan SIM & BPKB</li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4">
              <h6 className="fw-bold mb-4">Kontak Kami</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-warning-subtle p-2 rounded-circle text-warning lh-1"><i className="bi bi-geo-alt"></i></div>
                <span className="small text-secondary">Jakarta Selatan, Indonesia</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning-subtle p-2 rounded-circle text-warning lh-1"><i className="bi bi-envelope"></i></div>
                <span className="small text-secondary">halo@birojasa.id</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-top text-center">
            <p className="text-muted small">&copy; 2026 Biro Jasa Maju. Semua Hak Dilindungi.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
