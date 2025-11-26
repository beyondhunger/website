import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

// Create a normal Prisma client (classic stable Prisma 5)
const prismaClient = () =>
  new PrismaClient({
    log: ["warn", "error"],
  });

export const prisma = globalForPrisma.prisma ?? prismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
