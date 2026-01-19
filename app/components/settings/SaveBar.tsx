import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useEffect } from "react";

interface Props {
    visible: boolean;
    settings: any;
    onSaved: () => void;
    loading?: boolean;
}

export default function CustomSaveBar({ visible, settings, onSaved, loading }: Props) {
    const shopify = useAppBridge();

    const handleSave = () => {
        console.log("Saving settings", settings);
        onSaved();
    };

    const handleDiscard = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (visible) {
            shopify.saveBar.show("settings-save-bar");
        } else {
            shopify.saveBar.hide("settings-save-bar");
        }
    }, [visible, shopify]);

    // Always render access to the save bar, visibility controlled by API
    return (
        <SaveBar id="settings-save-bar">
            <button variant="primary" onClick={handleSave} loading={loading ? "" : undefined} disabled={loading}>
                Save
            </button>
            <button onClick={handleDiscard} disabled={loading}>Discard</button>
        </SaveBar>
    );
}
