"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ComponentCard } from "./component-card";
import { ComponentHero } from "./component-hero";
import { ComponentNav } from "./component-nav";
import { componentRegistry } from "./component-registry";

export function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "all",
    ...Array.from(new Set(componentRegistry.map((c) => c.category))),
  ];

  const filteredComponents = componentRegistry.filter((component) => {
    const matchesCategory =
      selectedCategory === "all" || component.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400/15 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative">
        <ComponentHero />

        {/* Navigation */}
        <ComponentNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-slate-200"
            />
          </div>
        </div>

        {/* Component Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component, index) => (
              <ComponentCard
                key={component.id}
                component={component}
                index={index}
              />
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-24">
              <p className="text-slate-600 text-lg">
                No components found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
