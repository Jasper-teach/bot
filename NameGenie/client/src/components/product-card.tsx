import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getColorByIndicator, getCategoryColor } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onDownload?: (product: Product) => void;
}

export default function ProductCard({ product, onDownload }: ProductCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(product);
    }
  };

  return (
    <Card className="bg-[var(--discord-gray)] border-[var(--discord-light)] hover:bg-[var(--discord-light)] transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`${getColorByIndicator(product.colorIndicator)} rounded w-3 h-3`}></div>
          <h3 className="text-white font-semibold">{product.name}</h3>
        </div>
        <p className="text-[var(--discord-muted)] text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          <Button
            size="sm"
            className="bg-[var(--discord-blue)] hover:bg-[var(--discord-blue-dark)] text-white"
            onClick={handleDownload}
          >
            {product.category === "Loader" ? "Access" : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
