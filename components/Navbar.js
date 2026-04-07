'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3 border-bottom border-light">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" href="/">
          <div className="bg-warning-subtle px-3 py-1 rounded-3 me-2 d-flex align-items-center justify-content-center">
            <i className="bi bi-shield-check text-warning"></i>
          </div>
          <span>BIRO <span className="text-warning">JASA</span></span>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" href="#services">Layanan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" href="#about">Tentang Kami</Link>
            </li>
            {status === 'authenticated' ? (
              <>
                <li className="nav-item ms-lg-3">
                  <Link
                    className="btn btn-warning text-white fw-bold rounded-pill px-4 shadow-sm"
                    href={
                      session?.user?.role === 'SUPERADMIN' ? '/dashboard/admin/orders' :
                        session?.user?.role === 'STAFF' ? '/dashboard/staff/tasks' :
                          '/dashboard/user/history'
                    }
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-outline-danger btn-sm rounded-pill px-4 border-0">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-3">
                  <Link className="btn btn-link text-decoration-none text-dark fw-bold px-3" href="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning text-white fw-bold rounded-pill px-4 shadow-sm" href="/register">Daftar Gratis</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
