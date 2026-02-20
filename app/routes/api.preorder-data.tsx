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
    console.log(`[API] Received request: ${request.url}`);
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const variantId = url.searchParams.get("variantId");

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-store",
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    if (!shop) {
        console.warn("[API] Missing shop parameter");
        return new Response(JSON.stringify({ success: false, error: "Missing shop" }), { status: 400, headers });
    }

    try {
        let admin: any = null;
        try {
            console.log(`[API] Authenticating app proxy for ${shop}`);
            const auth = await authenticate.public.appProxy(request);
            admin = auth.admin;
            console.log(`[API] App Proxy Auth successful. Admin status: ${!!admin}`);
        } catch (e) {
            console.warn("[API] App Proxy Auth failed or not present, continuing with public data only");
        }

        let variantInfo = null;
        if (variantId && admin) {
            try {
                console.log(`[API] Fetching real-time stock for variant: ${variantId}`);
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
                if (resData.errors) {
                    console.error("[API] GraphQL errors:", JSON.stringify(resData.errors));
                }
                const rawInfo = resData.data?.productVariant;
                if (rawInfo) {
                    variantInfo = {
                        id: rawInfo.id,
                        inventoryQuantity: rawInfo.inventoryQuantity,
                        inventoryPolicy: rawInfo.inventoryPolicy,
                        isOutOfStock: rawInfo.inventoryQuantity <= 0,
                        canPreorder: rawInfo.inventoryPolicy === "CONTINUE"
                    };
                }
            } catch (err) {
                console.error("[API] Real-time fetch failed:", err);
            }
        }

        console.log(`[API] Fetching settings for ${shop}`);
        const settings = await prisma.settings.findUnique({ where: { shop } });

        console.log(`[API] Fetching preorder products for ${shop}`);
        const rawProducts = await prisma.preorderProduct.findMany({
            where: { shop },
            include: { variants: true },
            orderBy: { createdAt: "desc" },
        });

        const defaults = {
            enabled: false,
            enablePreorderAll: false,
            buttonLabel: "Preorder Now",
            preorderMessage: "Preorder available",
            messagePosition: "Below Button",
            selectors: "{}",
        };

        const currentSettings = settings || defaults;
        const enablePreorderAll = (currentSettings as any).enablePreorderAll ?? false;

        let cleanedSelectors = currentSettings.selectors || "{}";
        try {
            let sObj = JSON.parse(cleanedSelectors);
            for (let key in sObj) {
                if (typeof sObj[key] === 'string') {
                    sObj[key] = sObj[key].replace(/:visible/g, '').replace(/:first/g, '').replace(/:eq\(\d+\)/g, '').replace(/:hidden/g, '').trim();
                }
            }
            cleanedSelectors = JSON.stringify(sObj);
        } catch (e) { }

        const responseData = {
            success: true,
            shop,
            variantInfo,
            settings: {
                ...currentSettings,
                enablePreorderAll,
                selectors: cleanedSelectors,
            },
            products: rawProducts.map(p => ({
                ...p,
                createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
                variants: p.variants.map(v => ({
                    ...v,
                    createdAt: v.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: v.updatedAt?.toISOString() || new Date().toISOString(),
                }))
            }))
        };

        console.log(`[API] Successfully returning data for ${shop}`);
        return new Response(JSON.stringify(responseData), { status: 200, headers });

    } catch (error: any) {
        console.error("[API] FATAL ERROR:", error);

        const safeDefaults = {
            success: false,
            error: "Internal Server Error",
            message: error?.message || "Unknown error",
            settings: { enabled: false, enablePreorderAll: false },
            products: []
        };

        return new Response(JSON.stringify(safeDefaults), { status: 200, headers });
    }
};
