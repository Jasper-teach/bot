import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductModal({ products, isOpen, onClose, onSelectProduct }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--discord-gray)] border-[var(--discord-light)] max-w-md text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center justify-between">
            Select a product
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[var(--discord-muted)] hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--discord-dark)] rounded p-3 hover:bg-[var(--discord-light)] cursor-pointer transition-colors"
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
              >
                <h3 className="text-white font-medium">{product.name}</h3>
                <p className="text-[var(--discord-muted)] text-sm">{product.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
