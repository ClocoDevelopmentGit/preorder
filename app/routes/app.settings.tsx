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
import { useState, useCallback, useEffect, Suspense, lazy } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = lazy(() => import("react-quill-new"));

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);



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
  const [shopTimezone, setShopTimezone] = useState("GMT-05:00");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectors, setSelectors] = useState({
    cartSubtotal: "",
    checkoutButton: "",
    formSelector: "form[action^='/cart/add']",
    buttonSelector: "form[action^='/cart/add']:first [type=submit]:visible",
    productPageImage: "div.product-single__photos:first,#slider-product-template",
    collectionPageGrid: "",
    variantSelector: "form[action^='/cart/add']:first select:visible, .radio",
    partialPreorderNotice: "",
    mutationIds: "",
    mutationClasses: "",
    lineItemOriginalPrice: "",
    lineItemTotalPrice: "",
    ajaxLineItemOriginalPrice: "",
    ajaxLineItemTotalPrice: "",
    ajaxCartItemKey: "",
    productPagePrice: "",
    notifyAlertButton: "",
    productLinkSelector: "a[href*='/products/']:visible",
    productLinkSelectorFilter: "img",
    productContainerHandle: "a[href*='products/{{handle}}']",
    productContainerHandleFilter: "img",
    productContainerHandleSecondFilter: "div, li, article, figure",
  });

  const handleSelectorChange = useCallback(
    (key: string, value: string) => {
      setSelectors((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );
  const [products, setProducts] = useState<any[]>([]);

  const [previewProduct, setPreviewProduct] = useState<any>(null);

  // Email Settings State
  const [monthlyChargeLimit, setMonthlyChargeLimit] = useState("");
  const [bccMe, setBccMe] = useState(false);
  const [bccEmail, setBccEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("A product you ordered is on pre-order");
  const [emailHeader, setEmailHeader] = useState("");
  const [emailLineItem, setEmailLineItem] = useState("");
  const [emailLineFooter, setEmailLineFooter] = useState("");
  const [senderEmail, setSenderEmail] = useState("no-reply-aws@amazon.com");

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

  if (!mounted) return null;

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
        return (
          <>
            {/* Time Zone Section */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Time Zone
                    </Text>
                  </BlockStack>
                </Box>

                <Card background="bg-surface" padding="400" borderRadius="300">
                  <BlockStack gap="400">
                    <Select
                      label="Shop Timezone"
                      options={[
                        { label: "(GMT-12:00) International Date Line West", value: "GMT-12:00" },
                        { label: "(GMT-11:00) Midway Island, Samoa", value: "GMT-11:00" },
                        { label: "(GMT-10:00) Hawaii", value: "GMT-10:00" },
                        { label: "(GMT-09:00) Alaska", value: "GMT-09:00" },
                        { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "GMT-08:00" },
                        { label: "(GMT-07:00) Mountain Time (US & Canada)", value: "GMT-07:00" },
                        { label: "(GMT-06:00) Central Time (US & Canada)", value: "GMT-06:00" },
                        { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "GMT-05:00" },
                        { label: "(GMT-04:00) Atlantic Time (Canada)", value: "GMT-04:00" },
                        { label: "(GMT-03:00) Buenos Aires, Georgetown", value: "GMT-03:00" },
                        { label: "(GMT-02:00) Mid-Atlantic", value: "GMT-02:00" },
                        { label: "(GMT-01:00) Azores, Cape Verde Islands", value: "GMT-01:00" },
                        { label: "(GMT+00:00) London, Dublin, Lisbon", value: "GMT+00:00" },
                        { label: "(GMT+01:00) Paris, Berlin, Amsterdam", value: "GMT+01:00" },
                        { label: "(GMT+02:00) Cairo, Athens, Istanbul", value: "GMT+02:00" },
                        { label: "(GMT+03:00) Moscow, Kuwait, Baghdad", value: "GMT+03:00" },
                        { label: "(GMT+04:00) Abu Dhabi, Muscat, Baku", value: "GMT+04:00" },
                        { label: "(GMT+05:00) Karachi, Tashkent", value: "GMT+05:00" },
                        { label: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: "GMT+05:30" },
                        { label: "(GMT+06:00) Almaty, Dhaka", value: "GMT+06:00" },
                        { label: "(GMT+07:00) Bangkok, Hanoi, Jakarta", value: "GMT+07:00" },
                        { label: "(GMT+08:00) Beijing, Singapore, Hong Kong", value: "GMT+08:00" },
                        { label: "(GMT+09:00) Tokyo, Seoul, Osaka", value: "GMT+09:00" },
                        { label: "(GMT+10:00) Sydney, Melbourne, Brisbane", value: "GMT+10:00" },
                        { label: "(GMT+11:00) Magadan, Solomon Islands", value: "GMT+11:00" },
                        { label: "(GMT+12:00) Auckland, Wellington, Fiji", value: "GMT+12:00" },
                      ]}
                      value={shopTimezone}
                      onChange={setShopTimezone}
                    />
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* Theme Section */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Theme
                    </Text>
                  </BlockStack>
                </Box>

                <Card background="bg-surface" padding="400" borderRadius="300">
                  <BlockStack gap="400">
                    <Select
                      label="Select Theme"
                      options={[
                        { label: "Default", value: "default" },
                        { label: "Dawn", value: "dawn" },
                        { label: "Craft", value: "craft" },
                        { label: "Sense", value: "sense" },
                        { label: "Refresh", value: "refresh" },
                        { label: "Colorblock", value: "colorblock" },
                        { label: "Studio", value: "studio" },
                        { label: "Ride", value: "ride" },
                        { label: "Taste", value: "taste" },
                        { label: "Publisher", value: "publisher" },
                        { label: "Crave", value: "crave" },
                        { label: "Origin", value: "origin" },
                      ]}
                      value={selectedTheme}
                      onChange={setSelectedTheme}
                    />
                    <Text as="p" tone="subdued">
                      Preferred theme not shown? Try "Default" or ask us to add your specific theme.
                    </Text>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* Selectors Section */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Selectors
                    </Text>
                  </BlockStack>
                </Box>

                <Card background="bg-surface" padding="400" borderRadius="300">
                  <BlockStack gap="500">
                    {/* Row 1: Cart Subtotal & Checkout Button */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Cart Subtotal Selector"
                        value={selectors.cartSubtotal}
                        onChange={(value) => handleSelectorChange("cartSubtotal", value)}
                        placeholder="Enter Cart Subtotal Selector"
                        autoComplete="off"
                      />
                      <TextField
                        label="Checkout Button Selector"
                        value={selectors.checkoutButton}
                        onChange={(value) => handleSelectorChange("checkoutButton", value)}
                        placeholder="Enter Checkout Button Selector"
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 2: Form & Button Selector */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Form Selector"
                        value={selectors.formSelector}
                        onChange={(value) => handleSelectorChange("formSelector", value)}
                        placeholder="form[action^='/cart/add']"
                        autoComplete="off"
                      />
                      <TextField
                        label="Button Selector"
                        value={selectors.buttonSelector}
                        onChange={(value) => handleSelectorChange("buttonSelector", value)}
                        placeholder="form[action^='/cart/add']:first [type=submit]:visib"
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 3: Product Page Image & Collection Page Grid */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Product Page Image Container Selector"
                        value={selectors.productPageImage}
                        onChange={(value) => handleSelectorChange("productPageImage", value)}
                        placeholder="div.product-single__photos:first,#slider-product-te"
                        autoComplete="off"
                      />
                      <TextField
                        label="Collection Page grid container selector"
                        value={selectors.collectionPageGrid}
                        onChange={(value) => handleSelectorChange("collectionPageGrid", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 4: Variant & Partial Preorder Notice */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Variant selector"
                        value={selectors.variantSelector}
                        onChange={(value) => handleSelectorChange("variantSelector", value)}
                        placeholder="form[action^='/cart/add']:first select:visible, .radio"
                        autoComplete="off"
                      />
                      <TextField
                        label="Partial preorder notice placement selector"
                        value={selectors.partialPreorderNotice}
                        onChange={(value) => handleSelectorChange("partialPreorderNotice", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 5: Mutation IDs & Classes */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Mutation IDs"
                        value={selectors.mutationIds}
                        onChange={(value) => handleSelectorChange("mutationIds", value)}
                        placeholder="Enter mutation IDs"
                        autoComplete="off"
                      />
                      <TextField
                        label="Mutation classes"
                        value={selectors.mutationClasses}
                        onChange={(value) => handleSelectorChange("mutationClasses", value)}
                        placeholder="Enter mutation classes"
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 6: Line Item Original & Total Price */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <BlockStack gap="100">
                        <TextField
                          label="Line item original price selector"
                          value={selectors.lineItemOriginalPrice}
                          onChange={(value) => handleSelectorChange("lineItemOriginalPrice", value)}
                          placeholder="Enter line item total price selector"
                          autoComplete="off"
                        />
                        <Text as="p" tone="subdued" variant="bodySm">
                          Variables: {"{{ item.price | money }}"}
                        </Text>
                      </BlockStack>
                      <BlockStack gap="100">
                        <TextField
                          label="Line item total price selector"
                          value={selectors.lineItemTotalPrice}
                          onChange={(value) => handleSelectorChange("lineItemTotalPrice", value)}
                          placeholder="Enter line item total price selector"
                          autoComplete="off"
                        />
                        <Text as="p" tone="subdued" variant="bodySm">
                          Variables: {"{{ item.price | money }}"}
                        </Text>
                      </BlockStack>
                    </InlineGrid>

                    {/* Row 7: Ajax Line Item Original & Total Price */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Ajax line item original price selector"
                        value={selectors.ajaxLineItemOriginalPrice}
                        onChange={(value) => handleSelectorChange("ajaxLineItemOriginalPrice", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                      <TextField
                        label="Ajax line item total price selector"
                        value={selectors.ajaxLineItemTotalPrice}
                        onChange={(value) => handleSelectorChange("ajaxLineItemTotalPrice", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 8: Ajax Cart Item Key & Product Page Price */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Ajax cart item key variable name"
                        value={selectors.ajaxCartItemKey}
                        onChange={(value) => handleSelectorChange("ajaxCartItemKey", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                      <TextField
                        label="Product page price selector"
                        value={selectors.productPagePrice}
                        onChange={(value) => handleSelectorChange("productPagePrice", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 9: Notify Alert Button (single) */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Notify alert button selector"
                        value={selectors.notifyAlertButton}
                        onChange={(value) => handleSelectorChange("notifyAlertButton", value)}
                        placeholder="..."
                        autoComplete="off"
                      />
                      <div></div>
                    </InlineGrid>

                    {/* Row 10: Product Link Selector & Filter */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Product link selector"
                        value={selectors.productLinkSelector}
                        onChange={(value) => handleSelectorChange("productLinkSelector", value)}
                        placeholder="a[href*='/products/']:visible"
                        autoComplete="off"
                      />
                      <TextField
                        label="Product link selector filter"
                        value={selectors.productLinkSelectorFilter}
                        onChange={(value) => handleSelectorChange("productLinkSelectorFilter", value)}
                        placeholder="img"
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 11: Product Container Handle Element */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Product container handle element selector"
                        value={selectors.productContainerHandle}
                        onChange={(value) => handleSelectorChange("productContainerHandle", value)}
                        placeholder="a[href*='products/{{handle}}']"
                        autoComplete="off"
                      />
                      <TextField
                        label="Product container handle element selector Filter"
                        value={selectors.productContainerHandleFilter}
                        onChange={(value) => handleSelectorChange("productContainerHandleFilter", value)}
                        placeholder="img"
                        autoComplete="off"
                      />
                    </InlineGrid>

                    {/* Row 12: Product Container Handle Second Filter (single) */}
                    <InlineGrid columns={{ xs: "1fr", md: "1fr 1fr" }} gap="400">
                      <TextField
                        label="Product Container Handle Element Selector Second Filter"
                        value={selectors.productContainerHandleSecondFilter}
                        onChange={(value) => handleSelectorChange("productContainerHandleSecondFilter", value)}
                        placeholder="div, li, article, figure"
                        autoComplete="off"
                      />
                      <div></div>
                    </InlineGrid>

                    {/* Collection Page Selectors Header */}
                    <Text as="h3" variant="headingSm" fontWeight="bold">
                      Collection page selectors
                    </Text>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* jQuery Section */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      jQuery
                    </Text>
                  </BlockStack>
                </Box>

                <Card background="bg-surface" padding="400" borderRadius="300">
                  <BlockStack gap="400">
                    <Banner tone="warning">
                      <Text as="p">
                        This can sometimes resolve theme issue on mobile versions of Safari but may cause issues if your theme's version of jQuery is very out of date.
                      </Text>
                    </Banner>
                    <Checkbox
                      label="Force Preorder Now to Never Load its Own Copy of jQuery"
                      checked={false}
                      onChange={() => { }}
                    />
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* Google Analytics Section */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Google Analytics
                    </Text>
                  </BlockStack>
                </Box>

                <Card background="bg-surface" padding="400" borderRadius="300">
                  <BlockStack gap="400">
                    <Banner tone="info" title="Google Analytics">
                      <Text as="p">
                        If your store has Google Analytics installed, clicks on your store's pre-order button will automatically appear in the Behavior -{">"} Events section of your Google Analytics as shown below. No setup is needed.
                      </Text>
                    </Banner>
                    <Box>
                      <img
                        src="https://app.preordernowapp.com/google_analytics1.7a0d71ba.jpg"
                        alt="Google Analytics Events Screenshot"
                        style={{ width: "100%", borderRadius: "8px", border: "1px solid #e1e3e5" }}
                      />
                    </Box>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Status and Plan */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Status and Plan
                    </Text>
                  </BlockStack>
                </Box>
                <Card background="bg-surface" padding="400">
                  <BlockStack gap="400">
                    <InlineStack align="space-between">
                      <Text as="p" fontWeight="bold">Email notifications are disabled</Text>
                      <Button>Enable</Button>
                    </InlineStack>

                    <Box paddingBlockStart="400">
                      <Text as="h3" variant="headingSm">Monthly Charge Limit for Email Alerts</Text>
                    </Box>
                    <Select
                      label="Select a Value"
                      options={[
                        { label: "Select a Value", value: "" },
                        { label: "$1 for 100 emails", value: "1" },
                        { label: "$5 for 500 emails", value: "2" },
                        { label: "$10 for 1000 emails", value: "3" },
                        { label: "$25 for 2500 emails", value: "4" },
                        { label: "$50 for 5000 emails", value: "5" },
                        { label: "$100 for 10000 emails", value: "6" },
                        { label: "$200 for 20000 emails", value: "7" },
                        { label: "$500 for 50000 emails", value: "8" },
                      ]}
                      value={monthlyChargeLimit}
                      onChange={setMonthlyChargeLimit}
                    />
                    <Checkbox
                      label="BCC Me on Preorder Confirmation Emails"
                      checked={bccMe}
                      onChange={setBccMe}
                    />
                    <TextField
                      label="Enter BCC Email"
                      value={bccEmail}
                      onChange={setBccEmail}
                      autoComplete="off"
                      helpText="Default BCC email is shop email address"
                    />
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* Preorder email template */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Preorder email template
                    </Text>
                  </BlockStack>
                </Box>
                <Card background="bg-surface" padding="400">
                  <BlockStack gap="400">
                    <Banner tone="info">
                      <Text as="p">
                        We highly recommend updating the copy of your email template to better match your brand voice.
                      </Text>
                    </Banner>
                    <TextField
                      label="Email Subject Line"
                      value={emailSubject}
                      onChange={setEmailSubject}
                      autoComplete="off"
                      helpText="Variables: {{customer_first_name}}, {{customer_last_name}}, {{order_number}}"
                    />

                    <BlockStack gap="200">
                      <Text as="p" variant="bodyMd">Email Header</Text>
                      <Suspense fallback={<Box minHeight="100px" />}>
                        <ReactQuill
                          theme="snow"
                          value={emailHeader}
                          onChange={setEmailHeader}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'link'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['clean']
                            ],
                          }}
                        />
                      </Suspense>
                      <Text as="p" tone="subdued">Variables: {"{{customer_first_name}}"}, {"{{customer_last_name}}"}, {"{{order_number}}"}</Text>
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text as="p" variant="bodyMd">Line item</Text>
                      <Suspense fallback={<Box minHeight="100px" />}>
                        <ReactQuill
                          theme="snow"
                          value={emailLineItem}
                          onChange={setEmailLineItem}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'link'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['clean']
                            ],
                          }}
                        />
                      </Suspense>
                      <Text as="p" tone="subdued">Variables: {"{{product_title}}"}, {"{{variant_name}}"}, {"{{quantity}}"}, {"{{price}}"}, {"{{sku}}"}, {"{{preorder_description}}"}, {"{{order_number}}"}</Text>
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text as="p" variant="bodyMd">Line footer</Text>
                      <Suspense fallback={<Box minHeight="100px" />}>
                        <ReactQuill
                          theme="snow"
                          value={emailLineFooter}
                          onChange={setEmailLineFooter}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'link'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['clean']
                            ],
                          }}
                        />
                      </Suspense>
                      <Text as="p" tone="subdued">Variables: {"{{customer_first_name}}"}, {"{{customer_last_name}}"}, {"{{order_number}}"}</Text>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>

            {/* Sender email address */}
            <div style={{ paddingTop: "24px" }}>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                <Box paddingInline={{ xs: "400", sm: "0" }}>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Sender email address
                    </Text>
                  </BlockStack>
                </Box>
                <Card background="bg-surface" padding="400">
                  <BlockStack gap="400">
                    <Text as="p">
                      To proceed, please enter your sender email address and click "Verify." You will receive an email to that address with a verification link to click.
                    </Text>
                    <Banner tone="info">
                      <Text as="p">
                        The verification email will be sent from no-reply-aws@amazon.com.
                      </Text>
                    </Banner>
                    <TextField
                      label="Sender email address"
                      value={senderEmail}
                      onChange={setSenderEmail}
                      placeholder="Enter Email Address to Change"
                      autoComplete="off"
                    />
                    <InlineStack align="start">
                      <Button>Verify</Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </div>
          </>
        );
      case 3:
        return (
          <div style={{ paddingTop: "24px" }}>
            <Banner tone="info" title="More style options coming soon!">
              <Text as="p">
                We're working on adding more style options. For now, you can adjust preorder message and badge styles in{" "}
                <Link url="/app/settings" onClick={() => setSelectedTab(0)}>
                  Default Settings
                </Link>{" "}
                or the Product Variant page. Need custom styling?{" "}
                <Link url="mailto:support@preordernow.com">Contact us</Link>
                —we'll do it for free!
              </Text>
            </Banner>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div style={{ paddingBottom: "4rem" }}>
      <Page title="Settings">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {renderTabContent()}
        </Tabs>
      </Page>
    </div>
  );
}
