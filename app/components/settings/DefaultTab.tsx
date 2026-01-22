import {
    InlineGrid,
    Box,
    BlockStack,
    Text,
    Card,
    Banner,
    Checkbox,
    Link,
    Button,
    InlineStack,
    TextField,
    Select,
} from "@shopify/polaris";

interface Props {
    settings: any;
    onChange: (key: string, value: any) => void;
}

export default function DefaultTab({ settings, onChange }: Props) {
    const handleChange = (key: string) => (value: any) => {
        onChange(key, value);
    };

    return (
        <>
            {/* First Box */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Preorders – All Products
                            </Text>
                        </BlockStack>
                    </Box>

                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">


                            <Text as="p" tone="subdued">
                                This setting will enable pre-order for all of your
                                products.
                            </Text>

                            <Checkbox
                                label="Enable Preorder for All Products"
                                checked={settings.enablePreorderAll}
                                onChange={handleChange("enablePreorderAll")}
                            />

                            <InlineStack align="start">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        onChange("forceSync", "true");
                                        setTimeout(() => {
                                            const saveBtn = document.querySelector('[data-save-bar-action="primary"]');
                                            if (saveBtn instanceof HTMLElement) saveBtn.click();
                                        }, 50);
                                    }}
                                >
                                    Sync Inventory Policy for All Products
                                </Button>
                            </InlineStack>
                            <Box paddingBlockStart="200">
                                <Text as="p" tone="subdued">
                                    This will ensure all products have "Continue selling when out of stock" enabled so preorders work at checkout.
                                </Text>
                            </Box>

                            <div style={{ marginTop: '20px', borderTop: '1px solid #dfe3e8', paddingTop: '20px' }}>
                                <BlockStack gap="200">
                                    <Text as="h3" variant="headingSm">Debug Variant</Text>
                                    <InlineStack gap="200" align="start">
                                        <div style={{ flexGrow: 1 }}>
                                            <TextField
                                                label="Enter Variant ID (to check/fix specifically)"
                                                value={settings.debugVariantId || ""}
                                                onChange={(val) => onChange("debugVariantId", val)}
                                                autoComplete="off"
                                                placeholder="e.g. 43695782789206"
                                            />
                                        </div>
                                        <div style={{ marginTop: '24px' }}>
                                            <Button
                                                onClick={() => {
                                                    onChange("forceSyncVariant", "true");
                                                    setTimeout(() => {
                                                        const saveBtn = document.querySelector('[data-save-bar-action="primary"]');
                                                        if (saveBtn instanceof HTMLElement) saveBtn.click();
                                                    }, 50);
                                                }}
                                                variant="secondary"
                                            >
                                                Check & Fix
                                            </Button>
                                        </div>
                                    </InlineStack>
                                    <Text as="p" tone="subdued">
                                        Use this if a specific product is still showing "Sold Out" at checkout.
                                    </Text>
                                </BlockStack>
                            </div>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Second Box */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Shopify Purchase Options
                            </Text>
                            <Text as="p" tone="subdued">
                                Manage your Shopify payments and app block integration.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <Banner tone="info">
                                <Text as="p">
                                    Enable Shopify purchase options if your store has
                                    Shopify Payments or PayPal payment gateway enabled. This
                                    requires your theme to be Online Store 2.0 compatible,
                                    and to add an app block to your product page. See{" "}
                                    <Link
                                        url="https://help.shopify.com/en/manual/payments/shopify-payments/managing-shopify-payments/settings-for-shopify-payments"
                                        external
                                    >
                                        how to add an app block
                                    </Link>{" "}
                                    for more details.
                                </Text>
                            </Banner>
                            <Text as="p" tone="subdued">
                                This setting will enable pre-order for all of your
                                products.
                            </Text>
                            <Checkbox
                                label="Enable Shopify Purchase Options"
                                checked={settings.enabled}
                                onChange={handleChange("enabled")}
                            />
                            <InlineStack align="start">
                                <Button
                                    url="https://help.shopify.com/en/manual/payments/shopify-payments/managing-shopify-payments/settings-for-shopify-payments"
                                    external
                                    variant="secondary"
                                >
                                    Sync Selling plan with settings
                                </Button>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    {/* LEFT SIDE */}
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Preorder Button
                            </Text>
                        </BlockStack>
                    </Box>

                    {/* RIGHT SIDE */}
                    <Box background="bg-surface" padding="400" borderRadius="300">
                        <BlockStack gap="400">
                            {/* Preview */}
                            <Card>
                                <Box
                                    background="bg-surface-disabled" // secondary background
                                    padding="600" // 600 token ≈ 3rem
                                    borderRadius="300"
                                >
                                    <InlineStack align="center">
                                        <BlockStack gap="200" align="center">
                                            <Text as="p" variant="headingSm">
                                                Preview
                                            </Text>
                                            {settings.messagePosition === "Above Button" && (
                                                <Text as="p" tone="subdued">
                                                    {settings.preorderMessage}
                                                </Text>
                                            )}
                                            <Button variant="primary">{settings.buttonLabel}</Button>
                                            {settings.messagePosition === "Below Button" && (
                                                <Text as="p" tone="subdued">
                                                    {settings.preorderMessage}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                </Box>
                            </Card>

                            {/* Form Fields */}
                            <BlockStack gap="200">
                                <TextField
                                    label="Button Label"
                                    value={settings.buttonLabel}
                                    onChange={handleChange("buttonLabel")}
                                    autoComplete="off"
                                />

                                <InlineGrid columns={2} gap="400">
                                    <TextField
                                        label="Preorder Message"
                                        value={settings.preorderMessage}
                                        onChange={handleChange("preorderMessage")}
                                        autoComplete="off"
                                    />

                                    <Select
                                        label="Message Position"
                                        options={["Below Button", "Above Button"]}
                                        value={settings.messagePosition}
                                        onChange={handleChange("messagePosition")}
                                    />
                                </InlineGrid>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </InlineGrid>
            </div>
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    {/* LEFT SIDE */}
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Product Image Badge
                            </Text>
                            <Text as="p" tone="subdued">
                                Badges are visual markers or labels displayed on the product images.
                            </Text>
                        </BlockStack>
                    </Box>

                    {/* RIGHT SIDE */}
                    <Box background="bg-surface" padding="400" borderRadius="300">
                        <BlockStack gap="400">
                            {/* Preview */}
                            <Card>
                                <Box
                                    background="bg-surface-disabled" // secondary background
                                    padding="600" // ≈ 3rem
                                    borderRadius="300"
                                >
                                    <InlineStack align="center">
                                        <BlockStack gap="200" align="center">
                                            <Text as="p" variant="headingSm">
                                                Example Badge Preview
                                            </Text>

                                            {settings.badgeEnabled ? (
                                                <div style={{ position: "relative", display: "inline-block" }}>
                                                    <div
                                                        style={{
                                                            position: "relative",
                                                            top: "8px",
                                                            left: "8px",
                                                        }}
                                                    >
                                                        <Button variant="primary">
                                                            {settings.badgeText}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Text as="p" tone="subdued" alignment="center">
                                                    Badge not appearing? This feature may need to be configured
                                                    to work with your theme. Contact support for assistance.
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                </Box>
                            </Card>

                            {/* Form Fields */}
                            <BlockStack gap="200">
                                <Checkbox
                                    label="Badge Enabled"
                                    checked={settings.badgeEnabled}
                                    onChange={handleChange("badgeEnabled")}
                                />

                                <InlineGrid columns={2} gap="400">
                                    <TextField
                                        label="Badge Text"
                                        value={settings.badgeText}
                                        onChange={handleChange("badgeText")}
                                        autoComplete="off"
                                    />

                                    <Select
                                        label="Badge Shape"
                                        options={["Ribbon", "Circle", "Square"]}
                                        value={settings.badgeShape}
                                        onChange={handleChange("badgeShape")}
                                    />
                                </InlineGrid>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </InlineGrid>
            </div>

            {/* Inventory Management */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Inventory Management
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <Banner tone="warning">
                                <Text as="p">
                                    Checking this box will allow PreOrder Now to remove an item from your Shopify inventory when a preorder is placed. This is recommended.
                                </Text>
                            </Banner>
                            <Checkbox
                                label="Enable Inventory Management"
                                checked={settings.inventoryManagement}
                                onChange={handleChange("inventoryManagement")}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Order Management */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Order Management
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <TextField
                                label="Shopify Tag to be Added to Orders Containing Preorder Products."
                                value={settings.orderTag}
                                onChange={handleChange("orderTag")}
                                autoComplete="off"
                            />
                            <Checkbox
                                label="Sync inventory using third party system (outside of Shopify)"
                                checked={settings.syncInventory}
                                onChange={handleChange("syncInventory")}
                            />
                            <Banner tone="info">
                                <Text as="p">
                                    Check this box if you use a system outside of Shopify to track product inventory to ensure your preorders are tagged.
                                </Text>
                            </Banner>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Buttons and Badges Visibility Settings */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Buttons and Badges Visibility Settings
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="600">
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">Product Pages</Text>
                                <Checkbox
                                    label='Hide "Buy Now" Button When Preorder is Active for the Selected Variant.'
                                    checked={settings.hideBuyNow}
                                    onChange={handleChange("hideBuyNow")}
                                />
                            </BlockStack>

                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">Collection Pages</Text>
                                <Checkbox
                                    label="Display Badges on Homepage and Collection Pages. [Paid Only]"
                                    checked={settings.badgesOnCollection}
                                    onChange={handleChange("badgesOnCollection")}
                                />
                                <Checkbox
                                    label="Only Show Badge on Product if Preorder is Active for all Variants. [Paid Only]"
                                    checked={settings.badgeOnProduct}
                                    onChange={handleChange("badgeOnProduct")}
                                />
                                <Checkbox
                                    label="Display Preorder Buttons on Homepage and Collection Pages. [Paid Only]"
                                    checked={settings.buttonsOnCollection}
                                    onChange={handleChange("buttonsOnCollection")}
                                />
                                <Text as="p" tone="subdued">
                                    Badge or button not appearing? This feature may not work with all themes. Please Contact support for free setup assistance.
                                </Text>
                            </BlockStack>

                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm">Product Quickviews</Text>
                                <Checkbox
                                    label="Quickview Support Enabled [Paid Only]"
                                    checked={settings.quickviewSupport}
                                    onChange={handleChange("quickviewSupport")}
                                />
                            </BlockStack>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Cart Settings */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Cart Settings
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <TextField
                                label="Cart Label Text"
                                value={settings.cartLabelText}
                                onChange={handleChange("cartLabelText")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Cart Label Key"
                                value={settings.cartLabelKey}
                                onChange={handleChange("cartLabelKey")}
                                autoComplete="off"
                            />
                            <Checkbox
                                label="Show Cart Additional Checkout Buttons"
                                checked={settings.showAdditionalButtons}
                                onChange={handleChange("showAdditionalButtons")}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Stock Warning */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Stock Warning
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <Banner tone="info">
                                <Text as="p">
                                    Applies to inventory management option 1 and specific preorder stock features. We recommend checking your store's add to cart and checkout functionality after enabling this feature.
                                </Text>
                            </Banner>
                            <Checkbox
                                label="Prevent Customers from Ordering More than the Preorder Stock Available"
                                checked={settings.preventOrdering}
                                onChange={handleChange("preventOrdering")}
                            />
                            <TextField
                                label="Insufficient Preorder Stock Remaining Message"
                                value={settings.insufficientStockMsg}
                                onChange={handleChange("insufficientStockMsg")}
                                multiline={2}
                                autoComplete="off"
                            />
                            <Text as="p" tone="subdued">
                                Variables: {"{{qty}}"}. {"{{qty}}"} will be replaced by your shopify stock or your pre-order stock limit depending on your inventory management settings.
                            </Text>
                            <Banner tone="info">
                                <Text as="p">
                                    Applies to inventory management option 2 and specific preorder stock features. We recommend checking your store's add to cart and checkout functionality after enabling this feature.
                                </Text>
                            </Banner>
                            <Checkbox
                                label="Notify Customers When Part of Their Order will be on Preorder"
                                checked={settings.notifyCustomers}
                                onChange={handleChange("notifyCustomers")}
                            />
                            <TextField
                                label="Part of Order will be on Preorder Message"
                                value={settings.partOrderMsg}
                                onChange={handleChange("partOrderMsg")}
                                multiline={2}
                                autoComplete="off"
                            />
                            <Text as="p" tone="subdued">
                                Variables:{"{{qty}}"}. {"{{qty}}"} will be replaced by your shopify stock.
                            </Text>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>

            {/* Mixed Cart Warning */}
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Mixed Cart Warning
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <Checkbox
                                label="Display a Pop-up Warning on the Cart Page When Shoppers Have Both Preorder and In-stock Items in the Same Cart."
                                checked={settings.mixedCartWarning}
                                onChange={handleChange("mixedCartWarning")}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>
            <div style={{ paddingTop: "24px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Discount
                            </Text>
                            <Text as="p" tone="subdued">
                                Choose a discount to apply to all of your preorder items.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <Select
                            label="Type of Discount"
                            options={["No Discount", "Fixed Amount", "Percentage"]}
                            value={settings.discountType}
                            onChange={handleChange("discountType")}
                        />
                    </Card>
                </InlineGrid>
            </div>

            {/* Preorder Scheduling Section */}
            <div style={{ paddingTop: "24px", paddingBottom: "50px" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box paddingInline={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingMd">
                                Preorder Scheduling
                            </Text>
                            <Text as="p" tone="subdued">
                                Schedule when preorders will be automatically turned on for all your products.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card background="bg-surface" padding="400">
                        <BlockStack gap="400">
                            <InlineGrid columns={2} gap="400">
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    value={settings.startDate}
                                    onChange={handleChange("startDate")}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    value={settings.startTime}
                                    onChange={handleChange("startTime")}
                                    autoComplete="off"
                                />
                            </InlineGrid>
                            <InlineGrid columns={2} gap="400">
                                <TextField
                                    label="End Date"
                                    type="date"
                                    value={settings.endDate}
                                    onChange={handleChange("endDate")}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="End Time"
                                    type="time"
                                    value={settings.endTime}
                                    onChange={handleChange("endTime")}
                                    autoComplete="off"
                                />
                            </InlineGrid>
                            <Text as="p" tone="subdued">
                                This setting acts as an automatic trigger to enable preorders for all products. If you'd like your customers to be able to preorder immediately, leave the start date blank or choose a date in the past.
                            </Text>
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>
        </>
    );
}