"use client";

import { track } from "@vercel/analytics/react";

export function trackEvent(name: string, props?: Record<string, any>) {
  track(name, props);
}