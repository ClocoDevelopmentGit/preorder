import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('--- EMERGENCY DB REPAIR ---');
  
  try {
    // 1. Check if table 'session' exists in public schema
    const tables: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'session'
    `;

    if (tables.length === 0) {
      console.log('Table "session" does not exist. Creating it...');
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
      console.log('Created "session" table.');
    } else {
      console.log('Table "session" exists. Adding missing columns...');
      
      const columns = ['emailVerified', 'collaborator'];
      for (const col of columns) {
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "${col}" BOOLEAN DEFAULT FALSE;`);
          console.log(`Ensured column "${col}" exists.`);
        } catch (e) {
          console.error(`Failed to add column ${col}:`, e.message);
        }
      }
    }

    // Double check column existence
    const finalCols: any[] = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'session' AND table_schema = 'public'
    `;
    console.log('Current columns in public.session:', finalCols.map(c => c.column_name));

  } catch (error) {
    console.error('CRITICAL REPAIR ERROR:', error.message);
    if (error.message.includes('Timed out')) {
      console.log('RETRYING in 2 seconds...');
      await new Promise(r => setTimeout(r, 2000));
      return main();
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
