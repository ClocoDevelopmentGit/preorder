import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Renaming tables to lowercase...');
  
  const tables = ['Session', 'Settings', 'PreorderProduct', 'PreorderVariant'];
  
  for (const table of tables) {
    try {
      const lower = table.toLowerCase();
      // Use snake_case for multi-word tables to match common Postgres patterns if desired, 
      // but the schema @@map used "preorder_products" and "preorder_variants".
      let target = lower;
      if (table === 'PreorderProduct') target = 'preorder_products';
      if (table === 'PreorderVariant') target = 'preorder_variants';

      console.log(`Renaming ${table} to ${target}...`);
      await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "${table}" RENAME TO "${target}";`);
      console.log(`Successfully renamed ${table} to ${target}`);
    } catch (e) {
      console.error(`Failed to rename ${table}:`, e.message);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
