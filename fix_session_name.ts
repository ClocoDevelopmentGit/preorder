import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log('Current tables:', tables.map(t => t.table_name));
  
  for (const t of tables) {
    const name = t.table_name;
    if (name === 'Session') {
      console.log('Found "Session" (PascalCase). Renaming to "session" (lowercase)...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Session" RENAME TO "session";`);
      console.log('Renamed Session to session');
    }
  }

  const final: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log('Final tables:', final.map(t => t.table_name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
