"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthOverlayContext";

type Props = {
  isLoggedIn: boolean;
  name?: string;
  avatar?: string | null;
};

export default function AuthStatusBadge({
  isLoggedIn,
  name,
  avatar,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const overlay = useAuthOverlay();

  async function handleLogout() {
    setLoading(true);
    overlay.show("Signing out...");

    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleLogin() {
    setLoading(true);
    overlay.show("Redirecting to Google...");

    const returnTo =
        window.location.pathname +
        window.location.search +
        window.location.hash;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    });
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 backdrop-blur px-4 py-2 text-zinc-100 hover:bg-zinc-800 transition"
      >
        {loading ? (
            <div className="h-4 w-4 border border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
            <img src="/logos/google_logo.svg" className="h-4 w-4" />
        )}
        <span className="text-xs font-alt uppercase tracking-wide">
          Login with Google
        </span>
      </button>
    );
  }

  return (
    <div className="relative md:block">
      {/* BADGE */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/60 backdrop-blur px-3 py-1.5 hover:bg-zinc-800 transition"
      >
        <span className="text-xs text-zinc-300 font-main">
          Logged in as
          <span className="ml-1 font-semibold text-zinc-100">
            {name}
          </span>
        </span>

        {avatar && (
          <img
            src={avatar}
            alt="Profile"
            className="h-7 w-7 rounded-full border border-zinc-600 object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 shadow-xl overflow-hidden"
          >
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full px-4 py-3 text-left text-sm font-alt uppercase tracking-wide text-red-400 hover:bg-zinc-900 transition"
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}