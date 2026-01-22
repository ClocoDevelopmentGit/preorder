-- CreateTable
CREATE TABLE "PreorderProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PreorderVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PreorderVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PreorderProduct" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "enablePreorderAll" BOOLEAN NOT NULL DEFAULT false,
    "buttonLabel" TEXT,
    "preorderMessage" TEXT,
    "messagePosition" TEXT,
    "badgeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "badgeText" TEXT,
    "badgeShape" TEXT,
    "inventoryManagement" BOOLEAN NOT NULL DEFAULT false,
    "orderTag" TEXT,
    "syncInventory" BOOLEAN NOT NULL DEFAULT false,
    "hideBuyNow" BOOLEAN NOT NULL DEFAULT false,
    "badgesOnCollection" BOOLEAN NOT NULL DEFAULT false,
    "badgeOnProduct" BOOLEAN NOT NULL DEFAULT false,
    "buttonsOnCollection" BOOLEAN NOT NULL DEFAULT false,
    "quickviewSupport" BOOLEAN NOT NULL DEFAULT false,
    "cartLabelText" TEXT,
    "cartLabelKey" TEXT,
    "showAdditionalButtons" BOOLEAN NOT NULL DEFAULT false,
    "preventOrdering" BOOLEAN NOT NULL DEFAULT false,
    "insufficientStockMsg" TEXT,
    "notifyCustomers" BOOLEAN NOT NULL DEFAULT false,
    "partOrderMsg" TEXT,
    "mixedCartWarning" BOOLEAN NOT NULL DEFAULT false,
    "discountType" TEXT,
    "startDate" TEXT,
    "startTime" TEXT,
    "endDate" TEXT,
    "endTime" TEXT,
    "shopTimezone" TEXT,
    "selectedTheme" TEXT,
    "selectors" TEXT,
    "monthlyChargeLimit" TEXT,
    "bccMe" BOOLEAN NOT NULL DEFAULT false,
    "bccEmail" TEXT,
    "emailSubject" TEXT,
    "emailHeader" TEXT,
    "emailLineItem" TEXT,
    "emailLineFooter" TEXT,
    "senderEmail" TEXT
);
INSERT INTO "new_Settings" ("badgeEnabled", "badgeOnProduct", "badgeShape", "badgeText", "badgesOnCollection", "bccEmail", "bccMe", "buttonLabel", "buttonsOnCollection", "cartLabelKey", "cartLabelText", "discountType", "emailHeader", "emailLineFooter", "emailLineItem", "emailSubject", "enabled", "endDate", "endTime", "hideBuyNow", "id", "insufficientStockMsg", "inventoryManagement", "messagePosition", "mixedCartWarning", "monthlyChargeLimit", "notifyCustomers", "orderTag", "partOrderMsg", "preorderMessage", "preventOrdering", "quickviewSupport", "selectedTheme", "selectors", "senderEmail", "shop", "shopTimezone", "showAdditionalButtons", "startDate", "startTime", "syncInventory") SELECT "badgeEnabled", "badgeOnProduct", "badgeShape", "badgeText", "badgesOnCollection", "bccEmail", "bccMe", "buttonLabel", "buttonsOnCollection", "cartLabelKey", "cartLabelText", "discountType", "emailHeader", "emailLineFooter", "emailLineItem", "emailSubject", "enabled", "endDate", "endTime", "hideBuyNow", "id", "insufficientStockMsg", "inventoryManagement", "messagePosition", "mixedCartWarning", "monthlyChargeLimit", "notifyCustomers", "orderTag", "partOrderMsg", "preorderMessage", "preventOrdering", "quickviewSupport", "selectedTheme", "selectors", "senderEmail", "shop", "shopTimezone", "showAdditionalButtons", "startDate", "startTime", "syncInventory" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PreorderProduct_productId_key" ON "PreorderProduct"("productId");

-- CreateIndex
CREATE INDEX "PreorderProduct_shop_idx" ON "PreorderProduct"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "PreorderVariant_variantId_key" ON "PreorderVariant"("variantId");

-- CreateIndex
CREATE INDEX "PreorderVariant_productId_idx" ON "PreorderVariant"("productId");
