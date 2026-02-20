import prisma from "./app/db.server";

async function main() {
    const shop = "clocoteststore.myshopify.com";
    const settings = await prisma.settings.findUnique({ where: { shop } });
    console.log("Settings for", shop, ":", JSON.stringify(settings, null, 2));
    
    const products = await prisma.preorderProduct.findMany({ where: { shop } });
    console.log("Products for", shop, ":", products.length);
    if (products.length > 0) {
        console.log("First product:", JSON.stringify(products[0], null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
