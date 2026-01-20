import { type LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

/**
 * Public JSON API endpoint to get preorder data from the database.
 * 
 * URL: /api/preorder-data
 * 
 * Query Parameters:
 *   - shop: (required) The shop domain, e.g., "my-store.myshopify.com"
 *   - productId: (optional) Filter by specific product GID
 * 
 * Example Usage:
 *   - Get all preorder products for a shop:
 *     GET /api/preorder-data?shop=my-store.myshopify.com
 * 
 *   - Get a specific product's preorder data:
 *     GET /api/preorder-data?shop=my-store.myshopify.com&productId=gid://shopify/Product/123456
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");

    // CORS headers for global access
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=60", // Cache for 60 seconds
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    // Validate shop parameter
    if (!shop) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Missing required parameter: shop",
                example: "/api/preorder-data?shop=my-store.myshopify.com",
            }),
            { status: 400, headers }
        );
    }

    try {
        // Fetch settings for the shop
        const settings = await prisma.settings.findUnique({
            where: { shop },
        });

        // Build query for preorder products
        const productQuery: { shop: string; productId?: string } = { shop };
        if (productId) {
            productQuery.productId = productId;
        }

        // Fetch preorder products with their variants
        const products = await prisma.preorderProduct.findMany({
            where: productQuery,
            include: {
                variants: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // Shape the response
        const response = {
            success: true,
            shop,
            timestamp: new Date().toISOString(),
            settings: settings
                ? {
                    enabled: settings.enabled,
                    buttonLabel: settings.buttonLabel,
                    preorderMessage: settings.preorderMessage,
                    messagePosition: settings.messagePosition,
                    badgeEnabled: settings.badgeEnabled,
                    badgeText: settings.badgeText,
                    badgeShape: settings.badgeShape,
                    inventoryManagement: settings.inventoryManagement,
                    orderTag: settings.orderTag,
                    cartLabelText: settings.cartLabelText,
                    hideBuyNow: settings.hideBuyNow,
                    startDate: settings.startDate,
                    startTime: settings.startTime,
                    endDate: settings.endDate,
                    endTime: settings.endTime,
                }
                : null,
            products: products.map((product) => ({
                id: product.id,
                productId: product.productId,
                title: product.title,
                handle: product.handle,
                image: product.image,
                status: product.status,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
                variants: product.variants.map((variant) => ({
                    id: variant.id,
                    variantId: variant.variantId,
                    title: variant.title,
                    price: variant.price,
                    inventory: variant.inventory,
                    status: variant.status,
                })),
            })),
            totalProducts: products.length,
        };

        return new Response(JSON.stringify(response, null, 2), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error fetching preorder data:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to fetch preorder data",
                message: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500, headers }
        );
    }
};
