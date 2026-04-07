import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

const globalForPrisma = global;

let prisma;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
  prisma = new PrismaClient({ adapter, log: ['query'] });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

export { prisma };
