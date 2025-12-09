"use client";

import { trackEvent } from "@/app/lib/track";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  href: string;
  event: string;
  eventData?: Record<string, any>;
  children: ReactNode;
  className?: string;
}

export default function AnalyticsButton({
  href,
  event,
  eventData,
  children,
  className,
}: Props) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent(event, eventData)}
      className={className}
    >
      {children}
    </Link>
  );
}
