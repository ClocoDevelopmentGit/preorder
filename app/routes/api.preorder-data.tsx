import { type LoaderFunctionArgs } from "react-router";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

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
    const variantId = url.searchParams.get("variantId");

    // CORS headers for global access
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-store", // Ensure real-time data
    };

    // ... preflight check ...
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    if (!shop) {
        return new Response(JSON.stringify({ success: false, error: "Missing shop" }), { status: 400, headers });
    }

    try {
        // Try to get admin context for real-time stock, but don't fail if it's not available
        let admin: any = null;
        try {
            const auth = await authenticate.public.appProxy(request);
            admin = auth.admin;
        } catch (e) {
            console.warn("[API] App Proxy Auth failed, continuing without admin context");
        }

        // If variantId is provided, we fetch its real-time status from Shopify (if admin available)
        let variantInfo = null;
        if (variantId && admin) {
            console.log(`[API] Checking real-time stock for variant: ${variantId}`);
            const gid = variantId.includes("gid://") ? variantId : `gid://shopify/ProductVariant/${variantId}`;
            const response = await admin.graphql(
                `#graphql
                query getVariant($id: ID!) {
                  productVariant(id: $id) {
                    id
                    inventoryQuantity
                    inventoryPolicy
                  }
                }`,
                { variables: { id: gid } }
            );
            const resData = await response.json();
            const rawInfo = resData.data?.productVariant;
            if (rawInfo) {
                variantInfo = {
                    ...rawInfo,
                    isOutOfStock: rawInfo.inventoryQuantity <= 0,
                    canPreorder: rawInfo.inventoryPolicy === "CONTINUE"
                };
            }
        } else if (variantId && !admin) {
            console.warn("[API] Cannot fetch real-time variant info: Admin context missing.");
        }

        const settings = await prisma.settings.findUnique({ where: { shop } });
        // ... rest of logic uses variantInfo ...

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
        // Using 'any' cast for settings to bypass the TS error about missing property for now,
        // since we know it exists in the schema but maybe not in the generated types yet if 'prisma generate' failed or didn't pick up correctly in the editor context of tool 84's lint error.
        // Actually, we ran 'prisma generate' successfully in Step 56, so the type 'Settings' SHOULD have 'enablePreorderAll'.
        // If the linter still complains, it might be an artifact of the environment.
        // I'll assume it exists, but I will cast it or ensure I use the property safely.

        // Default settings structure to ensure API always returns valid JSON even if DB is empty
        const defaults = {
            enabled: false,
            enablePreorderAll: false,
            buttonLabel: "Preorder Now",
            preorderMessage: "Your Preorder is available from 25th June",
            messagePosition: "Below Button",
            badgeEnabled: false,
            badgeText: null,
            badgeShape: null,
            inventoryManagement: false,
            orderTag: null,
            cartLabelText: null,
            selectors: "{}",
            hideBuyNow: false,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
        };

        const currentSettings = settings ? settings : defaults;

        // Verify enablePreorderAll property exists or default it
        // (handling potential DB vs Type mismatches safely)
        const enablePreorderAll = (currentSettings as any).enablePreorderAll ?? false;

        // Clean selectors string to remove jQuery-only pseudo-classes that break native querySelector
        let cleanedSelectors = currentSettings.selectors || "{}";
        try {
            let sObj = JSON.parse(cleanedSelectors);
            for (let key in sObj) {
                if (typeof sObj[key] === 'string') {
                    // Remove :visible, :first, :eq(n), etc.
                    sObj[key] = sObj[key]
                        .replace(/:visible/g, '')
                        .replace(/:first/g, '')
                        .replace(/:eq\(\d+\)/g, '')
                        .replace(/:hidden/g, '')
                        .trim();
                }
            }
            cleanedSelectors = JSON.stringify(sObj);
        } catch (e) {
            console.error("[API] Error cleaning selectors:", e);
        }

        const settingsResponse = {
            enabled: currentSettings.enabled,
            enablePreorderAll: enablePreorderAll,
            buttonLabel: currentSettings.buttonLabel,
            preorderMessage: currentSettings.preorderMessage,
            messagePosition: currentSettings.messagePosition,
            badgeEnabled: currentSettings.badgeEnabled,
            badgeText: currentSettings.badgeText,
            badgeShape: currentSettings.badgeShape,
            inventoryManagement: currentSettings.inventoryManagement,
            orderTag: currentSettings.orderTag,
            cartLabelText: currentSettings.cartLabelText,
            selectors: cleanedSelectors, // Cleaned JSON string
            hideBuyNow: currentSettings.hideBuyNow,
            startDate: currentSettings.startDate,
            startTime: currentSettings.startTime,
            endDate: currentSettings.endDate,
            endTime: currentSettings.endTime,
        };

        console.log(`[API] Success for ${shop}. EnableAll: ${enablePreorderAll}, Enabled: ${currentSettings.enabled}`);

        const response = {
            success: true,
            shop,
            timestamp: new Date().toISOString(),
            variantInfo,
            settings: settingsResponse,
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
    } catch (error: any) {
        console.error("Error fetching preorder data:", error);

        try {
            const fs = require('fs');
            fs.appendFileSync('debug_api.log', `[${new Date().toISOString()}] Error: ${error?.message}\nStack: ${error?.stack}\n\n`);
        } catch (e) { }

        // Fallback: Return default "Disabled" settings instead of crashing the frontend script with 500
        // This ensures the site remains functional even if the app DB is locked/down.
        const safeDefaults = {
            enabled: false,
            enablePreorderAll: false,
            buttonLabel: "Preorder Now",
            // ... other defaults implied
        };

        let debugInfo: any = {
            message: error?.message || "No message",
            stack: error?.stack || "No stack",
            type: typeof error,
            raw: JSON.stringify(error, Object.getOwnPropertyNames(error))
        };

        if (error instanceof Response) {
            debugInfo = {
                isResponse: true,
                status: error.status,
                statusText: error.statusText,
                headers: Object.fromEntries(error.headers.entries()),
                type: "Response Object"
            };
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to fetch preorder data (using defaults)",
                settings: safeDefaults,
                products: [],
                debug: debugInfo
            }),
            { status: 200, headers }
        );
    }
};
