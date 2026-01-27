import {
    Page,
    Layout,
    Card,
    Box,
    Text,
    Button,
    Badge,
    Banner,
    Checkbox,
    IndexTable,
    Thumbnail,
    Icon,
    CalloutCard,
    Divider,
    BlockStack,
    InlineStack,
} from "@shopify/polaris";
import { SearchIcon, PlusIcon, SelectIcon, ImageIcon, InfoIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useSubmit, useNavigation, useNavigate, useActionData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const { id } = params;

    const product = await db.preorderProduct.findUnique({
        where: { id },
        include: { variants: true },
    });

    if (!product) {
        throw new Response("Not Found", { status: 404 });
    }

    return { product };
};

export const action = async ({ request, params }: any) => {
    const { session } = await authenticate.admin(request);
    const { id } = params;
    const formData = await request.formData();
    const actionType = formData.get("action");

    if (actionType === "toggle-status") {
        const currentStatus = formData.get("currentStatus");
        const newStatus = currentStatus === "Enabled" ? "Disabled" : "Enabled";
        await db.preorderProduct.update({
            where: { id },
            data: { status: newStatus },
        });
        return { status: "success", message: `Preorder ${newStatus.toLowerCase()} successfully` };
    }

    if (actionType === "delete") {
        await db.preorderProduct.delete({
            where: { id },
        });
        // We'll handle redirection in the component or via another action
        return { status: "deleted" };
    }

    if (actionType === "save") {
        const customSettings = formData.get("customSettings") === "true";

        await db.preorderProduct.update({
            where: { id },
            data: {
                customSettings,
                updatedAt: new Date(),
            },
        });
        return { status: "success", message: "Settings saved successfully" };
    }

    return { status: "error" };
};

export default function ProductDetail() {
    const { product } = useLoaderData<typeof loader>();
    const actionData = useActionData<any>();
    const navigate = useNavigate();
    const submit = useSubmit();
    const navigation = useNavigation();
    const [customSettings, setCustomSettings] = useState((product as any).customSettings || false);

    const isSubmitting = navigation.state === "submitting";
    const isDirty = customSettings !== (product as any).customSettings;

    const handleToggleStatus = useCallback(() => {
        submit(
            { action: "toggle-status", currentStatus: product.status },
            { method: "POST" }
        );
    }, [product.status, submit]);

    const handleDelete = useCallback(() => {
        if (confirm("Are you sure you want to delete this preorder product?")) {
            submit({ action: "delete" }, { method: "POST" });
        }
    }, [submit]);

    const handleSave = useCallback(() => {
        if (!isDirty) return;
        submit(
            { action: "save", customSettings: customSettings.toString() },
            { method: "POST" }
        );
    }, [customSettings, submit, isDirty]);

    useEffect(() => {
        setCustomSettings((product as any).customSettings || false);
    }, [product.customSettings]);

    useEffect(() => {
        if (actionData?.status === "success" && actionData?.message) {
            shopify.toast.show(actionData.message);
        } else if (actionData?.status === "deleted") {
            shopify.toast.show("Product deleted successfully");
            navigate("/app/products");
        }
    }, [actionData, navigate]);

    const resourceName = {
        singular: "product variant",
        plural: "product variants",
    };

    const variantRows = product.variants.map((variant: any, index: number) => (
        <IndexTable.Row id={variant.id} key={variant.id} position={index}>
            <IndexTable.Cell>
                <InlineStack gap="300" align="start" blockAlign="center">
                    <div style={{ border: "1px solid #dfe3e8", borderRadius: "4px", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon source={ImageIcon} tone="subdued" />
                    </div>
                    <Button variant="plain" url={`#`}>
                        {variant.title === "Default Title" ? "Default" : variant.title}
                    </Button>
                </InlineStack>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge tone={variant.status === "Enabled" ? "success" : "attention"}>
                    {variant.status}
                </Badge>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    const shopName = product.shop.replace(".myshopify.com", "");
    const productAdminId = product.productId.split("/").pop();

    return (
        <div style={{ paddingBottom: "4rem" }}>
            <Page
                backAction={{ content: "Products", onAction: () => navigate("/app/products") }}
                title={product.title}
                titleMetadata={
                    <Badge tone={product.status === "Enabled" ? "success" : "attention"}>
                        {`Preorder ${product.status}`}
                    </Badge>
                }
                actionGroups={[
                    {
                        title: "More actions",
                        actions: [
                            {
                                content: "View in Storefront",
                                onAction: () => window.open(`https://${product.shop}/products/${product.handle}`, "_blank"),
                            },
                            {
                                content: "Edit in Shopify",
                                onAction: () => window.open(`https://admin.shopify.com/store/${shopName}/products/${productAdminId}`, "_blank"),
                            },
                        ],
                    },
                ]}
            >
                <Layout>
                    {/* Left Side: Product Card */}
                    <Layout.Section variant="oneThird">
                        <Card>
                            <BlockStack gap="400">
                                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                    <Thumbnail
                                        source={product.image || ImageIcon}
                                        alt={product.title}
                                        size="large"
                                    />
                                </div>
                                <Text variant="bodyMd" fontWeight="bold" as="p">
                                    {product.title}
                                </Text>
                            </BlockStack>
                        </Card>
                    </Layout.Section>

                    {/* Right Side: Settings cards */}
                    <Layout.Section>
                        <BlockStack gap="500">
                            {/* Status Card */}
                            <Card >
                                <InlineStack align="space-between" blockAlign="start">
                                    <BlockStack gap="400">
                                        <Text variant="headingMd" as="h2">
                                            Status
                                        </Text>
                                        <Text as="p">
                                            Preorder status is <strong>{product.status.toLowerCase()}</strong>
                                        </Text>
                                    </BlockStack>
                                    <Button
                                        variant="primary"
                                        tone="critical"
                                        onClick={handleToggleStatus}
                                        loading={isSubmitting}
                                    >
                                        {product.status === "Enabled" ? "Disable" : "Enable"}
                                    </Button>
                                </InlineStack>
                                <Box paddingBlockStart="400">
                                    <Banner tone="info" icon={InfoIcon}>
                                        <p>
                                            This product is available for preorder. To disable, click the button to the right.
                                        </p>
                                    </Banner>
                                </Box>
                            </Card>

                            {/* Product Settings Card */}
                            <Card padding="0">
                                <div
                                    style={{
                                        backgroundColor: "#90caf9",
                                        borderRadius: "8px 8px 0 0",
                                        borderBottom: "1px solid #64b5f6",
                                        padding: "16px"
                                    }}
                                >
                                    <InlineStack gap="200" align="start" blockAlign="center">
                                        <div style={{ margin: "0px" }}>
                                            <Icon source={InfoIcon} tone="primary" />
                                        </div>
                                        <Text variant="headingMd" as="h2">
                                            Product Settings
                                        </Text>
                                    </InlineStack>
                                </div>
                                <Box padding="400">
                                    <BlockStack gap="400">
                                        <Text as="p">
                                            <Button variant="plain" url="#">Default settings</Button> are automatically enabled. To choose custom settings (such as Button Text and Badge details), please check the box below.
                                        </Text>
                                        <Checkbox
                                            label="Enable Custom Settings"
                                            checked={customSettings}
                                            onChange={(val) => setCustomSettings(val)}
                                        />
                                    </BlockStack>
                                </Box>
                            </Card>

                            {/* Product Variants Card */}
                            <Card>
                                <BlockStack gap="400">
                                    <Text variant="headingMd" as="h2">
                                        Product Variants
                                    </Text>
                                    <Text as="p">
                                        View the available variants for this product. Click on a variant to configure its preorder settings on the variant settings page.
                                    </Text>
                                    <IndexTable
                                        resourceName={resourceName}
                                        itemCount={product.variants.length}
                                        headings={[
                                            { title: "Product Variant" },
                                            { title: "Preorder Status" },
                                        ]}
                                        selectable={false}
                                    >
                                        {variantRows}
                                    </IndexTable>
                                </BlockStack>
                            </Card>

                            {/* Product Inventory Card */}
                            <Card>
                                <BlockStack gap="400">
                                    <Text variant="headingMd" as="h2">
                                        Product Inventory
                                    </Text>
                                    <Text as="p">
                                        If the product inventory/details are incorrect, click <Text as="span" fontWeight="bold">"Sync Products"</Text> below.
                                    </Text>
                                    <Box>
                                        <Button>Sync Products</Button>
                                    </Box>
                                    <IndexTable
                                        resourceName={{ singular: "inventory item", plural: "inventory items" }}
                                        itemCount={2}
                                        headings={[
                                            { title: "Products Location" },
                                            { title: "Inventory Tracking" },
                                            { title: "Inventory Quantity" },
                                            { title: "Oversell Status" },
                                        ]}
                                        selectable={false}
                                    >
                                        <IndexTable.Row id="preorder-now" position={0}>
                                            <IndexTable.Cell>In Pre-order Now</IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Badge tone="success">Enabled</Badge>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>0</IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Badge tone="warning">Enabled but Inactive on Some Variants</Badge>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                        <IndexTable.Row id="shopify" position={1}>
                                            <IndexTable.Cell>In Shopify</IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Badge tone="critical">Disabled</Badge>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>0</IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Badge tone="success">Enabled</Badge>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                    </IndexTable>
                                </BlockStack>
                            </Card>

                            {/* Footer Actions */}
                            <Divider />
                            <InlineStack align="space-between">
                                <Button variant="primary" tone="critical" onClick={handleDelete}>Delete Product</Button>
                                <Button variant="primary" onClick={handleSave} loading={isSubmitting} disabled={!isDirty || isSubmitting}>Save</Button>
                            </InlineStack>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    );
}
