import { Page, Card, Button, TextField, Banner } from "@shopify/polaris";
import { useState } from "react";
import { type ActionFunctionArgs } from "react-router";
import { useActionData, useSubmit, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const variantId = formData.get("variantId") as string;

    if (!variantId) {
        return { success: false, error: "Variant ID is required" };
    }

    try {
        const gid = variantId.includes("gid://")
            ? variantId
            : `gid://shopify/ProductVariant/${variantId}`;

        // 1. Fetch the Product ID from the Variant ID (required for productVariantsBulkUpdate)
        const variantResponse = await admin.graphql(
            `#graphql
            query getVariantProduct($id: ID!) {
              productVariant(id: $id) {
                product {
                  id
                }
              }
            }`,
            { variables: { id: gid } }
        );

        const variantData = await variantResponse.json();
        const productId = variantData.data?.productVariant?.product?.id;

        if (!productId) {
            return {
                success: false,
                error: "Product ID not found for this variant. Please check if the Variant ID is correct."
            };
        }

        // 2. Use productVariantsBulkUpdate (replaces deprecated productVariantUpdate)
        const response: any = await admin.graphql(
            `#graphql
            mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
              productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                productVariants {
                  id
                  title
                  inventoryPolicy
                  inventoryQuantity
                  inventoryItem {
                    tracked
                  }
                  product { title }
                }
                userErrors {
                  field
                  message
                }
              }
            }`,
            {
                variables: {
                    productId: productId,
                    variants: [{
                        id: gid,
                        inventoryPolicy: "CONTINUE",
                        inventoryItem: {
                            tracked: true
                        }
                    }]
                }
            }
        );

        const resJson = await response.json();
        const result = resJson.data?.productVariantsBulkUpdate;

        if (result?.userErrors?.length > 0) {
            return { success: false, error: result.userErrors[0].message };
        }

        const variant = result.productVariants[0];

        return {
            success: true,
            variant: variant,
            message: `Successfully enabled inventory tracking for ${variant.product.title} - ${variant.title}`
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export default function EnablePreorderPage() {
    const [variantId, setVariantId] = useState("43695782789206");
    const submit = useSubmit();
    const navigation = useNavigation();
    const actionData = useActionData<typeof action>();
    const isLoading = navigation.state === "submitting";

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("variantId", variantId);
        submit(formData, { method: "POST" });
    };

    return (
        <Page title="Enable Preorder for Product" backAction={{ url: "/app/settings" }}>
            <Card>
                <div style={{ padding: "20px" }}>
                    <TextField
                        label="Variant ID"
                        value={variantId}
                        onChange={setVariantId}
                        helpText="Enter the variant ID to enable preorder (inventory tracking will be enabled and set to allow preorders)"
                        autoComplete="off"
                    />

                    <div style={{ marginTop: "20px" }}>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            loading={isLoading}
                        >
                            Enable Inventory Tracking
                        </Button>
                    </div>

                    {actionData?.success && (
                        <div style={{ marginTop: "20px" }}>
                            <Banner tone="success">
                                <p>{actionData.message}</p>
                                <p>Inventory Tracking: {actionData.variant?.inventoryItem?.tracked ? "Enabled" : "Disabled"}</p>
                                <p>Inventory Policy: {actionData.variant?.inventoryPolicy}</p>
                                <p>Current Quantity: {actionData.variant?.inventoryQuantity}</p>
                            </Banner>
                        </div>
                    )}

                    {actionData?.error && (
                        <div style={{ marginTop: "20px" }}>
                            <Banner tone="critical">
                                <p>Error: {actionData.error}</p>
                            </Banner>
                        </div>
                    )}
                </div>
            </Card>
        </Page>
    );
}
