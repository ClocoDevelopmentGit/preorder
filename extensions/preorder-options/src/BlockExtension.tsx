import React from 'react';
import {
  reactExtension,
  AdminBlock,
  BlockStack,
  Box,
  Text,
  Button,
  Divider,
  InlineStack,
} from '@shopify/ui-extensions-react/admin';

export default reactExtension('admin.product-details.block.render', (api) => (
  <Extension api={api} />
));

function Extension({ api }: { api: any }) {
  const { i18n, data, extension: { target } } = api;
  console.log({ data });

  // Accessing product/variant data from the extension data context
  const productId = data?.product?.id;

  return (
    <AdminBlock title="Preorder Settings">
      <BlockStack gap="base">
        <Box padding="base">
          <BlockStack gap="base">
            <Text>Configure preorder settings for this product.</Text>

            <InlineStack inlineAlignment="space-between" blockAlignment="center">
              <Text>Enable Preorder</Text>
              <Button variant="primary">Enable</Button>
            </InlineStack>

            <Divider />

            <BlockStack gap="base">
              <Text fontWeight="bold">Preorder Message</Text>
              <Text>The message shown on the product page when preorder is active.</Text>
              <Box paddingBlockStart="base">
                <Button variant="secondary" onClick={() => api.toast.show("This will open app settings")}>
                  Configure Label
                </Button>
              </Box>
            </BlockStack>
          </BlockStack>
        </Box>
      </BlockStack>
    </AdminBlock>
  );
}
