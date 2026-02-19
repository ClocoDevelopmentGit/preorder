import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Recreating session table to match Prisma schema perfectly...');
  
  try {
    // We DROP and CREATE to ensure no column naming/type mismatches
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "session" CASCADE;`);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "session" (
        "id" TEXT PRIMARY KEY,
        "shop" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "isOnline" BOOLEAN NOT NULL DEFAULT FALSE,
        "scope" TEXT,
        "expires" TIMESTAMP WITH TIME ZONE,
        "accessToken" TEXT NOT NULL,
        "userId" BIGINT,
        "firstName" TEXT,
        "lastName" TEXT,
        "email" TEXT,
        "accountOwner" BOOLEAN NOT NULL DEFAULT FALSE,
        "locale" TEXT,
        "collaborator" BOOLEAN DEFAULT FALSE,
        "emailVerified" BOOLEAN DEFAULT FALSE,
        "refreshToken" TEXT,
        "refreshTokenExpires" TIMESTAMP WITH TIME ZONE
      );
    `);
    
    console.log('Successfully recreated "session" table.');
  } catch (e) {
    console.error('Failed to recreate table:', e.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
