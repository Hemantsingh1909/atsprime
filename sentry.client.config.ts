import * as Sentry from "@sentry/nextjs";

const envDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const isPlaceholder = !envDsn || envDsn.includes("placeholder") || envDsn === "your_sentry_dsn_here";
const finalDsn = isPlaceholder ? "https://placeholder@sentry.io/123456" : envDsn;

Sentry.init({
  dsn: finalDsn,
  
  // Discard all envelope transmissions silently when configured with a placeholder DSN
  ...(isPlaceholder ? {
    transport: () => ({
      send: () => Promise.resolve({ statusCode: 200 }),
      flush: () => Promise.resolve(true),
    }),
  } : {}),
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample less in production
  replaysSessionSampleRate: 0.1,
});
