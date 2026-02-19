import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('Connecting...');
  await prisma.$connect();
  console.log('Connected.');
  
  const tables = await prisma.$queryRaw`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_name = 'session' OR table_name = 'Session'
  `;
  console.log('Matching tables:', tables);
  
  const sessions = await prisma.session.findMany().catch(e => {
    console.log('Failed to query session table:', e.message);
    return [];
  });
  console.log('Session count:', sessions.length);
}

main()
  .catch(err => {
    console.error('FAILED:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
