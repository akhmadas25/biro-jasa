export const REPORT_CONFIG = {
  // Wording & Identitas
  TITLE: "LAPORAN TRANSAKSI CV BS JASA",
  SUBTITLE: "Ringkasan keuangan dari pesanan yang telah tuntas.",
  LOCATION: "Tegal", // Bisa diganti sesuai domisili biro
  OFFICIAL_NAME: "CV BS Jasa Official",
  
  // Format File
  FILENAME_PREFIX: "Laporan_CV_BS_Jasa",
  
  // Warna (Hex atau RGB array)
  COLORS: {
    PRIMARY: "#0d6efd",
    SUCCESS: "#198754",
    DANGER: "#dc3545",
    TABLE_HEADER: [240, 240, 240]
  },

  // Pengaturan Tabel
  TABLE_HEADERS: ["Tanggal", "Layanan & User", "Rincian Riil", "Estimasi", "Fixed", "Kembalian"],
};
