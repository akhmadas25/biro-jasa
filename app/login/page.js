"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      setError(result.error || "Login gagal. Silakan coba lagi.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-vh-100 d-flex bg-white overflow-hidden">
      <div className="row w-100 g-0">
        {/* Left Column: Login Form */}
        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center p-5">
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
              <h2 className="fw-bold display-6 mb-2">Selamat Datang</h2>
              <p className="text-secondary">Silakan login untuk mengelola dokumen kendaraan Anda secara efisien.</p>
            </div>

            {registered && (
              <div className="alert alert-success border-0 rounded-4 py-3 small text-center mb-4 shadow-sm animate-fade-in">
                <i className="bi bi-check-circle-fill me-2"></i> Pendaftaran berhasil! Silakan login.
              </div>
            )}

            {error && <div className="alert alert-danger border-0 rounded-4 py-3 small text-center mb-4 shadow-sm animate-fade-in">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Email Terdaftar</label>
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
                    placeholder="Masukkan password Anda"
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
                Masuk Sekarang
              </button>
            </form>

            <div className="text-center">
              <p className="small text-secondary mb-0">
                Belum punya akun? <Link href="/register" className="text-warning text-decoration-none fw-bold ms-1">Daftar Gratis</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Illustration (Desktop Only) */}
        <div className="col-lg-6 d-none d-lg-flex bg-warning-subtle align-items-center justify-content-center p-5 position-relative">
          <div className="blob" style={{ bottom: '-150px', right: '-150px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>
          <div className="text-center position-relative z-1">
            <div className="animate-float">
              <img 
                src="/auth-illustration.png" 
                alt="Secure Login" 
                className="img-fluid mb-5" 
                style={{ maxWidth: '450px' }} 
              />
            </div>
            <h4 className="fw-bold mb-3">Keamanan & Kecepatan</h4>
            <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
              Proses terstandarisasi dengan enkripsi keamanan tingkat tinggi untuk perlindungan data dokumen Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
