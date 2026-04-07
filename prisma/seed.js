require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({ adapter });

async function main() {

  // 1. Create Superadmin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@birojasa.id' },
    update: {},
    create: {
      email: 'admin@birojasa.id',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log('Superadmin created/verified:', superadmin.email);

  // 2. Initial Services
  const services = [
    { name: 'STNK', slug: 'stnk', description: 'Perpanjangan STNK Tahunan & 5 Tahunan', price: 100000 },
    { name: 'Mutasi', slug: 'mutasi', description: 'Mutasi Kendaraan Antar Daerah', price: 500000 },
    { name: 'Balik Nama', slug: 'balik-nama', description: 'Proses Balik Nama Kepemilikan Kendaran', price: 400000 },
    { name: 'Ganti Plat', slug: 'ganti-plat', description: 'Pengurusan Plat Nomor Baru', price: 200000 },
    { name: 'SIM', slug: 'sim', description: 'Pembuatan & Perpanjangan SIM A, B, C', price: 150000 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('Services seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
