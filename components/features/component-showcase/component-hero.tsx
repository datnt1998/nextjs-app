"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function ComponentHero() {
  const t = useTranslations("components.showcase.hero");

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-primary">50+</span>{" "}
              {t("stats.components")}
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-primary">100%</span>{" "}
              {t("stats.customizable")}
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-primary">Fully</span>{" "}
              {t("stats.accessible")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
