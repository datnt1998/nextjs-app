"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ComponentExample } from "./component-registry";

interface ComponentCardProps {
  component: ComponentExample;
  index: number;
}

export function ComponentCard({ component, index }: ComponentCardProps) {
  return (
    <Card
      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {component.name}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm">
              {component.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize shrink-0">
            {component.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 min-h-[120px] flex items-center justify-center">
          {component.component}
        </div>
      </CardContent>

      {/* Hover effect gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
      </div>
    </Card>
  );
}
