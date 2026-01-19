"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const path =
        localStorage.getItem("auth-return-path") ||
        sessionStorage.getItem("auth-return-path") ||
        "/";

    localStorage.removeItem("auth-return-path");

    router.replace(path);
  }, []);

  return null;
}