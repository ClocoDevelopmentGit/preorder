import {
  InlineGrid,
  Box,
  BlockStack,
  Text,
  Card,
  Banner,
  Checkbox,
  Link,
  Page,
  Tabs,
  Button,
  InlineStack,
  TextField,
  Select,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Preorder Now");
  const [preorderMessage, setPreorderMessage] = useState(
    "Your Preorder is available from 25th June",
  );
  const [messagePosition, setMessagePosition] = useState("Below Button");
  const [badgeEnabled, setBadgeEnabled] = useState(true);
  const [badgeText, setBadgeText] = useState("Preorder");
  const [badgeShape, setBadgeShape] = useState("Ribbon");

  // New State Variables
  const [inventoryManagement, setInventoryManagement] = useState(false);
  const [orderTag, setOrderTag] = useState("Pre-order");
  const [syncInventory, setSyncInventory] = useState(false);

  const [hideBuyNow, setHideBuyNow] = useState(false);
  const [badgesOnCollection, setBadgesOnCollection] = useState(false);
  const [badgeOnProduct, setBadgeOnProduct] = useState(false);
  const [buttonsOnCollection, setButtonsOnCollection] = useState(false);
  const [quickviewSupport, setQuickviewSupport] = useState(false);

  const [cartLabelText, setCartLabelText] = useState("Preorder Item");
  const [cartLabelKey, setCartLabelKey] = useState("PN-Note");
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

  const [preventOrdering, setPreventOrdering] = useState(false);
  const [insufficientStockMsg, setInsufficientStockMsg] = useState("Not enough stock. Only {{qty}} remaining.");
  const [notifyCustomers, setNotifyCustomers] = useState(false);
  const [partOrderMsg, setPartOrderMsg] = useState("Only {{qty}} unit(s) in stock. {{qty}} unit(s) will be filled now and the rest will be on pre-order.");
  const [mixedCartWarning, setMixedCartWarning] = useState(false);

  const [discountType, setDiscountType] = useState("No Discount");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [previewProduct, setPreviewProduct] = useState<any>(null);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    [],
  );
  useEffect(() => {
    // Replace /api/products with your app's endpoint that returns products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);

        // Pick a random product for preview
        if (data.products.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.products.length);
          setPreviewProduct(data.products[randomIndex]);
        }
      });
  }, []);

  const tabs = [
    {
      id: "default-settings",
      content: "Default",
      panelID: "default-settings-content",
    },
    {
      id: "advanced-settings",
      content: "Advanced",
      panelID: "advanced-settings-content",
    },
    {
      id: "email-settings",
      content: "Email",
      panelID: "email-settings-content",
    },
    {
      id: "style-settings",
      content: "Styles",
      panelID: "style-settings-content",
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
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
                    <Banner tone="info">
                      <Text as="p">
                        This feature is off while we work on a better way to
                        enable multiple products at once. For now, you can use
                        the Preorder Products page or ask our support team for
                        help.
                      </Text>
                    </Banner>

                    <Text as="p" tone="subdued">
                      This setting will enable pre-order for all of your
                      products.
                    </Text>

                    <Checkbox
                      label="Enable Preorder for All Products"
                      checked={false}
                      disabled
                    />
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
                      checked={enabled}
                      onChange={setEnabled}
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
                            {messagePosition === "Above Button" && (
                              <Text as="p" tone="subdued">
                                {preorderMessage}
                              </Text>
                            )}
                            <Button variant="primary">{buttonLabel}</Button>
                            {messagePosition === "Below Button" && (
                              <Text as="p" tone="subdued">
                                {preorderMessage}
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
                        value={buttonLabel}
                        onChange={setButtonLabel}
                        autoComplete="off" // ✅ updates preview
                      />

                      <InlineGrid columns={2} gap="400">
                        <TextField
                          label="Preorder Message"
                          value={preorderMessage}
                          onChange={setPreorderMessage}
                          autoComplete="off" // ✅ updates preview
                        />

                        <Select
                          label="Message Position"
                          options={["Below Button", "Above Button"]}
                          value={messagePosition}
                          onChange={setMessagePosition} // ✅ updates preview
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

                            {badgeEnabled ? (
                              <div style={{ position: "relative", display: "inline-block" }}>
                                {/* Product Image */}
                                {/* <img
      src={previewProduct.images[0]?.src || ""}
      alt={previewProduct.title}
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "12px",
        display: "block",
      }}
    /> */}
                                {/* Badge on top */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px",
                                  }}
                                >
                                  <Button variant="primary">
                                    {badgeText}
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
                        checked={badgeEnabled}
                        onChange={setBadgeEnabled}
                      />

                      <InlineGrid columns={2} gap="400">
                        <TextField
                          label="Badge Text"
                          value={badgeText}
                          onChange={setBadgeText}
                          autoComplete="off"
                        />

                        <Select
                          label="Badge Shape"
                          options={["Ribbon", "Circle", "Square"]}
                          value={badgeShape}
                          onChange={setBadgeShape}
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
                      checked={inventoryManagement}
                      onChange={setInventoryManagement}
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
                      value={orderTag}
                      onChange={setOrderTag}
                      autoComplete="off"
                    />
                    <Checkbox
                      label="Sync inventory using third party system (outside of Shopify)"
                      checked={syncInventory}
                      onChange={setSyncInventory}
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
                        checked={hideBuyNow}
                        onChange={setHideBuyNow}
                      />
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Collection Pages</Text>
                      <Checkbox
                        label="Display Badges on Homepage and Collection Pages. [Paid Only]"
                        checked={badgesOnCollection}
                        onChange={setBadgesOnCollection}
                      />
                      <Checkbox
                        label="Only Show Badge on Product if Preorder is Active for all Variants. [Paid Only]"
                        checked={badgeOnProduct}
                        onChange={setBadgeOnProduct}
                      />
                      <Checkbox
                        label="Display Preorder Buttons on Homepage and Collection Pages. [Paid Only]"
                        checked={buttonsOnCollection}
                        onChange={setButtonsOnCollection}
                      />
                      <Text as="p" tone="subdued">
                        Badge or button not appearing? This feature may not work with all themes. Please Contact support for free setup assistance.
                      </Text>
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Product Quickviews</Text>
                      <Checkbox
                        label="Quickview Support Enabled [Paid Only]"
                        checked={quickviewSupport}
                        onChange={setQuickviewSupport}
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
                      value={cartLabelText}
                      onChange={setCartLabelText}
                      autoComplete="off"
                    />
                    <TextField
                      label="Cart Label Key"
                      value={cartLabelKey}
                      onChange={setCartLabelKey}
                      autoComplete="off"
                    />
                    <Checkbox
                      label="Show Cart Additional Checkout Buttons"
                      checked={showAdditionalButtons}
                      onChange={setShowAdditionalButtons}
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
                      checked={preventOrdering}
                      onChange={setPreventOrdering}
                    />
                    <TextField
                      label="Insufficient Preorder Stock Remaining Message"
                      value={insufficientStockMsg}
                      onChange={setInsufficientStockMsg}
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
                      checked={notifyCustomers}
                      onChange={setNotifyCustomers}
                    />
                    <TextField
                      label="Part of Order will be on Preorder Message"
                      value={partOrderMsg}
                      onChange={setPartOrderMsg}
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
                      checked={mixedCartWarning}
                      onChange={setMixedCartWarning}
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
                    value={discountType}
                    onChange={setDiscountType}
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
                        value={startDate}
                        onChange={setStartDate}
                        autoComplete="off"
                      />
                      <TextField
                        label="Start Time"
                        type="time"
                        value={startTime}
                        onChange={setStartTime}
                        autoComplete="off"
                      />
                    </InlineGrid>
                    <InlineGrid columns={2} gap="400">
                      <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={setEndDate}
                        autoComplete="off"
                      />
                      <TextField
                        label="End Time"
                        type="time"
                        value={endTime}
                        onChange={setEndTime}
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

      case 1:
        return <Text as="p">Advanced settings content goes here</Text>;
      case 2:
        return <Text as="p">Email settings content goes here</Text>;
      case 3:
        return <Text as="p">Style settings content goes here</Text>;
      default:
        return null;
    }
  };
  return (
    <Page title="Settings">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
        {renderTabContent()}
      </Tabs>
    </Page>
  );
}
