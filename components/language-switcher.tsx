"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { usePathname } from "@/i18n/routing";
import { setLocaleCookie } from "@/lib/i18n/locale-cookie";

interface LanguageSwitcherProps {
  /**
   * Whether to show the language icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
}

export function LanguageSwitcher({
  showIcon = true,
  className,
}: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Set the locale preference cookie for persistence
    setLocaleCookie(newLocale as Locale);

    // Get current search params and hash
    const searchParams = window.location.search;
    const hash = window.location.hash;

    // Build the new URL with the new locale
    // pathname from next-intl's usePathname is already locale-agnostic (without locale prefix)
    const newUrl = `/${newLocale}${pathname}${searchParams}${hash}`;

    // Use window.location for full page reload to ensure translations update
    window.location.href = newUrl;
  };

  return (
    <div className={className || "flex items-center gap-2"}>
      {showIcon && <Languages className="size-4 text-muted-foreground" />}
      <Select value={locale} onValueChange={switchLocale}>
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
