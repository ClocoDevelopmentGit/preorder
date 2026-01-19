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
import { useState, useCallback } from "react";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Preorder Now");
  const [preorderMessage, setPreorderMessage] = useState(
    "Your Preorder is available from 25th June"
  );
  const [messagePosition, setMessagePosition] = useState("Below Button");
  const [shopTimezone, setShopTimezone] = useState("GMT-05:00");
  const [selectedTheme, setSelectedTheme] = useState("default");

  // Selectors state
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

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    [],
  );

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

                <Card background="bg-surface" padding="400" borderRadius="300">
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
                <Card background="bg-surface" padding="400" borderRadius="300">
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
                        padding="600"                  // 600 token ≈ 3rem
                        borderRadius="300"
                      >
                        <InlineStack align="center">
                          <BlockStack gap="200" align="center">
                            <Text as="p" variant="headingSm">Preview</Text>
                            {messagePosition === "Above Button" && (
                              <Text as="p" tone="subdued">{preorderMessage}</Text>
                            )}
                            <Button variant="primary">{buttonLabel}</Button>
                            {messagePosition === "Below Button" && (
                              <Text as="p" tone="subdued">{preorderMessage}</Text>
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

                      <TextField
                        label="Preorder Message"
                        value={preorderMessage}
                        multiline={3}
                        onChange={setPreorderMessage}
                        autoComplete="off" // ✅ updates preview
                      />

                      <Select
                        label="Message Position"
                        options={["Below Button", "Above Button"]}
                        value={messagePosition}
                        onChange={setMessagePosition} // ✅ updates preview
                      />
                    </BlockStack>
                  </BlockStack>
                </Box>
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
