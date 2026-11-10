import type { NextConfig } from "next";
const pages = process.env.POLARIS_STATIC_EXPORT === "1";
const basePath = pages ? "/Polaris-official-website" : "";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(pages ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  images: { unoptimized: pages },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
