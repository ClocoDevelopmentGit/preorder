import {
    InlineGrid,
    Box,
    BlockStack,
    Text,
    Card,
    TextField,
    Select,
} from "@shopify/polaris";
import { useCallback } from "react";

interface Props {
    settings: any;
    onChange: (key: string, value: any) => void;
}

export default function AdvancedTab({ settings, onChange }: Props) {
    const handleChange = (key: string) => (value: any) => {
        onChange(key, value);
    };

    const handleSelectorChange = (key: string) => (value: string) => {
        const newSelectors = { ...settings.selectors, [key]: value };
        onChange("selectors", newSelectors);
    };

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
                                    { label: "(GMT+03:30) Tehran", value: "GMT+03:30" },
                                    { label: "(GMT+04:00) Abu Dhabi, Muscat", value: "GMT+04:00" },
                                    { label: "(GMT+04:30) Kabul", value: "GMT+04:30" },
                                    { label: "(GMT+05:00) Ekaterinburg, Islamabad, Karachi", value: "GMT+05:00" },
                                    { label: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: "GMT+05:30" },
                                    { label: "(GMT+05:45) Kathmandu", value: "GMT+05:45" },
                                    { label: "(GMT+06:00) Almaty, Dhaka", value: "GMT+06:00" },
                                    { label: "(GMT+06:30) Yangon (Rangoon)", value: "GMT+06:30" },
                                    { label: "(GMT+07:00) Bangkok, Hanoi, Jakarta", value: "GMT+07:00" },
                                    { label: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", value: "GMT+08:00" },
                                    { label: "(GMT+09:00) Osaka, Sapporo, Tokyo", value: "GMT+09:00" },
                                    { label: "(GMT+09:30) Adelaide", value: "GMT+09:30" },
                                    { label: "(GMT+10:00) Canberra, Melbourne, Sydney", value: "GMT+10:00" },
                                    { label: "(GMT+11:00) Magadan, Solomon Is., New Caledonia", value: "GMT+11:00" },
                                    { label: "(GMT+12:00) Auckland, Wellington", value: "GMT+12:00" },
                                    { label: "(GMT+13:00) Nuku'alofa", value: "GMT+13:00" },
                                ]}
                                value={settings.shopTimezone}
                                onChange={handleChange("shopTimezone")}
                            />
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
                            <Text as="p" tone="subdued">
                                Configure CSS selectors for your store theme integration.
                            </Text>
                        </BlockStack>
                    </Box>

                    <Card background="bg-surface" padding="400" borderRadius="300">
                        <BlockStack gap="400">
                            <TextField
                                label="Cart Subtotal"
                                value={settings.selectors?.cartSubtotal || ""}
                                onChange={handleSelectorChange("cartSubtotal")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Checkout Button"
                                value={settings.selectors?.checkoutButton || ""}
                                onChange={handleSelectorChange("checkoutButton")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Form Selector"
                                value={settings.selectors?.formSelector || ""}
                                onChange={handleSelectorChange("formSelector")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Button Selector"
                                value={settings.selectors?.buttonSelector || ""}
                                onChange={handleSelectorChange("buttonSelector")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Product Page Image"
                                value={settings.selectors?.productPageImage || ""}
                                onChange={handleSelectorChange("productPageImage")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Variant Selector"
                                value={settings.selectors?.variantSelector || ""}
                                onChange={handleSelectorChange("variantSelector")}
                                autoComplete="off"
                            />
                            <TextField
                                label="Product Link Selector"
                                value={settings.selectors?.productLinkSelector || ""}
                                onChange={handleSelectorChange("productLinkSelector")}
                                autoComplete="off"
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </div>
        </>
    );
}