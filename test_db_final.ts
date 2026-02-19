import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- DB Connectivity Test ---');
  try {
    console.log('Testing session table...');
    const sessionCount = await prisma.session.count();
    console.log('Session table accessible. Count:', sessionCount);
  } catch (e) {
    console.error('Session table error:', e.message);
  }
  
  try {
    console.log('Testing settings table...');
    const settingsCount = await prisma.settings.count();
    console.log('Settings table accessible. Count:', settingsCount);
  } catch (e) {
    console.error('Settings table error:', e.message);
  }

  try {
    console.log('Listing all tables in public schema...');
    const tables: any[] = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables:', tables.map(t => t.table_name));
  } catch (e) {
    console.error('QueryRaw error:', e.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
