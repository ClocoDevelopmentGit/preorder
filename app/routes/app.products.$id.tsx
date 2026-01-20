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
import { useCallback, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ImageIcon, InfoIcon, AlertIcon, CheckIcon } from "@shopify/polaris-icons";
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

export default function ProductDetail() {
    const { product } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [customSettings, setCustomSettings] = useState(false);

    const resourceName = {
        singular: "product variant",
        plural: "product variants",
    };

    const variantRows = product.variants.map((variant: any, index: number) => (
        <IndexTable.Row id={variant.id} key={variant.id} position={index}>
            <IndexTable.Cell>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Thumbnail source={ImageIcon} alt={variant.title} size="small" />
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {variant.title === "Default Title" ? "Default" : variant.title}
                    </Text>
                </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge tone={variant.status === "Enabled" ? "success" : "attention"}>
                    {variant.status}
                </Badge>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <Page
            backAction={{ content: "Products", onAction: () => navigate("/app/products") }}
            title={product.title}
            titleMetadata={
                <Badge tone={product.status === "Enabled" ? "success" : "attention"}>
                    Preorder {product.status}
                </Badge>
            }
            secondaryActions={[
                {
                    content: "More actions",
                    disclosure: true,
                },
            ]}
        >
            <Layout>
                {/* Left Side: Product Card */}
                <Layout.Section variant="oneThird">
                    <Card>
                        <BlockStack gap="400">
                            <Thumbnail
                                source={product.image || ImageIcon}
                                alt={product.title}
                                size="large"
                            />
                            <Text variant="headingMd" as="h2">
                                {product.title}
                            </Text>
                        </BlockStack>
                    </Card>
                </Layout.Section>

                {/* Right Side: Settings cards */}
                <Layout.Section>
                    <BlockStack gap="500">
                        {/* Status Card */}
                        <Card>
                            <InlineStack align="space-between">
                                <BlockStack gap="200">
                                    <Text variant="headingMd" as="h2">
                                        Status
                                    </Text>
                                    <Text as="p">
                                        Preorder status is <strong>{product.status.toLowerCase()}</strong>
                                    </Text>
                                </BlockStack>
                                <Button variant="primary" tone="critical">
                                    {product.status === "Enabled" ? "Disable" : "Enable"}
                                </Button>
                            </InlineStack>
                            <Box marginTop="400">
                                <Banner tone="info" icon={InfoIcon}>
                                    <p>
                                        This product is available for preorder. To disable, click the button to the right.
                                    </p>
                                </Banner>
                            </Box>
                        </Card>

                        {/* Product Settings Card */}
                        <Card>
                            <Box
                                padding="400"
                                style={{
                                    backgroundColor: "#e1f5fe",
                                    margin: "-20px -20px 20px -20px",
                                    borderRadius: "8px 8px 0 0",
                                    borderBottom: "1px solid #b3e5fc"
                                }}
                            >
                                <InlineStack gap="200" align="start">
                                    <Icon source={InfoIcon} tone="primary" />
                                    <Text variant="headingMd" as="h2">
                                        Product Settings
                                    </Text>
                                </InlineStack>
                            </Box>
                            <BlockStack gap="400">
                                <Text as="p">
                                    <Text as="span" variant="bodyMd" fontWeight="bold">Default settings</Text> are automatically enabled. To choose custom settings (such as Button Text and Badge details), please check the box below.
                                </Text>
                                <Checkbox
                                    label="Enable Custom Settings"
                                    checked={customSettings}
                                    onChange={(val) => setCustomSettings(val)}
                                />
                            </BlockStack>
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
                                    If the product inventory/details are incorrect, click "Sync Products" below.
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
                            <Button variant="primary" tone="critical">Delete Product</Button>
                            <Button variant="primary">Save</Button>
                        </InlineStack>
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
