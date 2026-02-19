import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.settings.findMany();
  console.log('Settings:', JSON.stringify(settings, null, 2));
  const products = await prisma.preorderProduct.findMany({
    include: { variants: true }
  });
  console.log('Products:', JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
