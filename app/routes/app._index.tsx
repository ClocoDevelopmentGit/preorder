import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Icon,
  ProgressBar,
  Button,
  Banner,
  Box,
  Divider,
} from "@shopify/polaris";
import {
  CheckIcon,
  ExternalIcon,
  ChevronDownIcon,
  InfoIcon,
  RefreshIcon,
  PlayIcon,
  QuestionCircleIcon,
  ChatIcon
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  // ... existing action logic if preserved, but common to have specialized ones
  return null;
};

export default function Index() {
  const shopify = useAppBridge();

  return (
    <Page>
      <BlockStack gap="500">
        {/* Header - Home with Icon */}
        <InlineStack align="start" gap="200">
          <div style={{ backgroundColor: "#ff4d8d", padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center" }}>
            <Icon source={ExternalIcon} tone="primary" /> {/* Replace with Home/Store icon if available */}
          </div>
          <Text variant="headingLg" as="h1">Home</Text>
        </InlineStack>

        {/* Setup Guide Card */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text variant="headingMd" as="h2">Create a Preorder</Text>
              <Icon source={ChevronDownIcon} />
            </InlineStack>
            <Text as="p">Follow the steps below to get a new preorder up and running in no time.</Text>
            <InlineStack gap="200" align="start" blockAlign="center">
              <Text as="span">0 / 2 completed</Text>
              <div style={{ width: "150px" }}>
                <ProgressBar progress={0} size="small" />
              </div>
            </InlineStack>

            <BlockStack gap="300">
              <InlineStack gap="300" align="start" blockAlign="center">
                <div style={{ border: "2px dashed #ccc", borderRadius: "50%", padding: "4px" }}>
                  <div style={{ width: "16px", height: "16px" }} />
                </div>
                <Text as="p">Activate the App</Text>
              </InlineStack>
              <InlineStack gap="300" align="start" blockAlign="center">
                <div style={{ border: "2px dashed #ccc", borderRadius: "50%", padding: "4px" }}>
                  <div style={{ width: "16px", height: "16px" }} />
                </div>
                <Text as="p">Add preorder products</Text>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Plan Status Card */}
        <Card>
          <BlockStack gap="500">
            <InlineStack gap="200" blockAlign="center">
              <Icon source={ExternalIcon} /> {/* Plan icon placeholder */}
              <Text as="span">Current Plan: </Text>
              <Text fontWeight="bold" as="span">Free</Text>
              <Badge tone="success">Active</Badge>
            </InlineStack>

            <Box background="bg-surface-secondary" padding="400" borderRadius="200">
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">Upgrade to Unlock These Powerful Features:</Text>
                <Layout>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">UNLIMITED Preorder Products</Text>
                      </InlineStack>
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">Preorder Discounts</Text>
                      </InlineStack>
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">Preorder by Product Tag</Text>
                      </InlineStack>
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">Collection Page Badges</Text>
                      </InlineStack>
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">Display Preorder in Quickview</Text>
                      </InlineStack>
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ backgroundColor: "#4a4a4a", borderRadius: "50%", padding: "2px" }}>
                          <Icon source={CheckIcon} tone="critical" />
                        </div>
                        <Text as="span" variant="bodySm">Live Support (Chat & Email)</Text>
                      </InlineStack>
                    </BlockStack>
                  </Layout.Section>
                </Layout>
                <Box>
                  <Button variant="primary">View All Plans</Button>
                </Box>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>

        {/* App Embed Status Card/Banner */}
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <Icon source={ExternalIcon} /> {/* App icon placeholder */}
              <Text as="span" fontWeight="bold">App Embed: Action Required</Text>
              <Badge tone="critical">Disabled</Badge>
            </InlineStack>
            <InlineStack gap="200">
              <Button>Enable App Embed</Button>
              <Button icon={RefreshIcon} />
            </InlineStack>
          </InlineStack>
          <Box paddingBlockStart="200">
            <Text as="p" tone="subdued">Enable the app embed in your Shopify theme to activate PreOrder Now.</Text>
          </Box>
        </Card>

        <Text variant="headingLg" as="h2">Dashboard</Text>

        {/* Dashboard Filters */}
        <Box background="bg-surface" padding="200" borderRadius="200">
          <InlineStack gap="0">
            <Button variant="tertiary">Last 30 Days</Button>
            <Button variant="plain">Last 14 Days</Button>
            <Button variant="plain">Last 7 Days</Button>
          </InlineStack>
        </Box>

        {/* Dashboard Stats */}
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <InlineStack gap="100" blockAlign="center">
                  <Text variant="headingMd" as="h3">Total Placed Preorders</Text>
                  <Icon source={InfoIcon} tone="subdued" />
                </InlineStack>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <InlineStack gap="100" blockAlign="center">
                  <Text variant="headingMd" as="h3">Total Sales for Preorders</Text>
                  <Icon source={InfoIcon} tone="subdued" />
                </InlineStack>
                <Text variant="headingXl" as="p">$0</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Revenue Chart Card */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">Revenue From Preorders</Text>
            <Box minHeight="300px" padding="400">
              <div style={{ borderBottom: "1px solid #e1e3e5", height: "100px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, bottom: "4px", fontSize: "12px", color: "#6d7175" }}>$10</span>
              </div>
              <div style={{ borderBottom: "1px solid #e1e3e5", height: "100px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, bottom: "4px", fontSize: "12px", color: "#6d7175" }}>$5</span>
              </div>
              <div style={{ height: "100px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, bottom: "4px", fontSize: "12px", color: "#6d7175" }}>$0</span>
              </div>
            </Box>
          </BlockStack>
        </Card>

        {/* Footer Help Card */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">Need any Help?</Text>
            <Text as="p">We're here to help you every step of the way.</Text>
            <InlineStack gap="300">
              <Button icon={PlayIcon}>Video tutorial</Button>
              <Button icon={QuestionCircleIcon}>Help Center</Button>
              <Button icon={ChatIcon}>Live Chat</Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
