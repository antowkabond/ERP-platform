import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">ERP</span>
              <span className="text-2xl font-light ml-1">System</span>
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              <div className="relative group">
                <Button variant="ghost" className="font-medium">
                  Catalogs
                </Button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border hidden group-hover:block z-10">
                  <div className="py-1">
                    <Link href="/catalogs/counterparty" className="block px-4 py-2 text-sm hover:bg-accent">
                      Counterparties
                    </Link>
                    <Link href="/catalogs/item" className="block px-4 py-2 text-sm hover:bg-accent">
                      Items
                    </Link>
                    <Link href="/catalogs/warehouse" className="block px-4 py-2 text-sm hover:bg-accent">
                      Warehouses
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Button variant="ghost" className="font-medium">
                  Documents
                </Button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border hidden group-hover:block z-10">
                  <div className="py-1">
                    <Link href="/documents/goods-sale" className="block px-4 py-2 text-sm hover:bg-accent">
                      Goods Sale
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
