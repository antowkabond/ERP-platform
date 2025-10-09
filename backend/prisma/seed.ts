import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.accountingEntry.deleteMany();
  await prisma.financialRegister.deleteMany();
  await prisma.inventoryRegister.deleteMany();
  await prisma.priceRegister.deleteMany();
  await prisma.goodsSaleItem.deleteMany();
  await prisma.goodsSale.deleteMany();
  await prisma.item.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.counterparty.deleteMany();
  await prisma.chartOfAccounts.deleteMany();

  // 1. Create Chart of Accounts
  console.log('📊 Creating Chart of Accounts...');
  const accountsReceivable = await prisma.chartOfAccounts.create({
    data: {
      code: '1200',
      name: 'Accounts Receivable',
      description: 'Accounts Receivable',
      accountType: 'ASSET',
      isActive: true,
    },
  });

  const inventory = await prisma.chartOfAccounts.create({
    data: {
      code: '1300',
      name: 'Inventory',
      description: 'Inventory',
      accountType: 'ASSET',
      isActive: true,
    },
  });

  const accountsPayable = await prisma.chartOfAccounts.create({
    data: {
      code: '2100',
      name: 'Accounts Payable',
      description: 'Accounts Payable',
      accountType: 'LIABILITY',
      isActive: true,
    },
  });

  const revenue = await prisma.chartOfAccounts.create({
    data: {
      code: '4000',
      name: 'Sales Revenue',
      description: 'Sales Revenue',
      accountType: 'REVENUE',
      isActive: true,
    },
  });

  const cogs = await prisma.chartOfAccounts.create({
    data: {
      code: '5000',
      name: 'Cost of Goods Sold',
      description: 'Cost of Goods Sold',
      accountType: 'EXPENSE',
      isActive: true,
    },
  });

  console.log(`✅ Created ${5} chart of accounts`);

  // 2. Create Warehouses
  console.log('🏭 Creating Warehouses...');
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      code: 'WH001',
      description: 'Main Warehouse',
      address: '123 Storage St, New York, NY',
      responsiblePerson: 'John Smith',
      isDefault: true,
      isActive: true,
    },
  });

  const retailWarehouse = await prisma.warehouse.create({
    data: {
      code: 'WH002',
      description: 'Retail Store',
      address: '456 Market Ave, New York, NY',
      responsiblePerson: 'Jane Doe',
      isActive: true,
    },
  });

  console.log(`✅ Created ${2} warehouses`);

  // 3. Create Counterparties (Customers & Suppliers)
  console.log('👥 Creating Counterparties...');
  const customer1 = await prisma.counterparty.create({
    data: {
      code: 'CUST001',
      description: 'ABC Corporation',
      taxNumber: 'TAX-123456',
      address: '789 Business Blvd, New York, NY',
      contactPhone: '+1-555-0200',
      contactEmail: 'contact@abc-corp.com',
      isCustomer: true,
      isSupplier: false,
      creditLimit: 50000,
      isActive: true,
    },
  });

  const customer2 = await prisma.counterparty.create({
    data: {
      code: 'CUST002',
      description: 'XYZ Industries',
      taxNumber: 'TAX-789012',
      address: '321 Commerce Dr, Boston, MA',
      contactPhone: '+1-555-0201',
      contactEmail: 'sales@xyz-ind.com',
      isCustomer: true,
      isSupplier: false,
      creditLimit: 75000,
      isActive: true,
    },
  });

  const supplier1 = await prisma.counterparty.create({
    data: {
      code: 'SUPP001',
      description: 'Tech Supplies Inc',
      taxNumber: 'TAX-345678',
      address: '555 Vendor Way, San Francisco, CA',
      contactPhone: '+1-555-0300',
      contactEmail: 'orders@techsupplies.com',
      isCustomer: false,
      isSupplier: true,
      isActive: true,
    },
  });

  console.log(`✅ Created ${3} counterparties`);

  // 4. Create Items (Products)
  console.log('📦 Creating Items...');
  const laptop = await prisma.item.create({
    data: {
      code: 'ITEM001',
      description: 'Laptop Dell XPS 15',
      unitOfMeasure: 'pcs',
      defaultPrice: 1299.99,
      costPrice: 999.99,
      sku: 'DELL-XPS15-2024',
      isInventory: true,
      isService: false,
      isActive: true,
    },
  });

  const monitor = await prisma.item.create({
    data: {
      code: 'ITEM002',
      description: 'Monitor LG 27" 4K',
      unitOfMeasure: 'pcs',
      defaultPrice: 399.99,
      costPrice: 299.99,
      sku: 'LG-27UK850',
      isInventory: true,
      isService: false,
      isActive: true,
    },
  });

  const keyboard = await prisma.item.create({
    data: {
      code: 'ITEM003',
      description: 'Mechanical Keyboard',
      unitOfMeasure: 'pcs',
      defaultPrice: 129.99,
      costPrice: 89.99,
      sku: 'KB-MECH-RGB',
      isInventory: true,
      isService: false,
      isActive: true,
    },
  });

  const mouse = await prisma.item.create({
    data: {
      code: 'ITEM004',
      description: 'Wireless Mouse',
      unitOfMeasure: 'pcs',
      defaultPrice: 49.99,
      costPrice: 29.99,
      sku: 'MOUSE-WL-001',
      isInventory: true,
      isService: false,
      isActive: true,
    },
  });

  const headset = await prisma.item.create({
    data: {
      code: 'ITEM005',
      description: 'Gaming Headset',
      unitOfMeasure: 'pcs',
      defaultPrice: 89.99,
      costPrice: 59.99,
      sku: 'HS-GAME-001',
      isInventory: true,
      isService: false,
      isActive: true,
    },
  });

  console.log(`✅ Created ${5} items`);

  // 5. Create Price Register (current prices)
  console.log('💰 Creating Price Register entries...');
  const priceDate = new Date();

  await prisma.priceRegister.create({
    data: {
      date: priceDate,
      itemId: laptop.id,
      priceType: 'RETAIL',
      price: 1299.99,
      currency: 'USD',
    },
  });

  await prisma.priceRegister.create({
    data: {
      date: priceDate,
      itemId: monitor.id,
      priceType: 'RETAIL',
      price: 399.99,
      currency: 'USD',
    },
  });

  await prisma.priceRegister.create({
    data: {
      date: priceDate,
      itemId: keyboard.id,
      priceType: 'RETAIL',
      price: 129.99,
      currency: 'USD',
    },
  });

  await prisma.priceRegister.create({
    data: {
      date: priceDate,
      itemId: mouse.id,
      priceType: 'RETAIL',
      price: 49.99,
      currency: 'USD',
    },
  });

  await prisma.priceRegister.create({
    data: {
      date: priceDate,
      itemId: headset.id,
      priceType: 'RETAIL',
      price: 89.99,
      currency: 'USD',
    },
  });

  console.log(`✅ Created ${5} price register entries`);

  // 6. Create initial inventory (simulate some goods receipts)
  console.log('📥 Creating initial inventory...');
  
  // Simulate inventory in main warehouse
  await prisma.inventoryRegister.create({
    data: {
      recorder: 'INITIAL',
      recordType: 'Initial',
      date: new Date('2025-01-01'),
      itemId: laptop.id,
      warehouseId: mainWarehouse.id,
      quantity: 50,
      amount: 50 * 1000, // Cost price
      movementType: 'RECEIPT',
    },
  });

  await prisma.inventoryRegister.create({
    data: {
      recorder: 'INITIAL',
      recordType: 'Initial',
      date: new Date('2025-01-01'),
      itemId: monitor.id,
      warehouseId: mainWarehouse.id,
      quantity: 100,
      amount: 100 * 300,
      movementType: 'RECEIPT',
    },
  });

  await prisma.inventoryRegister.create({
    data: {
      recorder: 'INITIAL',
      recordType: 'Initial',
      date: new Date('2025-01-01'),
      itemId: keyboard.id,
      warehouseId: mainWarehouse.id,
      quantity: 200,
      amount: 200 * 80,
      movementType: 'RECEIPT',
    },
  });

  await prisma.inventoryRegister.create({
    data: {
      recorder: 'INITIAL',
      recordType: 'Initial',
      date: new Date('2025-01-01'),
      itemId: mouse.id,
      warehouseId: mainWarehouse.id,
      quantity: 300,
      amount: 300 * 30,
      movementType: 'RECEIPT',
    },
  });

  await prisma.inventoryRegister.create({
    data: {
      recorder: 'INITIAL',
      recordType: 'Initial',
      date: new Date('2025-01-01'),
      itemId: headset.id,
      warehouseId: mainWarehouse.id,
      quantity: 150,
      amount: 150 * 60,
      movementType: 'RECEIPT',
    },
  });

  console.log(`✅ Created ${5} initial inventory movements`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - Chart of Accounts: 5');
  console.log('   - Warehouses: 2');
  console.log('   - Counterparties: 3 (2 customers, 1 supplier)');
  console.log('   - Items: 5');
  console.log('   - Price Register: 5 entries');
  console.log('   - Initial Inventory: 5 movements');
  console.log('\n🎯 Ready to create and post documents!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
