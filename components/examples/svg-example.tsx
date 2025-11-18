/**
 * Example component demonstrating SVGR usage
 *
 * SVGR allows you to import SVG files as React components:
 *
 * import Logo from '@/public/logo.svg'
 *
 * <Logo className="w-6 h-6" />
 *
 * This provides better control over SVG styling and props
 * compared to using <img> tags or next/image.
 */

import NextSvg from "@/public/next.svg";
import VercelSvg from "@/public/vercel.svg";

export function SvgExample() {
  return (
    <div className="flex gap-4 items-center">
      <NextSvg className="w-20 h-20" />
      <VercelSvg className="w-20 h-20" />
    </div>
  );
}
