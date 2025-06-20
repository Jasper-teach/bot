import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorByIndicator(color: string): string {
  const colorMap = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
  };
  
  return colorMap[color as keyof typeof colorMap] || "bg-gray-500";
}

export function getCategoryColor(category: string): string {
  const categoryColorMap = {
    "Game Cheat": "text-red-400",
    "External Tool": "text-orange-400",
    "Utility": "text-blue-400",
    "Loader": "text-yellow-400",
    "Spoofer": "text-purple-400",
  };
  
  return categoryColorMap[category as keyof typeof categoryColorMap] || "text-gray-400";
}
