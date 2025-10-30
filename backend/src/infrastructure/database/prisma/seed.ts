import { PrismaClient, AccountType, PriceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data (in development only!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing data...');
    await prisma.accountingEntry.deleteMany();
    await prisma.inventoryRegister.deleteMany();
    await prisma.financialRegister.deleteMany();
    await prisma.goodsSaleItem.deleteMany();
    await prisma.goodsSale.deleteMany();
    await prisma.priceRegister.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.item.deleteMany();
    await prisma.counterparty.deleteMany();
    await prisma.chartOfAccounts.deleteMany();
    console.log('✅ Existing data cleared\n');
  }

  // 1. Seed Chart of Accounts
  console.log('📊 Seeding Chart of Accounts...');
  
  const chartOfAccounts = [
    // Assets
    { code: '1000', name: 'Assets', accountType: AccountType.ASSET, parentId: null },
    { code: '1100', name: 'Current Assets', accountType: AccountType.ASSET, parentCode: '1000' },
    { code: '1110', name: 'Cash', accountType: AccountType.ASSET, parentCode: '1100' },
    { code: '1200', name: 'Accounts Receivable', accountType: AccountType.ASSET, parentCode: '1100' },
    { code: '1300', name: 'Inventory', accountType: AccountType.ASSET, parentCode: '1100' },

    // Liabilities
    { code: '2000', name: 'Liabilities', accountType: AccountType.LIABILITY, parentId: null },
    { code: '2100', name: 'Current Liabilities', accountType: AccountType.LIABILITY, parentCode: '2000' },
    { code: '2110', name: 'Accounts Payable', accountType: AccountType.LIABILITY, parentCode: '2100' },
    
    // Equity
    { code: '3000', name: 'Equity', accountType: AccountType.EQUITY, parentId: null },
    { code: '3100', name: 'Capital', accountType: AccountType.EQUITY, parentCode: '3000' },
    
    // Revenue
    { code: '4000', name: 'Revenue', accountType: AccountType.REVENUE, parentId: null },
    { code: '4100', name: 'Sales Revenue', accountType: AccountType.REVENUE, parentCode: '4000' },
    
    // Expenses
    { code: '5000', name: 'Expenses', accountType: AccountType.EXPENSE, parentId: null },
    { code: '5100', name: 'Cost of Goods Sold', accountType: AccountType.EXPENSE, parentCode: '5000' },
    { code: '5200', name: 'Operating Expenses', accountType: AccountType.EXPENSE, parentCode: '5000' },
  ];

  const accountMap = new Map<string, string>();

  // Create accounts in order (parents first)
  for (const account of chartOfAccounts) {
    const { parentCode, ...data } = account;
    const parentId = parentCode ? accountMap.get(parentCode) : null;

    const created = await prisma.chartOfAccounts.create({
      data: {
        ...data,
        parentId,
        isActive: true,
      },
    });

    accountMap.set(created.code, created.id);
    console.log(`  ✓ Created account: ${created.code} - ${created.name}`);
  }

  console.log(`✅ Created ${chartOfAccounts.length} chart of accounts\n`);

  // 2. Seed Warehouses
  console.log('🏢 Seeding Warehouses...');
  
  const warehouses = [
    {
      code: 'WH001',
      description: 'Main Warehouse',
      address: '123 Industrial Blvd, Cityville',
      responsiblePerson: 'John Warehouse',
      isDefault: true,
    },
    {
      code: 'WH002',
      description: 'Secondary Warehouse',
      address: '456 Storage St, Townsburg',
      responsiblePerson: 'Jane Storage',
      isDefault: false,
    },
    {
      code: 'WH003',
      description: 'Retail Store',
      address: '789 Main St, Villageton',
      responsiblePerson: 'Bob Retail',
      isDefault: false,
    },
  ];

  const createdWarehouses = [];
  for (const warehouse of warehouses) {
    const created = await prisma.warehouse.create({ data: warehouse });
    createdWarehouses.push(created);
    console.log(`  ✓ Created warehouse: ${created.code} - ${created.description}`);
  }

  console.log(`✅ Created ${warehouses.length} warehouses\n`);

  // 3. Seed Counterparties
  console.log('👥 Seeding Counterparties...');
  
  const counterparties = [
    {
      code: 'CUST001',
      description: 'Acme Corporation',
      taxNumber: 'TAX-123456789',
      address: '100 Business Ave, Commerce City',
      contactPhone: '+1-555-0101',
      contactEmail: 'orders@acme.com',
      isCustomer: true,
      isSupplier: false,
      creditLimit: 50000,
    },
    {
      code: 'CUST002',
      description: 'Global Tech Solutions',
      taxNumber: 'TAX-987654321',
      address: '200 Tech Park, Innovation Valley',
      contactPhone: '+1-555-0102',
      contactEmail: 'purchasing@globaltech.com',
      isCustomer: true,
      isSupplier: false,
      creditLimit: 75000,
    },
    {
      code: 'CUST003',
      description: 'Local Retail Chain',
      taxNumber: 'TAX-456789123',
      address: '300 Retail Plaza, Shopping District',
      contactPhone: '+1-555-0103',
      contactEmail: 'buyer@localretail.com',
      isCustomer: true,
      isSupplier: false,
      creditLimit: 30000,
    },
    {
      code: 'SUPP001',
      description: 'Prime Manufacturing Inc',
      taxNumber: 'TAX-111222333',
      address: '400 Factory Rd, Industrial Zone',
      contactPhone: '+1-555-0201',
      contactEmail: 'sales@primemfg.com',
      isCustomer: false,
      isSupplier: true,
      creditLimit: null,
    },
    {
      code: 'SUPP002',
      description: 'Eastern Imports Ltd',
      taxNumber: 'TAX-444555666',
      address: '500 Harbor St, Port City',
      contactPhone: '+1-555-0202',
      contactEmail: 'info@easternimports.com',
      isCustomer: false,
      isSupplier: true,
      creditLimit: null,
    },
    {
      code: 'BOTH001',
      description: 'Versatile Trading Co',
      taxNumber: 'TAX-777888999',
      address: '600 Commerce Blvd, Trade Center',
      contactPhone: '+1-555-0301',
      contactEmail: 'contact@versatiletrading.com',
      isCustomer: true,
      isSupplier: true,
      creditLimit: 25000,
    },
  ];

  const createdCounterparties = [];
  for (const counterparty of counterparties) {
    const created = await prisma.counterparty.create({ data: counterparty });
    createdCounterparties.push(created);
    console.log(`  ✓ Created counterparty: ${created.code} - ${created.description}`);
  }

  console.log(`✅ Created ${counterparties.length} counterparties\n`);

  // 4. Seed Items (Products)
  console.log('📦 Seeding Items...');
  
  // Create item categories (folders)
  const electronicsCategory = await prisma.item.create({
    data: {
      code: 'CAT-ELEC',
      description: 'Electronics',
      isFolder: true,
      isInventory: false,
      isService: false,
    },
  });
  console.log(`  ✓ Created category: ${electronicsCategory.description}`);

  const furnitureCategory = await prisma.item.create({
    data: {
      code: 'CAT-FURN',
      description: 'Furniture',
      isFolder: true,
      isInventory: false,
      isService: false,
    },
  });
  console.log(`  ✓ Created category: ${furnitureCategory.description}`);

  // Create actual items
  const items = [
    {
      code: 'ITEM001',
      description: 'Laptop Computer - Dell Latitude',
      sku: 'DELL-LAT-5420',
      barcode: '1234567890123',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 1299.99,
      costPrice: 950.00,
      minimumQuantity: 5,
      parentId: electronicsCategory.id,
    },
    {
      code: 'ITEM002',
      description: 'Wireless Mouse - Logitech MX',
      sku: 'LOG-MX-MASTER',
      barcode: '2345678901234',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 99.99,
      costPrice: 65.00,
      minimumQuantity: 20,
      parentId: electronicsCategory.id,
    },
    {
      code: 'ITEM003',
      description: 'USB-C Cable 2m',
      sku: 'CABLE-USBC-2M',
      barcode: '3456789012345',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 19.99,
      costPrice: 8.00,
      minimumQuantity: 50,
      parentId: electronicsCategory.id,
    },
    {
      code: 'ITEM004',
      description: 'Office Desk - Executive',
      sku: 'DESK-EXEC-OAK',
      barcode: '4567890123456',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 599.99,
      costPrice: 350.00,
      minimumQuantity: 3,
      parentId: furnitureCategory.id,
    },
    {
      code: 'ITEM005',
      description: 'Office Chair - Ergonomic',
      sku: 'CHAIR-ERG-BLK',
      barcode: '5678901234567',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 349.99,
      costPrice: 200.00,
      minimumQuantity: 10,
      parentId: furnitureCategory.id,
    },
    {
      code: 'ITEM006',
      description: 'Monitor 27" 4K',
      sku: 'MON-27-4K-DELL',
      barcode: '6789012345678',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 449.99,
      costPrice: 300.00,
      minimumQuantity: 8,
      parentId: electronicsCategory.id,
    },
    {
      code: 'ITEM007',
      description: 'Keyboard - Mechanical RGB',
      sku: 'KB-MECH-RGB',
      barcode: '7890123456789',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 159.99,
      costPrice: 95.00,
      minimumQuantity: 15,
      parentId: electronicsCategory.id,
    },
    {
      code: 'ITEM008',
      description: 'Bookshelf - 5 Tier Oak',
      sku: 'SHELF-5T-OAK',
      barcode: '8901234567890',
      unitOfMeasure: 'pcs',
      isInventory: true,
      isService: false,
      defaultPrice: 229.99,
      costPrice: 130.00,
      minimumQuantity: 5,
      parentId: furnitureCategory.id,
    },
    {
      code: 'SVC001',
      description: 'Installation Service',
      sku: 'SVC-INSTALL',
      barcode: null,
      unitOfMeasure: 'hour',
      isInventory: false,
      isService: true,
      defaultPrice: 75.00,
      costPrice: 50.00,
      minimumQuantity: null,
      parentId: null,
    },
    {
      code: 'SVC002',
      description: 'Technical Support',
      sku: 'SVC-SUPPORT',
      barcode: null,
      unitOfMeasure: 'hour',
      isInventory: false,
      isService: true,
      defaultPrice: 95.00,
      costPrice: 60.00,
      minimumQuantity: null,
      parentId: null,
    },
  ];

  const createdItems = [];
  for (const item of items) {
    const created = await prisma.item.create({ data: item });
    createdItems.push(created);
    console.log(`  ✓ Created item: ${created.code} - ${created.description}`);
  }

  console.log(`✅ Created ${items.length + 2} items (including categories)\n`);

  // 5. Seed Prices (Price Register)
  console.log('💰 Seeding Prices...');
  
  const baseDate = new Date('2024-01-01');
  let pricesCreated = 0;

  for (const item of createdItems) {
    if (item.defaultPrice && !item.isFolder) {
      // Create retail price
      await prisma.priceRegister.create({
        data: {
          date: baseDate,
          itemId: item.id,
          priceType: PriceType.RETAIL,
          price: item.defaultPrice,
          currency: 'USD',
        },
      });

      // Create wholesale price (20% discount)
      await prisma.priceRegister.create({
        data: {
          date: baseDate,
          itemId: item.id,
          priceType: PriceType.WHOLESALE,
          price: item.defaultPrice * 0.8,
          currency: 'USD',
        },
      });

      pricesCreated += 2;
    }
  }

  console.log(`✅ Created ${pricesCreated} price records\n`);

  // 6. Create initial inventory (simulate goods receipts)
  console.log('📥 Creating initial inventory...');
  
  const inventoryItems = createdItems.filter(item => item.isInventory && !item.isFolder);
  const mainWarehouse = createdWarehouses.find(w => w.isDefault);
  
  if (mainWarehouse) {
    for (const item of inventoryItems) {
      const quantity = Math.floor(Math.random() * 50) + 20; // Random qty between 20-70
      const amount = Number(item.costPrice || 0) * quantity;

      await prisma.inventoryRegister.create({
        data: {
          recorder: 'SEED-INITIAL',
          recordType: 'InitialBalance',
          date: baseDate,
          itemId: item.id,
          warehouseId: mainWarehouse.id,
          quantity: quantity,
          amount: amount,
          movementType: 'RECEIPT',
        },
      });

      console.log(`  ✓ Added ${quantity} units of ${item.description} to inventory`);
    }

    console.log(`✅ Created initial inventory for ${inventoryItems.length} items\n`);
  }

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`  - Chart of Accounts: ${chartOfAccounts.length} accounts`);
  console.log(`  - Warehouses: ${warehouses.length}`);
  console.log(`  - Counterparties: ${counterparties.length}`);
  console.log(`  - Items: ${items.length + 2} (including categories)`);
  console.log(`  - Price Records: ${pricesCreated}`);
  console.log(`  - Initial Inventory: ${inventoryItems.length} items`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
