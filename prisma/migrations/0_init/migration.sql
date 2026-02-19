-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
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
    "senderEmail" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreorderProduct" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "customSettings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreorderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreorderVariant" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreorderVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "PreorderProduct_productId_key" ON "PreorderProduct"("productId");

-- CreateIndex
CREATE INDEX "PreorderProduct_shop_idx" ON "PreorderProduct"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "PreorderVariant_variantId_key" ON "PreorderVariant"("variantId");

-- CreateIndex
CREATE INDEX "PreorderVariant_productId_idx" ON "PreorderVariant"("productId");

-- AddForeignKey
ALTER TABLE "PreorderVariant" ADD CONSTRAINT "PreorderVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PreorderProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

