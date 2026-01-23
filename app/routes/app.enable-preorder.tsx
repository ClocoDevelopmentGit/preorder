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

        // Enable inventory tracking and set to 0
        const response: any = await admin.graphql(
            `#graphql
        mutation enableInventoryTracking($id: ID!) {
          productVariantUpdate(input: { 
            id: $id, 
            inventoryManagement: SHOPIFY,
            inventoryPolicy: CONTINUE
          }) {
            productVariant {
              id
              title
              inventoryManagement
              inventoryPolicy
              inventoryQuantity
              product { title }
            }
            userErrors {
              field
              message
            }
          }
        }`,
            { variables: { id: gid } }
        );

        const resJson = await response.json();
        const result = resJson.data?.productVariantUpdate;

        if (result?.userErrors?.length > 0) {
            return { success: false, error: result.userErrors[0].message };
        }

        return {
            success: true,
            variant: result.productVariant,
            message: `Successfully enabled inventory tracking for ${result.productVariant.product.title} - ${result.productVariant.title}`
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
                                <p>Inventory Management: {actionData.variant?.inventoryManagement}</p>
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
