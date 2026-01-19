import { Banner, Text, Link } from "@shopify/polaris";

interface Props {
    onSwitchToDefault: () => void;
}

export default function StylesTab({ onSwitchToDefault }: Props) {
    return (
        <div style={{ paddingTop: "24px" }}>
            <Banner tone="info" title="More style options coming soon!">
                <Text as="p">
                    We're working on adding more style options. For now, you can adjust
                    preorder message and badge styles in{" "}
                    <Link onClick={onSwitchToDefault}>
                        Default Settings
                    </Link>{" "}
                    or the Product Variant page. Need custom styling?{" "}
                    <Link url="mailto:support@preordernow.com">Contact us</Link>
                    —we'll do it for free!
                </Text>
            </Banner>
        </div>
    );
}
