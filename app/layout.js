import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Biro Jasa Profesional - Layanan Cepat & Terpercaya",
  description: "Solusi pengurusan STNK, Mutasi, Balik Nama, Ganti Plat, dan SIM dengan proses cepat dan aman.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body>
        <Providers>
          <BootstrapClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}
