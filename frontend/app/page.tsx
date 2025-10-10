export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ERP/Accounting System</h1>
        <p className="text-muted-foreground mb-8">
          Modular business management platform inspired by 1C:Enterprise architecture
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 hover:border-primary transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Catalogs</h2>
            <p className="text-muted-foreground mb-4">
              Manage reference data: counterparties, items, warehouses
            </p>
            <div className="space-y-2">
              <a href="/catalogs/counterparty" className="block text-primary hover:underline">
                → Counterparties
              </a>
              <a href="/catalogs/item" className="block text-primary hover:underline">
                → Items
              </a>
              <a href="/catalogs/warehouse" className="block text-primary hover:underline">
                → Warehouses
              </a>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:border-primary transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Documents</h2>
            <p className="text-muted-foreground mb-4">
              Create and post business transactions
            </p>
            <div className="space-y-2">
              <a href="/documents/goods-sale" className="block text-primary hover:underline">
                → Goods Sale
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
