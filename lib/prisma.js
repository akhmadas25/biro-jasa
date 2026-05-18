import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global;

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return new PrismaClient({ log: ["query"] });

  try {
    let config;
    try {
      const url = new URL(dbUrl.replace("mysql:", "http:").replace("mysqls:", "https:"));
      config = {
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 3306,
        user: url.username,
        password: decodeURIComponent(url.password),
        database: url.pathname.substring(1).split('?')[0],
      };
    } catch (urlError) {
      // Manual fallback for URLs with special chars in password
      const regex = /mysqls?:\/\/([^:]+):(.+)@([^:/]+)(?::(\d+))?\/([^?]+)/;
      const match = dbUrl.match(regex);
      if (match) {
        const [_, user, password, host, port, database] = match;
        config = {
          host,
          port: port ? parseInt(port) : 3306,
          user,
          password,
          database,
        };
      } else {
        throw urlError;
      }
    }

    const adapter = new PrismaMariaDb({
      ...config,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      ssl: {
        rejectUnauthorized: true,
      },
    });
    return new PrismaClient({ adapter, log: ["query"] });
  } catch (error) {
    console.error("Prisma adapter init error details:", error);
    return new PrismaClient({ log: ["query", "error"] });
  }
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
