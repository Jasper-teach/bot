import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, Bot } from "lucide-react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("Select a product");
  const { toast } = useToast();

  // Fetch products based on current filters
  const getApiUrl = () => {
    if (selectedFilter === "featured") return "/api/products/filter/featured";
    if (selectedFilter === "popular") return "/api/products/filter/popular";
    if (selectedCategory) return `/api/products/category/${selectedCategory}`;
    return "/api/products";
  };

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [getApiUrl()],
  });

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    searchQuery === "" ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (product: Product) => {
    toast({
      title: "Download Started",
      description: `${product.name} download has been initiated.`,
    });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product.name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--discord-dark)]">
        <Header />
        <div className="flex">
          <Sidebar
            onCategorySelect={setSelectedCategory}
            onFilterSelect={setSelectedFilter}
            selectedCategory={selectedCategory}
            selectedFilter={selectedFilter}
          />
          <main className="flex-1 p-6">
            <div className="text-center text-[var(--discord-muted)]">Loading products...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--discord-dark)]">
      <Header />
      <div className="flex">
        <Sidebar
          onCategorySelect={setSelectedCategory}
          onFilterSelect={setSelectedFilter}
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="bg-[var(--discord-blue)] rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
                E
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-2">Welcome to Existence Downloads!</h1>
                <p className="text-[var(--discord-muted)]">
                  This is the start of the <span className="text-white">#📁 | Existence-Downloads</span> channel.
                </p>
              </div>
            </div>

            {/* Bot Message Section */}
            <Card className="bg-[var(--discord-gray)] border-[var(--discord-light)] mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--discord-blue)] rounded-lg w-10 h-10 flex items-center justify-center text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white font-semibold">Existence Loader</span>
                      <span className="bg-[var(--discord-blue)] text-white text-xs px-2 py-1 rounded">BOT</span>
                      <span className="text-[var(--discord-muted)] text-sm">Today at 10:15 PM</span>
                    </div>
                    <Card className="bg-[var(--discord-dark)] border-[var(--discord-gray)]">
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2">Product Loader</h3>
                        <p className="text-[var(--discord-muted)] mb-4">
                          Please select a product from the dropdown menu below to view download links for our available products.
                        </p>
                        
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-[var(--discord-light)] hover:bg-[var(--discord-gray)] text-white w-full flex items-center justify-between"
                        >
                          <span>{selectedProduct}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--discord-darker)] border-[var(--discord-light)] pl-10 text-[var(--discord-text)] placeholder:text-[var(--discord-muted)] focus:border-[var(--discord-blue)]"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--discord-muted)]" />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center text-[var(--discord-muted)] py-8">
                {searchQuery ? "No products found matching your search." : "No products available."}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                  <Button className="bg-[var(--discord-blue)] hover:bg-[var(--discord-blue-dark)] text-white px-6 py-3">
                    Load More Products
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Product Selection Modal */}
      <ProductModal
        products={products}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={handleProductSelect}
      />
    </div>
  );
}
