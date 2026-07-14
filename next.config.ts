import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    "pdfjs-dist",
    "playwright-core",
    "@sparticuz/chromium-min",
    "@playwright/test",
  ],
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during bundling
  silent: true,
  org: "atsprime",
  project: "nextjs",

  // Uploads a larger set of source maps for clearer stack traces
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",

  // Automatically tree-shakes Sentry logger statements to save client bundle sizes
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
