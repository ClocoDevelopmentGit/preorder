import prisma from "./app/db.server.js";

async function main() {
  const shop = "clocoteststore.myshopify.com";
  console.log(`Checking settings for ${shop}...`);
  
  const settings = await prisma.settings.upsert({
    where: { shop },
    update: { 
      enabled: true, 
      enablePreorderAll: true,
      buttonLabel: "Preorder Now",
      preorderMessage: "Ships within 2-3 weeks"
    },
    create: { 
      shop, 
      enabled: true, 
      enablePreorderAll: true,
      buttonLabel: "Preorder Now",
      preorderMessage: "Ships within 2-3 weeks"
    }
  });

  console.log("Updated Settings:", settings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
