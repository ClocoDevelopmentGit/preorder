import {
  Page,
  Tabs,
  Layout,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { useLoaderData, useSubmit, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Import components
import DefaultTab from "../components/settings/DefaultTab";
import AdvancedTab from "../components/settings/AdvancedTab";
import EmailTab from "../components/settings/EmailTab";
import StylesTab from "../components/settings/StylesTab";
import CustomSaveBar from "../components/settings/SaveBar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await db.settings.findUnique({
    where: { shop: session.shop },
  });

  return settings || {
    // defaults if no settings found (though usually there should be)
    enabled: false,
    enablePreorderAll: false,
    buttonLabel: "Preorder Now",
    preorderMessage: "Your Preorder is available from 25th June",
    messagePosition: "Below Button",
    shopTimezone: "GMT-05:00",
    selectedTheme: "default",
    selectors: JSON.stringify({ // defaults for selectors
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
    })
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("Settings Action received data:", JSON.stringify(data, null, 2));

  const settingsUpdate: any = {
    ...data,
    enabled: data.enabled === "true",
    enablePreorderAll: data.enablePreorderAll === "true",
    bccMe: data.bccMe === "true",
    badgeEnabled: data.badgeEnabled === "true",
    inventoryManagement: data.inventoryManagement === "true",
    syncInventory: data.syncInventory === "true",
    hideBuyNow: data.hideBuyNow === "true",
    badgesOnCollection: data.badgesOnCollection === "true",
    badgeOnProduct: data.badgeOnProduct === "true",
    buttonsOnCollection: data.buttonsOnCollection === "true",
    quickviewSupport: data.quickviewSupport === "true",
    showAdditionalButtons: data.showAdditionalButtons === "true",
    preventOrdering: data.preventOrdering === "true",
    notifyCustomers: data.notifyCustomers === "true",
    mixedCartWarning: data.mixedCartWarning === "true",
  };

  // TARGETED SYNC: Fix a specific variant ID
  if (data.forceSyncVariant === "true" && data.debugVariantId) {
    try {
      const { admin } = await authenticate.admin(request);
      const gid = data.debugVariantId.toString().includes("gid://")
        ? data.debugVariantId
        : `gid://shopify/ProductVariant/${data.debugVariantId}`;

      console.log(`[Sync Debug] Attempting targeted sync: ${gid}`);

      // First, let's fetch current state for better logging
      const checkResponse: any = await admin.graphql(
        `#graphql
          query checkVariant($id: ID!) {
              productVariant(id: $id) {
                  id 
                  inventoryPolicy 
                  inventoryItem {
                    tracked
                  }
                  inventoryQuantity
                  product {
                    id
                  }
              }
          }`,
        { variables: { id: gid } }
      );
      const checkJson = await checkResponse.json();
      console.log("[Sync Debug] Current State BEFORE sync:", JSON.stringify(checkJson.data?.productVariant, null, 2));

      const productId = checkJson.data?.productVariant?.product?.id;
      if (!productId) {
        throw new Error("Product ID not found for variant");
      }

      const response: any = await admin.graphql(
        `#graphql
          mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
              productVariants {
                id
                inventoryPolicy
                inventoryItem {
                  tracked
                }
                title
                product { title }
              }
              userErrors {
                field
                message
              }
            }
          }`,
        {
          variables: {
            productId: productId,
            variants: [{
              id: gid,
              inventoryPolicy: "CONTINUE",
              inventoryItem: {
                tracked: true
              }
            }]
          }
        }
      );

      const resJson = await response.json();
      console.log("[Sync Debug] Mutation Result:", JSON.stringify(resJson, null, 2));

      const bulkResult = resJson.data?.productVariantsBulkUpdate;
      const userErrors = bulkResult?.userErrors;
      if (userErrors && userErrors.length > 0) {
        console.error("[Sync Debug] Failed with User Errors:", userErrors);
      } else {
        const variant = bulkResult?.productVariants?.[0];
        console.log(`[Sync Debug] SUCCESS: Updated ${variant?.product?.title} (${variant?.title}) to ${variant?.inventoryPolicy}`);
      }
    } catch (err) {
      console.error("[Sync Debug] Targeted sync CRITICAL error:", err);
    }
  }

  if (settingsUpdate.enablePreorderAll || data.forceSync === "true") {
    try {
      console.log("Sync requested. Automating inventory policy update...");

      const { admin } = await authenticate.admin(request);

      let hasNextPage = true;
      let cursor = null;
      let totalProcessed = 0;
      let totalUpdated = 0;

      while (hasNextPage) {
        const response: any = await admin.graphql(
          `#graphql
              query getProducts($cursor: String) {
                products(first: 250, after: $cursor) {
                  edges {
                    node {
                      id
                      variants(first: 100) {
                        edges {
                          node {
                            id
                            inventoryPolicy
                          }
                        }
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }`,
          { variables: { cursor } }
        );

        const responseJson: any = await response.json();
        const products = responseJson.data?.products?.edges || [];
        const pageInfo: any = responseJson.data?.products?.pageInfo;

        console.log(`Analyzing batch of ${products.length} products...`);

        for (const p of products) {
          const variants = p.node.variants.edges || [];
          const variantsToUpdate = (variants as any[])
            .filter((v: any) => v.node.inventoryPolicy === 'DENY')
            .map((v: any) => ({
              id: v.node.id,
              inventoryPolicy: "CONTINUE"
            }));

          if (variantsToUpdate.length > 0) {
            totalUpdated += variantsToUpdate.length;
            console.log(`Updating ${variantsToUpdate.length}/${variants.length} variants for product ${p.node.id}...`);
            await admin.graphql(
              `#graphql
                  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                      userErrors {
                        message
                      }
                    }
                  }`,
              {
                variables: {
                  productId: p.node.id,
                  variants: variantsToUpdate
                }
              }
            );
          }
        }

        totalProcessed += products.length;
        hasNextPage = pageInfo?.hasNextPage || false;
        cursor = pageInfo?.endCursor || null;

        if (totalProcessed > 5000) break;
      }

      console.log(`Inventory policy sync complete. Processed ${totalProcessed} products, updated ${totalUpdated} variants.`);
    } catch (err) {
      console.error("Failed to automate inventory policy", err);
    }
  }

  // Final Cleanup for Prisma
  delete settingsUpdate.forceSync;
  delete settingsUpdate.forceSyncVariant;
  delete settingsUpdate.debugVariantId;
  delete settingsUpdate.id;

  const settings = await db.settings.upsert({
    where: { shop: session.shop },
    update: settingsUpdate,
    create: {
      shop: session.shop,
      ...settingsUpdate,
    },
  });

  return settings;
};

export default function SettingsPage() {
  const loadedSettings = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting" || navigation.state === "loading";

  // State management
  const [selectedTab, setSelectedTab] = useState(0);
  const [dirty, setDirty] = useState(false);

  // Initialize state with loaded settings
  // We need a local state copy to handle edits before saving
  const [settings, setSettings] = useState(() => {
    // Parse selectors if it's a string
    let parsedSelectors = {};
    try {
      parsedSelectors = typeof loadedSettings.selectors === 'string'
        ? JSON.parse(loadedSettings.selectors)
        : loadedSettings.selectors || {};
    } catch (e) {
      parsedSelectors = {};
    }

    return {
      ...loadedSettings,
      selectors: parsedSelectors,
    };
  });

  // Sync state if loader data changes (e.g. after save)
  useEffect(() => {
    // check if we just finished a save (form submission)
    let parsedSelectors = {};
    try {
      parsedSelectors = typeof loadedSettings.selectors === 'string'
        ? JSON.parse(loadedSettings.selectors)
        : loadedSettings.selectors || {};
    } catch (e) {
      parsedSelectors = {};
    }

    // Only update if not dirty to avoid overwriting user valid input, 
    // OR if we want to confirm save.
    // For simplicity, we can update on successful navigations or just update local state after submit logic.
    // React Router revalidates loaders after actions.
    if (navigation.state === "idle" && !dirty) {
      setSettings({ ...loadedSettings, selectors: parsedSelectors });
    }
  }, [loadedSettings, navigation.state]);


  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    [],
  );

  const handleFieldChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    // Prepare data for submission
    const dataToSubmit = {
      ...settings,
      selectors: JSON.stringify(settings.selectors),
    };

    submit(dataToSubmit, { method: "POST" });
    setDirty(false);
  };

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
        return <DefaultTab settings={settings} onChange={handleFieldChange} />;
      case 1:
        return <AdvancedTab settings={settings} onChange={handleFieldChange} />;
      case 2:
        return <EmailTab settings={settings} onChange={handleFieldChange} />;
      case 3:
        return <StylesTab onSwitchToDefault={() => setSelectedTab(0)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingTop: "48px" }}>
      <Page title="Settings">
        {/* Save Bar */}
        <CustomSaveBar
          visible={dirty}
          settings={settings}
          onSaved={handleSave}
          loading={isLoading}
        />

        <Layout>
          <Layout.Section>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              {renderTabContent()}
            </Tabs>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}
