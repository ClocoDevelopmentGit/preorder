import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const columns: any[] = await prisma.$queryRaw`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'session'
  `;
  console.log('Columns in session table:');
  columns.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
