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
