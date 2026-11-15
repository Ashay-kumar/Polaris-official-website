import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Private-review release lock: activation requires a separately reviewed source change.
  env: { NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED: "false" },
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
