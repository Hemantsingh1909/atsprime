"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "../sentry.client.config";

const isTestingEnvironment = (): boolean => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("mock_auth") === "true" || !!(window.navigator as any).webdriver;
  }
  return false;
};

const isPlaceholderKey = (key: string | undefined): boolean => {
  return !key || 
         key === "phc_placeholder_key_for_testing" || 
         !key.startsWith("phc_") || 
         isTestingEnvironment();
};

if (typeof window !== "undefined") {
  const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  (window as any).__POSTHOG_KEY__ = phKey;
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  
  if (phKey && !isPlaceholderKey(phKey)) {
    posthog.init(phKey, {
      api_host: phHost,
      capture_pageview: false, // Pageviews are tracked manually to ensure SPA routing counts correctly
      capture_pageleave: true,
      loaded: (posthogInstance) => {
        if (process.env.NODE_ENV === "development") {
          posthogInstance.debug(); // Enable debug logging in development for easy verification
        }
      },
    });
    (window as any).posthog = posthog;
  }
}

// Router pageview listener component
function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (pathname && typeof window !== "undefined" && phKey && !isPlaceholderKey(phKey)) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <ReactLenis root>
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
        {children}
      </ReactLenis>
    </PostHogProvider>
  );
}

