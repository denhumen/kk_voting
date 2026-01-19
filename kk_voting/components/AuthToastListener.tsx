"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthToastListener() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastType = searchParams.get("toast");
    if (!toastType) return;

    const canVote = searchParams.get("canVote");

    if (toastType === "login") {
      if (canVote === "1") {
        toast.success("Вхід успішний ✅ Ти можеш голосувати.", { id: "auth-login" });
      } else if (canVote === "0") {
        toast.warning("Вхід успішний, але голосувати можна лише з @ucu.edu.ua", { id: "auth-login" });
      } else {
        toast.success("Вхід успішний ✅", { id: "auth-login" });
      }
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    next.delete("canVote");

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}