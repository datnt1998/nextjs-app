"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function ComponentNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: ComponentNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "capitalize transition-all duration-200",
                selectedCategory === category
                  ? "shadow-lg shadow-primary/20"
                  : "hover:bg-primary/10",
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
