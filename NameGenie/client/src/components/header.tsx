import { Search, Bell, Settings, Hash, Folder, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-[var(--discord-darker)] border-b border-[var(--discord-gray)] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-[var(--discord-blue)] rounded-full w-8 h-8 flex items-center justify-center text-white font-bold relative">
          E
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            99
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-[var(--discord-muted)]" />
          <Folder className="h-4 w-4 text-[var(--discord-muted)]" />
          <span className="text-white font-semibold">Existence-Downloads</span>
          <ChevronRight className="h-3 w-3 text-[var(--discord-muted)]" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="text-[var(--discord-muted)] hover:text-[var(--discord-text)] p-2">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[var(--discord-muted)] hover:text-[var(--discord-text)] p-2">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[var(--discord-muted)] hover:text-[var(--discord-text)] p-2">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
