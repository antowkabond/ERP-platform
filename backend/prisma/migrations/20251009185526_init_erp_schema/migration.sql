-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('RECEIPT', 'EXPENSE');

-- CreateEnum
CREATE TYPE "DocumentState" AS ENUM ('DRAFT', 'POSTED', 'DELETED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('RETAIL', 'WHOLESALE', 'PURCHASE');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ACCOUNTANT', 'MANAGER', 'VIEWER', 'AUDITOR');

-- CreateTable
CREATE TABLE "catalogs_counterparty" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "taxNumber" VARCHAR(50),
    "address" VARCHAR(500),
    "contactPhone" VARCHAR(50),
    "contactEmail" VARCHAR(255),
    "isCustomer" BOOLEAN NOT NULL DEFAULT true,
    "isSupplier" BOOLEAN NOT NULL DEFAULT false,
    "creditLimit" DECIMAL(15,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "catalogs_counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs_item" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "unitOfMeasure" VARCHAR(20) NOT NULL DEFAULT 'pcs',
    "isInventory" BOOLEAN NOT NULL DEFAULT true,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "defaultPrice" DECIMAL(15,2),
    "costPrice" DECIMAL(15,2),
    "minimumQuantity" DECIMAL(15,3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "catalogs_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs_warehouse" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "address" VARCHAR(500),
    "responsiblePerson" VARCHAR(255),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "catalogs_warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_goods_receipt" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "DocumentState" NOT NULL DEFAULT 'DRAFT',
    "counterpartyId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "comment" VARCHAR(1000),
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "totalQuantity" DECIMAL(15,3) NOT NULL,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "documents_goods_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_goods_receipt_items" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" DECIMAL(15,3) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "documents_goods_receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_goods_sale" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "DocumentState" NOT NULL DEFAULT 'DRAFT',
    "counterpartyId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "comment" VARCHAR(1000),
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "totalQuantity" DECIMAL(15,3) NOT NULL,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "documents_goods_sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_goods_sale_items" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" DECIMAL(15,3) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "documents_goods_sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_payment_order" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "DocumentState" NOT NULL DEFAULT 'DRAFT',
    "counterpartyId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "paymentPurpose" VARCHAR(500),
    "isIncoming" BOOLEAN NOT NULL,
    "comment" VARCHAR(1000),
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "documents_payment_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registers_inventory" (
    "id" TEXT NOT NULL,
    "recorder" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DECIMAL(15,3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registers_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registers_financial" (
    "id" TEXT NOT NULL,
    "recorder" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "movementType" "MovementType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registers_financial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registers_prices" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,
    "priceType" "PriceType" NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "registers_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_chart_of_accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "parentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" VARCHAR(500),

    CONSTRAINT "accounting_chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_entries" (
    "id" TEXT NOT NULL,
    "recorder" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "debitAccountId" TEXT NOT NULL,
    "creditAccountId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "costCenterId" TEXT,
    "projectId" TEXT,
    "departmentId" TEXT,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounting_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_users" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "companyId" TEXT,
    "departmentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_audit_log" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" VARCHAR(50),
    "userAgent" VARCHAR(500),

    CONSTRAINT "system_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_counterparty_code_key" ON "catalogs_counterparty"("code");

-- CreateIndex
CREATE INDEX "catalogs_counterparty_code_isActive_idx" ON "catalogs_counterparty"("code", "isActive");

-- CreateIndex
CREATE INDEX "catalogs_counterparty_parentId_idx" ON "catalogs_counterparty"("parentId");

-- CreateIndex
CREATE INDEX "catalogs_counterparty_isCustomer_isSupplier_idx" ON "catalogs_counterparty"("isCustomer", "isSupplier");

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_item_code_key" ON "catalogs_item"("code");

-- CreateIndex
CREATE INDEX "catalogs_item_code_isActive_idx" ON "catalogs_item"("code", "isActive");

-- CreateIndex
CREATE INDEX "catalogs_item_parentId_idx" ON "catalogs_item"("parentId");

-- CreateIndex
CREATE INDEX "catalogs_item_sku_idx" ON "catalogs_item"("sku");

-- CreateIndex
CREATE INDEX "catalogs_item_isInventory_idx" ON "catalogs_item"("isInventory");

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_warehouse_code_key" ON "catalogs_warehouse"("code");

-- CreateIndex
CREATE INDEX "catalogs_warehouse_code_isActive_idx" ON "catalogs_warehouse"("code", "isActive");

-- CreateIndex
CREATE INDEX "catalogs_warehouse_parentId_idx" ON "catalogs_warehouse"("parentId");

-- CreateIndex
CREATE INDEX "catalogs_warehouse_isDefault_idx" ON "catalogs_warehouse"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "documents_goods_receipt_number_key" ON "documents_goods_receipt"("number");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_number_idx" ON "documents_goods_receipt"("number");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_date_state_idx" ON "documents_goods_receipt"("date", "state");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_counterpartyId_idx" ON "documents_goods_receipt"("counterpartyId");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_warehouseId_idx" ON "documents_goods_receipt"("warehouseId");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_state_date_idx" ON "documents_goods_receipt"("state", "date");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_items_documentId_idx" ON "documents_goods_receipt_items"("documentId");

-- CreateIndex
CREATE INDEX "documents_goods_receipt_items_itemId_idx" ON "documents_goods_receipt_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_goods_receipt_items_documentId_lineNumber_key" ON "documents_goods_receipt_items"("documentId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "documents_goods_sale_number_key" ON "documents_goods_sale"("number");

-- CreateIndex
CREATE INDEX "documents_goods_sale_number_idx" ON "documents_goods_sale"("number");

-- CreateIndex
CREATE INDEX "documents_goods_sale_date_state_idx" ON "documents_goods_sale"("date", "state");

-- CreateIndex
CREATE INDEX "documents_goods_sale_counterpartyId_idx" ON "documents_goods_sale"("counterpartyId");

-- CreateIndex
CREATE INDEX "documents_goods_sale_warehouseId_idx" ON "documents_goods_sale"("warehouseId");

-- CreateIndex
CREATE INDEX "documents_goods_sale_state_date_idx" ON "documents_goods_sale"("state", "date");

-- CreateIndex
CREATE INDEX "documents_goods_sale_items_documentId_idx" ON "documents_goods_sale_items"("documentId");

-- CreateIndex
CREATE INDEX "documents_goods_sale_items_itemId_idx" ON "documents_goods_sale_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_goods_sale_items_documentId_lineNumber_key" ON "documents_goods_sale_items"("documentId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "documents_payment_order_number_key" ON "documents_payment_order"("number");

-- CreateIndex
CREATE INDEX "documents_payment_order_number_idx" ON "documents_payment_order"("number");

-- CreateIndex
CREATE INDEX "documents_payment_order_date_state_idx" ON "documents_payment_order"("date", "state");

-- CreateIndex
CREATE INDEX "documents_payment_order_counterpartyId_idx" ON "documents_payment_order"("counterpartyId");

-- CreateIndex
CREATE INDEX "documents_payment_order_state_date_idx" ON "documents_payment_order"("state", "date");

-- CreateIndex
CREATE INDEX "documents_payment_order_isIncoming_date_idx" ON "documents_payment_order"("isIncoming", "date");

-- CreateIndex
CREATE INDEX "registers_inventory_itemId_warehouseId_date_idx" ON "registers_inventory"("itemId", "warehouseId", "date");

-- CreateIndex
CREATE INDEX "registers_inventory_recorder_idx" ON "registers_inventory"("recorder");

-- CreateIndex
CREATE INDEX "registers_inventory_date_movementType_idx" ON "registers_inventory"("date", "movementType");

-- CreateIndex
CREATE INDEX "registers_inventory_itemId_date_idx" ON "registers_inventory"("itemId", "date");

-- CreateIndex
CREATE INDEX "registers_inventory_warehouseId_date_idx" ON "registers_inventory"("warehouseId", "date");

-- CreateIndex
CREATE INDEX "registers_financial_counterpartyId_date_idx" ON "registers_financial"("counterpartyId", "date");

-- CreateIndex
CREATE INDEX "registers_financial_recorder_idx" ON "registers_financial"("recorder");

-- CreateIndex
CREATE INDEX "registers_financial_date_movementType_idx" ON "registers_financial"("date", "movementType");

-- CreateIndex
CREATE INDEX "registers_financial_currency_date_idx" ON "registers_financial"("currency", "date");

-- CreateIndex
CREATE INDEX "registers_prices_itemId_priceType_idx" ON "registers_prices"("itemId", "priceType");

-- CreateIndex
CREATE INDEX "registers_prices_date_idx" ON "registers_prices"("date");

-- CreateIndex
CREATE UNIQUE INDEX "registers_prices_itemId_priceType_date_key" ON "registers_prices"("itemId", "priceType", "date");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_chart_of_accounts_code_key" ON "accounting_chart_of_accounts"("code");

-- CreateIndex
CREATE INDEX "accounting_chart_of_accounts_code_isActive_idx" ON "accounting_chart_of_accounts"("code", "isActive");

-- CreateIndex
CREATE INDEX "accounting_chart_of_accounts_accountType_idx" ON "accounting_chart_of_accounts"("accountType");

-- CreateIndex
CREATE INDEX "accounting_chart_of_accounts_parentId_idx" ON "accounting_chart_of_accounts"("parentId");

-- CreateIndex
CREATE INDEX "accounting_entries_recorder_idx" ON "accounting_entries"("recorder");

-- CreateIndex
CREATE INDEX "accounting_entries_date_debitAccountId_idx" ON "accounting_entries"("date", "debitAccountId");

-- CreateIndex
CREATE INDEX "accounting_entries_date_creditAccountId_idx" ON "accounting_entries"("date", "creditAccountId");

-- CreateIndex
CREATE INDEX "accounting_entries_debitAccountId_date_idx" ON "accounting_entries"("debitAccountId", "date");

-- CreateIndex
CREATE INDEX "accounting_entries_creditAccountId_date_idx" ON "accounting_entries"("creditAccountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_auth0Id_key" ON "system_users"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_email_key" ON "system_users"("email");

-- CreateIndex
CREATE INDEX "system_users_auth0Id_idx" ON "system_users"("auth0Id");

-- CreateIndex
CREATE INDEX "system_users_email_idx" ON "system_users"("email");

-- CreateIndex
CREATE INDEX "system_users_role_isActive_idx" ON "system_users"("role", "isActive");

-- CreateIndex
CREATE INDEX "system_audit_log_entityType_entityId_idx" ON "system_audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "system_audit_log_userId_timestamp_idx" ON "system_audit_log"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "system_audit_log_timestamp_idx" ON "system_audit_log"("timestamp");

-- CreateIndex
CREATE INDEX "system_audit_log_action_timestamp_idx" ON "system_audit_log"("action", "timestamp");

-- AddForeignKey
ALTER TABLE "catalogs_counterparty" ADD CONSTRAINT "catalogs_counterparty_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "catalogs_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs_item" ADD CONSTRAINT "catalogs_item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "catalogs_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs_warehouse" ADD CONSTRAINT "catalogs_warehouse_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "catalogs_warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_receipt" ADD CONSTRAINT "documents_goods_receipt_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "catalogs_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_receipt" ADD CONSTRAINT "documents_goods_receipt_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "catalogs_warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_receipt_items" ADD CONSTRAINT "documents_goods_receipt_items_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents_goods_receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_receipt_items" ADD CONSTRAINT "documents_goods_receipt_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catalogs_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_sale" ADD CONSTRAINT "documents_goods_sale_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "catalogs_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_sale" ADD CONSTRAINT "documents_goods_sale_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "catalogs_warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_sale_items" ADD CONSTRAINT "documents_goods_sale_items_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents_goods_sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_goods_sale_items" ADD CONSTRAINT "documents_goods_sale_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catalogs_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_payment_order" ADD CONSTRAINT "documents_payment_order_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "catalogs_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registers_inventory" ADD CONSTRAINT "registers_inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catalogs_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registers_inventory" ADD CONSTRAINT "registers_inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "catalogs_warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registers_financial" ADD CONSTRAINT "registers_financial_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "catalogs_counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registers_prices" ADD CONSTRAINT "registers_prices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catalogs_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_chart_of_accounts" ADD CONSTRAINT "accounting_chart_of_accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "accounting_chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_entries" ADD CONSTRAINT "accounting_entries_debitAccountId_fkey" FOREIGN KEY ("debitAccountId") REFERENCES "accounting_chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_entries" ADD CONSTRAINT "accounting_entries_creditAccountId_fkey" FOREIGN KEY ("creditAccountId") REFERENCES "accounting_chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
