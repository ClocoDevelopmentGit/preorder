import { type ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId) {
        return new Response(JSON.stringify({ success: false, error: "Missing variantId" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Return success with cart add URL instead of draft order
    // This allows the preorder button to work like a normal add to cart
    return new Response(
        JSON.stringify({
            success: true,
            useCart: true,
            variantId: variantId,
            quantity: parseInt(quantity, 10) || 1,
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
};

// Handle GET for health check or direct URLs
export const loader = async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};
