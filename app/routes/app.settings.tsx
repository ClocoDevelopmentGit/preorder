import {
  Page,
  Tabs,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useSubmit, useNavigation, useActionData } from "react-router";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import "react-quill-new/dist/quill.snow.css";
import DefaultTab from "app/components/settings/DefaultTab";
import AdvancedTab from "app/components/settings/AdvancedTab";
import EmailTab from "app/components/settings/EmailTab";
import StylesTab from "app/components/settings/StylesTab";
import SaveBar from "app/components/settings/SaveBar";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await db.settings.findUnique({ where: { shop: session.shop } });

  if (settings) {
    if (typeof settings.selectors === 'string' && settings.selectors) {
      try {
        // @ts-ignore
        settings.selectors = JSON.parse(settings.selectors);
      } catch (e) {
        console.error("Failed to parse selectors JSON", e);
        // @ts-ignore
        settings.selectors = {};
      }
    } else if (!settings.selectors) {
      // @ts-ignore
      settings.selectors = {};
    }
  }

  return { settings: settings || null };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const settingsRaw = formData.get("settings") as string;

  if (!settingsRaw) {
    return { status: "error", message: "No settings data provided" };
  }

  try {
    const settings = JSON.parse(settingsRaw);
    const dataToSave = { ...settings };

    // Ensure selectors is stringified for DB
    if (dataToSave.selectors && typeof dataToSave.selectors === 'object') {
      dataToSave.selectors = JSON.stringify(dataToSave.selectors);
    }

    // Remove id to let Prisma handle the update/create based on the unique shop field
    delete dataToSave.id;
    // Remove shop from dataToSave to avoid redundancy in upsert if it's already there
    delete dataToSave.shop;

    await db.settings.upsert({
      where: { shop: session.shop },
      update: dataToSave,
      create: { ...dataToSave, shop: session.shop },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Save Error:", error);
    return { status: "error", message: "Failed to save settings" };
  }
};

export default function SettingsPage() {
  const { settings: initialSettings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const isSaving = navigation.state === "submitting";

  // Default Settings State
  const defaultSettings = {
    // Default Tab
    enabled: false,
    buttonLabel: "Preorder Now",
    preorderMessage: "Your Preorder is available from 25th June",
    messagePosition: "Below Button",
    badgeEnabled: true,
    badgeText: "Preorder",
    badgeShape: "Ribbon",
    inventoryManagement: false,
    orderTag: "Pre-order",
    syncInventory: false,
    hideBuyNow: false,
    badgesOnCollection: false,
    badgeOnProduct: false,
    buttonsOnCollection: false,
    quickviewSupport: false,
    cartLabelText: "Preorder Item",
    cartLabelKey: "PN-Note",
    showAdditionalButtons: false,
    preventOrdering: false,
    insufficientStockMsg: "Not enough stock. Only {{qty}} remaining.",
    notifyCustomers: false,
    partOrderMsg: "Only {{qty}} unit(s) in stock. {{qty}} unit(s) will be filled now and the rest will be on pre-order.",
    mixedCartWarning: false,
    discountType: "No Discount",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",

    // Advanced Tab
    shopTimezone: "GMT-05:00",
    selectedTheme: "default",
    selectors: {
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
      productContainerHandleSecondFilter2: "",
    },

    // Email Tab
    monthlyChargeLimit: "",
    bccMe: false,
    bccEmail: "",
    emailSubject: "A product you ordered is on pre-order",
    emailHeader: "",
    emailLineItem: "",
    emailLineFooter: "",
    senderEmail: "no-reply-aws@amazon.com",
  };

  const [settings, setSettings] = useState({ ...defaultSettings, ...initialSettings });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset dirty state when action completes successfully
  useEffect(() => {
    if (actionData?.status === "success") {
      setIsDirty(false);
    }
  }, [actionData]);

  // Sync with initialSettings when they change (e.g. after save)
  useEffect(() => {
    if (!isDirty && initialSettings) {
      setSettings((prev: any) => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings, isDirty]);

  const handleSettingChange = useCallback((key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    submit({ settings: JSON.stringify(settings) }, { method: "POST" });
  }, [settings, submit]);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    [],
  );

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
        return <DefaultTab settings={settings} onChange={handleSettingChange} />;
      case 1:
        return <AdvancedTab settings={settings} onChange={handleSettingChange} />;
      case 2:
        return <EmailTab settings={settings} onChange={handleSettingChange} />;
      case 3:
        return <StylesTab onSwitchToDefault={() => setSelectedTab(0)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingBottom: "4rem" }}>
      <SaveBar visible={isDirty} settings={settings} onSaved={handleSave} loading={isSaving} />
      <Page title="Settings">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {renderTabContent()}
        </Tabs>
      </Page>
    </div>
  );
}
