"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LoginRequiredBadge from "./LoginRequiredBadge";
import AuthStatusBadgeClient from "./AuthStatusBadgeClient";

type Props = {
  isLoggedIn: boolean;
  displayName: string | null;
  avatarUrl: string | null;
};

const menuItems = [
  { label: "Головна", href: "/" },
  { label: "Деталі", href: "/details" },
  { label: "Кандидати", href: "/candidates" },
  { label: "Голосування", href: "/vote" },
  { label: "Результати", href: "/results" },
];

export default function FlyoutMenuClient({ isLoggedIn, displayName, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
      <>
        {/* 1. BUTTON CONTAINER
        Increased to z-[60] to sit above sticky headers (usually z-40/50)
      */}
        <div className="fixed right-5 top-5 z-[60] flex items-center gap-3">

          <AuthStatusBadgeClient
              isLoggedIn={isLoggedIn}
              name={displayName ?? undefined}
              avatar={avatarUrl}
          />

          <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-zinc-900/80 backdrop-blur px-4 py-2 text-zinc-100 border border-zinc-700 hover:bg-zinc-800 transition"
          >
            ☰
          </button>
        </div>

        <AnimatePresence>
          {open && (
              <>
                {/* 2. BACKDROP
              Changed z-40 -> z-[90]
              This ensures the dark background covers the "Vote" badges (z-50)
            */}
                <motion.div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* 3. MENU PANEL
              Changed z-50 -> z-[100]
              This ensures the menu itself is the highest item on the entire page
            */}
                <motion.nav
                    className="fixed right-0 top-0 h-full w-[85vw] sm:w-[360px] lg:w-[420px] bg-zinc-950 z-[100] p-8 flex flex-col shadow-2xl border-l border-zinc-800"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <button
                      onClick={() => setOpen(false)}
                      className="self-end p-2 text-zinc-400 hover:text-white mb-6 transition"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col gap-6 mt-10">
                    {menuItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3">
                          <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="text-zinc-100 text-2xl font-alt uppercase hover:text-amber-500 transition tracking-wide"
                          >
                            {item.label}
                          </Link>
                        </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-10 border-t border-zinc-900 text-xs text-zinc-500 font-mono uppercase tracking-widest">
                    Королі та Королеви · УКУ
                  </div>
                </motion.nav>
              </>
          )}
        </AnimatePresence>
      </>
  );
}