import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Basic stats (mock implementation if DB not migrated yet)
  let stats = {
    orders: 0,
    pending: 0,
    services: 0,
    staff: 0
  };

  try {
    stats.orders = await prisma.order.count();
    stats.pending = await prisma.order.count({ where: { status: "PENDING" } });
    stats.services = await prisma.service.count();
    stats.staff = await prisma.user.count({ where: { role: "STAFF" } });
  } catch (e) {
    console.error("DB Error. Make sure migrations are run.", e);
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard Overview</h2>
        <span className="badge bg-primary px-3 py-2">Role: {session.user.role}</span>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-cart-check fs-2 opacity-50"></i>
                <span className="fs-1 fw-bold">{stats.orders}</span>
              </div>
              <p className="mb-0 text-white-50">Total Pesanan</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-hourglass-split fs-2 opacity-50"></i>
                <span className="fs-1 fw-bold">{stats.pending}</span>
              </div>
              <p className="mb-0 text-dark-50">Menunggu Proses</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-info text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-gear fs-2 opacity-50"></i>
                <span className="fs-1 fw-bold">{stats.services}</span>
              </div>
              <p className="mb-0 text-dark-50">Layanan Aktif</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-people fs-2 opacity-50"></i>
                <span className="fs-1 fw-bold">{stats.staff}</span>
              </div>
              <p className="mb-0 text-white-50">Total Staff</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">Pengajuan Terbaru</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-secondary small">
                    <th>ORDER ID</th>
                    <th>PELANGGAN</th>
                    <th>LAYANAN</th>
                    <th>TANGGAL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state or sample row */}
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted small">
                      Belum ada data pengajuan terjadwal
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">Aktivitas Cepat</h5>
            <div className="d-grid gap-3">
              <button className="btn btn-outline-primary btn-lg text-start py-3 px-4 rounded-3 small">
                <i className="bi bi-plus-circle me-3"></i> Buat Pesanan Manual
              </button>
              <button className="btn btn-outline-secondary btn-lg text-start py-3 px-4 rounded-3 small">
                <i className="bi bi-file-earmark-bar-graph me-3"></i> Cetak Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
