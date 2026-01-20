import {
    Page,
    Card,
    Tabs,
    TextField,
    IndexTable,
    EmptyState,
    Box,
    Layout,
    Icon,
    Button,
    ButtonGroup,
    Text,
    Thumbnail,
    Badge,
} from "@shopify/polaris";
import { SearchIcon, PlusIcon, SelectIcon, ImageIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useSubmit, useNavigation, Link } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const products = await db.preorderProduct.findMany({
        where: { shop: session.shop },
        include: { variants: true },
        orderBy: { createdAt: "desc" },
    });
    return { products };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();
    const actionType = formData.get("action");

    if (actionType === "add-products") {
        const productsJson = formData.get("products") as string;
        const products = JSON.parse(productsJson);

        for (const product of products) {
            await db.preorderProduct.upsert({
                where: { productId: product.id },
                update: {
                    title: product.title,
                    handle: product.handle,
                    image: product.images?.[0]?.originalSrc || product.images?.[0]?.url,
                },
                create: {
                    shop: session.shop,
                    productId: product.id,
                    title: product.title,
                    handle: product.handle,
                    image: product.images?.[0]?.originalSrc || product.images?.[0]?.url,
                    variants: {
                        create: product.variants.map((v: any) => ({
                            variantId: v.id,
                            title: v.title,
                            price: v.price,
                            inventory: v.inventoryQuantity || 0,
                        })),
                    },
                },
            });
        }
        return { status: "success" };
    }

    return { status: "error" };
};

export default function ProductsPage() {
    const { products } = useLoaderData<typeof loader>();
    const submit = useSubmit();
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchValue, setSearchValue] = useState("");

    const isSubmitting = navigation.state === "submitting";

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
        [],
    );

    const handleSearchChange = useCallback(
        (value: string) => setSearchValue(value),
        [],
    );

    const tabs = [
        {
            id: "preorder-products",
            content: "Preorder Products",
            accessibilityLabel: "Preorder Products",
            panelID: "preorder-products-content",
        },
        {
            id: "preorder-tags",
            content: "Preorder Tags",
            panelID: "preorder-tags-content",
        },
    ];

    const selectProduct = useCallback(async () => {
        const selected = await window.shopify.resourcePicker({
            type: "product",
            multiple: true,
        });

        if (selected) {
            submit({
                action: "add-products",
                products: JSON.stringify(selected)
            }, { method: "POST" });
        }
    }, [submit]);

    const resourceName = {
        singular: "product",
        plural: "products",
    };

    const rowMarkup = products.map(
        ({ id, productId, title, image, status, variants }: any, index: number) => {
            const inventory = variants.reduce((acc: number, v: any) => acc + (v.inventory || 0), 0);
            const priceRange = variants.length > 0
                ? `$${Math.min(...variants.map((v: any) => parseFloat(v.price || "0"))).toFixed(2)}`
                : "N/A";

            return (
                <IndexTable.Row
                    id={id}
                    key={id}
                    position={index}
                >
                    <IndexTable.Cell>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Thumbnail
                                source={image || ImageIcon}
                                alt={title}
                                size="small"
                            />
                            <Link to={`/app/products/${id}`} style={{ textDecoration: "none", color: "#005bd3" }}>
                                <Text variant="bodyMd" fontWeight="bold" as="span">
                                    {title}
                                </Text>
                            </Link>
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Badge tone={status === "Enabled" ? "success" : "attention"}>
                            {status}
                        </Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text as="span" variant="bodyMd">
                            {inventory} available
                        </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text as="span" variant="bodyMd">
                            {priceRange}
                        </Text>
                    </IndexTable.Cell>
                </IndexTable.Row>
            );
        },
    );

    return (
        <div style={{ paddingBottom: "4rem" }}>
            <Page
                title="Preorders"
                primaryAction={{
                    content: "Add Product",
                    onAction: selectProduct,
                    loading: isSubmitting,
                }}
            >
                <Layout>
                    <Layout.Section>
                        <div style={{ marginBottom: "16px" }}>
                            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
                        </div>
                        <Card padding="0">
                            <Box padding="400">
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Search Products"
                                            labelHidden
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            prefix={<Icon source={SearchIcon} />}
                                            placeholder="Search Products"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Button icon={SelectIcon}>Search by Title</Button>
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                    <Button variant="tertiary" icon={PlusIcon}>Add filter</Button>
                                </div>
                            </Box>

                            {products.length > 0 ? (
                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={products.length}
                                    headings={[
                                        { title: "Product" },
                                        { title: "Preorder Status" },
                                        { title: "Available Inventory" },
                                        { title: "Price" },
                                    ]}
                                    selectable={false}
                                >
                                    {rowMarkup}
                                </IndexTable>
                            ) : (
                                <Box padding="1000">
                                    <EmptyState
                                        heading="No Preorder Products can be found with this search"
                                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                                    >
                                        <p>Try adjusting your text search</p>
                                    </EmptyState>
                                </Box>
                            )}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </div>
    );
}
