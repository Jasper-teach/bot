import { Download, Star, Flame, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCategorySelect: (category: string | null) => void;
  onFilterSelect: (filter: string | null) => void;
  selectedCategory: string | null;
  selectedFilter: string | null;
}

export default function Sidebar({ onCategorySelect, onFilterSelect, selectedCategory, selectedFilter }: SidebarProps) {
  const categories = [
    "Game Cheat",
    "External Tool", 
    "Loader",
    "Spoofer",
    "Utility"
  ];

  return (
    <aside className="bg-[var(--discord-darker)] w-64 hidden lg:block border-r border-[var(--discord-gray)]">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[var(--discord-blue)] rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Existence</h1>
            <p className="text-[var(--discord-muted)] text-sm">Premium Downloads</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-3 p-2 text-left",
              !selectedFilter && !selectedCategory
                ? "bg-[var(--discord-light)] text-white"
                : "text-[var(--discord-text)] hover:bg-[var(--discord-light)]"
            )}
            onClick={() => {
              onFilterSelect(null);
              onCategorySelect(null);
            }}
          >
            <Download className="h-4 w-4" />
            <span>All Downloads</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-3 p-2 text-left",
              selectedFilter === "featured"
                ? "bg-[var(--discord-light)] text-white"
                : "text-[var(--discord-text)] hover:bg-[var(--discord-light)]"
            )}
            onClick={() => {
              onFilterSelect("featured");
              onCategorySelect(null);
            }}
          >
            <Star className="h-4 w-4" />
            <span>Featured</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-3 p-2 text-left",
              selectedFilter === "popular"
                ? "bg-[var(--discord-light)] text-white"
                : "text-[var(--discord-text)] hover:bg-[var(--discord-light)]"
            )}
            onClick={() => {
              onFilterSelect("popular");
              onCategorySelect(null);
            }}
          >
            <Flame className="h-4 w-4" />
            <span>Popular</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 p-2 text-left text-[var(--discord-text)] hover:bg-[var(--discord-light)]"
          >
            <Clock className="h-4 w-4" />
            <span>Recent</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 p-2 text-left text-[var(--discord-text)] hover:bg-[var(--discord-light)]"
          >
            <User className="h-4 w-4" />
            <span>My Downloads</span>
          </Button>
        </nav>

        <div className="mt-8">
          <h3 className="text-[var(--discord-muted)] text-xs uppercase font-semibold mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm py-1 px-2 h-auto",
                  selectedCategory === category
                    ? "text-white bg-[var(--discord-light)]"
                    : "text-[var(--discord-muted)] hover:text-[var(--discord-text)]"
                )}
                onClick={() => {
                  onCategorySelect(category);
                  onFilterSelect(null);
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
