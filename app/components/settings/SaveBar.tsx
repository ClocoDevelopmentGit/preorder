import { ContextualSaveBar } from "@shopify/polaris";

interface Props {
    visible: boolean;
    settings: any;
    onSaved: () => void;
}

export default function SaveBar({ visible, settings, onSaved }: Props) {
    if (!visible) return null;

    return (
        <ContextualSaveBar
            alignContentFlush
            message="Unsaved changes"
            saveAction={{
                onAction: () => {
                    // In a real app, you'd save 'settings' to backend here.
                    console.log("Saving settings", settings);
                    onSaved();
                },
            }}
            discardAction={{
                onAction: () => {
                    // In a real app, you might revert changes or reload.
                    // For now, we just hide the bar or rely on parent to handle discard.
                    window.location.reload();
                },
            }}
        />
    );
}
