import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing columns to session table...');
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT FALSE;`);
    console.log('Added emailVerified');
  } catch (e) {
    console.error('Failed to add emailVerified:', e.message);
  }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "collaborator" BOOLEAN DEFAULT FALSE;`);
    console.log('Added collaborator');
  } catch (e) {
    console.error('Failed to add collaborator:', e.message);
  }
  
  console.log('Verifying session table structure...');
  const cols: any[] = await prisma.$queryRaw`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'session'
  `;
  console.log('Columns in session table:', cols.map(c => c.column_name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
