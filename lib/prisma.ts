// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient({
//     // Adding this will show the ACTUAL SQL and connection errors in your terminal
//     log: ["query", "error", "warn"], 
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });
