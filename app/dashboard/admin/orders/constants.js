export const ORDERS_CONFIG = {
  TITLE: "Manajemen Semua Pesanan",
  SUBTITLE: "Pantau dan kelola semua proses pengurusan berkas pelanggan.",
  
  // Status Labels & Colors
  STATUS_THEMES: {
    WAITING_ESTIMATE: { label: "Menunggu Estimasi", color: "warning" },
    WAITING_PAYMENT: { label: "Menunggu Pembayaran", color: "info" },
    VERIFYING_PAYMENT: { label: "Verifikasi Bayar", color: "primary" },
    PROCESSING: { label: "Sedang Diproses", color: "primary" },
    STAFF_COMPLETED: { label: "Selesai (Staff)", color: "success" },
    READY_FOR_DELIVERY: { label: "Siap Kirim/Ambil", color: "success" },
    COMPLETED: { label: "Tuntas", color: "secondary" },
    CANCELLED: { label: "Dibatalkan", color: "danger" }
  },

  // Table Headers
  TABLE_HEADERS: ["Tanggal", "ID Pesanan", "Pelanggan", "Layanan", "Staff", "Status", "Aksi"]
};
