"use client";

import { createContext, useContext, useState } from "react";

type OverlayState = {
  show: (message?: string) => void;
  hide: () => void;
};

const AuthOverlayContext = createContext<OverlayState | null>(null);

export function AuthOverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");

  function show(msg?: string) {
    setMessage(msg ?? "Loading...");
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  return (
    <AuthOverlayContext.Provider value={{ show, hide }}>
      {children}

      {/* Overlay UI */}
      {visible && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />

            <p className="text-sm font-alt uppercase tracking-widest text-zinc-200">
              {message}
            </p>
          </div>
        </div>
      )}
    </AuthOverlayContext.Provider>
  );
}

export function useAuthOverlay() {
  const ctx = useContext(AuthOverlayContext);
  if (!ctx) throw new Error("useAuthOverlay must be inside AuthOverlayProvider");
  return ctx;
}