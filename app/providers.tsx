"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useAuth } from "./context/AuthContext";
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

export function RouteProtector({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const protectedPaths = ["/history", "/profile", "/settings"];
    const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));

    if (isProtected && !user) {
      const searchStr = typeof window !== "undefined" ? window.location.search : "";
      router.push(`/login?redirect=${encodeURIComponent(pathname)}${searchStr ? `&${searchStr.slice(1)}` : ""}`);
    }
  }, [user, loading, pathname, router]);

  const protectedPaths = ["/history", "/profile", "/settings"];
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));

  // Show a clean loading state or nothing while redirecting unauthenticated users
  if (isProtected && !user) {
    return (
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center text-ink dark:bg-zinc-950 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
          <p className="text-xs text-zinc-500 font-mono tracking-wider">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

