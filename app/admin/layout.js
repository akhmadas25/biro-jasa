"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { name: "Dashboard", icon: "bi-speedometer2", path: "/admin" },
    { name: "Layanan", icon: "bi-list-ul", path: "/admin/services" },
    { name: "Pemesanan", icon: "bi-cart-check", path: "/admin/orders" },
  ];

  // Superadmin only menu
  if (session?.user?.role === "SUPERADMIN") {
    menuItems.push({ name: "Kelola Staff", icon: "bi-people", path: "/admin/staff" });
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 vh-100 overflow-hidden">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none border-bottom w-100 border-secondary">
              <i className="bi bi-shield-lock me-2 text-primary fs-4"></i>
              <span className="fs-5 d-none d-sm-inline fw-bold">Admin Panel</span>
            </Link>
            
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100 mt-4" id="menu">
              {menuItems.map((item) => (
                <li className="nav-item w-100 mb-2" key={item.path}>
                  <Link
                    href={item.path}
                    className={`nav-link align-middle px-3 py-2 border-0 rounded-3 ${
                      pathname === item.path ? "active text-white" : "text-light opacity-75"
                    }`}
                  >
                    <i className={`bi ${item.icon} fs-5`}></i>
                    <span className="ms-2 d-none d-sm-inline">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <hr className="w-100 border-secondary opacity-25" />
            
            <div className="dropdown pb-4 w-100">
              <div className="d-flex align-items-center text-white text-decoration-none px-2 mb-2">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2 shadow-sm" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="d-none d-sm-inline overflow-hidden">
                  <p className="mb-0 small fw-bold text-truncate">{session?.user?.name}</p>
                  <p className="mb-0 text-secondary" style={{ fontSize: '10px' }}>{session?.user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="btn btn-outline-danger btn-sm w-100 mt-2 d-flex align-items-center justify-content-center shadow-sm"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col py-3 overflow-auto bg-light">
          <div className="px-md-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
