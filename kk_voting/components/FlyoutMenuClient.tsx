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
      <div className="fixed right-5 top-5 z-50 flex items-center gap-3">

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
            <motion.div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              className="fixed right-0 top-0 h-full w-[85vw] sm:w-[360px] lg:w-[420px] bg-zinc-950 z-50 p-8 flex flex-col"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="self-end text-zinc-400 hover:text-white mb-10"
              >
                ✕
              </button>

              <div className="flex flex-col gap-6">
                {menuItems.map((item) => {
                  const needsLogin = (item.href === "/vote" || item.href === "/results") && !isLoggedIn;

                  return (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-zinc-100 text-xl font-alt uppercase hover:text-white transition"
                      >
                        {item.label}
                      </Link>

                    </div>
                  );
                })}
              </div>

              <div className="mt-auto text-xs text-zinc-500">
                Королі та Королеви · УКУ
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
