import { KitAccessProvider } from "@/components/feedback/kit-access";
import { publicPath } from "@/lib/public-path";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const editorial = localFont({
  src: "../styles/fonts/dm-serif-display-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--loaded-font-editorial",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});
const body = localFont({
  src: [
    { path: "../styles/fonts/source-sans-3-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/source-sans-3-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../styles/fonts/source-sans-3-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--loaded-font-body",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: { default: "Kyro Learning", template: "%s | Kyro Learning" },
  // Keep previews non-indexable until content, assets and submission service are approved.
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: publicPath("/icon.svg"), type: "image/svg+xml" }, { url: publicPath("/favicon.ico"), sizes: "16x16 32x32 48x48", type: "image/x-icon" }],
    apple: [{ url: publicPath("/apple-icon.png"), sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${editorial.variable} ${body.variable}`}><body><KitAccessProvider><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></KitAccessProvider></body></html>;
}
