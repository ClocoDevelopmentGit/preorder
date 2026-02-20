import {
    InlineGrid,
    Box,
    BlockStack,
    Text,
    Card,
    Banner,
    Checkbox,
    Button,
    InlineStack,
    TextField,
    Select,
} from "@shopify/polaris";
import { Suspense, lazy } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = lazy(() => import("react-quill-new"));

interface Props {
    settings: any;
    onChange: (key: string, value: any) => void;
}

export default function EmailTab({ settings, onChange }: Props) {
    const handleChange = (key: string) => (value: any) => {
        onChange(key, value);
    };

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
                                value={settings.monthlyChargeLimit || ""}
                                onChange={handleChange("monthlyChargeLimit")}
                            />
                            <Checkbox
                                label="BCC Me on Preorder Confirmation Emails"
                                checked={!!settings.bccMe}
                                onChange={handleChange("bccMe")}
                            />
                            <TextField
                                label="Enter BCC Email"
                                value={settings.bccEmail || ""}
                                onChange={handleChange("bccEmail")}
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
                                value={settings.emailSubject || ""}
                                onChange={handleChange("emailSubject")}
                                autoComplete="off"
                                helpText="Variables: {{customer_first_name}}, {{customer_last_name}}, {{order_number}}"
                            />

                            <BlockStack gap="200">
                                <Text as="p" variant="bodyMd">Email Header</Text>
                                <Suspense fallback={<Box minHeight="100px" />}>
                                    <ReactQuill
                                        theme="snow"
                                        value={settings.emailHeader || ""}
                                        onChange={handleChange("emailHeader")}
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
                                        value={settings.emailLineItem || ""}
                                        onChange={handleChange("emailLineItem")}
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
                                        value={settings.emailLineFooter || ""}
                                        onChange={handleChange("emailLineFooter")}
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
                                value={settings.senderEmail || ""}
                                onChange={handleChange("senderEmail")}
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
}
