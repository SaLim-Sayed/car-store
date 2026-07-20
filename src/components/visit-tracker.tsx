"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "car_store_visit_sid";

function getSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing && existing.length >= 8) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

function shouldTrack(pathname: string | null) {
  if (!pathname) return false;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth")
  ) {
    return false;
  }
  return true;
}

/** Records public page visits for admin dashboard analytics. */
export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastKey = useRef("");

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname || "/";
    const key = path;
    if (lastKey.current === key) return;
    lastKey.current = key;

    const payload = {
      path,
      sessionId: getSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    };

    const body = JSON.stringify(payload);

    // Prefer sendBeacon for reliability on navigation
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track/visit", blob);
      return;
    }

    void fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
