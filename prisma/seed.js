require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');

const dbUrl = process.env.DATABASE_URL;

let adapter;
try {
  const url = new URL(dbUrl.replace("mysql:", "http:"));
  adapter = new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? parseInt(url.port) : 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.substring(1).split('?')[0],
    connectTimeout: 10000,
    acquireTimeout: 10000,
    ssl: {
      rejectUnauthorized: true,
    },
  });
} catch (error) {
  console.error("Failed to parse DATABASE_URL for adapter:", error);
  adapter = new PrismaMariaDb(dbUrl);
}

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
