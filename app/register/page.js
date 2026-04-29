"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Terjadi kesalahan saat pendaftaran.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex bg-white overflow-hidden">
      <div className="row w-100 g-0">
        {/* Left Column: Register Form */}
        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center p-5 order-2 order-lg-1">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            {/* Branding Logo */}
            <Link href="/" className="d-flex align-items-center text-decoration-none mb-5 justify-content-center justify-content-lg-start">
              <img 
                src="/logo.png" 
                alt="CV BS Jasa Logo" 
                height="40" 
                className="me-2"
              />
              <span className="fw-bold fs-4 text-dark">CV <span className="text-warning">BS JASA</span></span>
            </Link>

            <div className="mb-4 text-center text-lg-start">
              <h2 className="fw-bold display-6 mb-2">Daftar Akun</h2>
              <p className="text-secondary">Gabung bersama ribuan pengguna lainnya untuk kemudahan urusan kendaraan.</p>
            </div>

            {error && <div className="alert alert-danger border-0 rounded-4 py-3 small text-center mb-4 shadow-sm animate-fade-in">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Nama Lengkap</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 rounded-start-4 px-3 text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-0 rounded-end-4 py-3 ps-0 shadow-none"
                    required
                    placeholder="Contoh: John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 rounded-start-4 px-3 text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-0 rounded-end-4 py-3 ps-0 shadow-none"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label small fw-bold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 rounded-start-4 px-3 text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-light border-0 rounded-end-4 py-3 ps-0 shadow-none"
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 py-3 fw-bold rounded-pill text-white shadow-sm mb-4"
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm me-3"></span> : null}
                Buat Akun Sekarang
              </button>
            </form>

            <div className="text-center">
              <p className="small text-secondary mb-0">
                Sudah punya akun? <Link href="/login" className="text-warning text-decoration-none fw-bold ms-1">Login di sini</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Illustration (Desktop Only) */}
        <div className="col-lg-6 d-none d-lg-flex bg-warning-subtle align-items-center justify-content-center p-5 position-relative order-1 order-lg-2">
          <div className="blob" style={{ top: '-150px', left: '-150px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>
          <div className="text-center position-relative z-1">
            <div className="animate-float">
              <img 
                src="/auth-illustration.png" 
                alt="Register Now" 
                className="img-fluid mb-5" 
                style={{ maxWidth: '450px' }} 
              />
            </div>
            <h4 className="fw-bold mb-3">Pendaftaran Cepat</h4>
            <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
              Hanya butuh 30 detik untuk bergabung. Mulai nikmati kemudahan mengelola administrasi kendaraan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
