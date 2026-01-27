-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PreorderProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "customSettings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PreorderProduct" ("createdAt", "handle", "id", "image", "productId", "shop", "status", "title", "updatedAt") SELECT "createdAt", "handle", "id", "image", "productId", "shop", "status", "title", "updatedAt" FROM "PreorderProduct";
DROP TABLE "PreorderProduct";
ALTER TABLE "new_PreorderProduct" RENAME TO "PreorderProduct";
CREATE UNIQUE INDEX "PreorderProduct_productId_key" ON "PreorderProduct"("productId");
CREATE INDEX "PreorderProduct_shop_idx" ON "PreorderProduct"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
