"use client";

import { createClient } from "@/utils/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthOverlayContext";

export default function LoginFormClient() {
  const supabase = createClient();
  const overlay = useAuthOverlay();

  async function handleLogin() {
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

  return (
    <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur p-8 shadow-lg">
      <h1 className="mt-3 text-3xl md:text-4xl font-alt">
        Вхід для голосування
      </h1>

      <p className="mt-4 text-zinc-300 font-main leading-relaxed">
        Щоб проголосувати, потрібно увійти через Google-акаунт УКУ
        <span className="font-semibold"> (@ucu.edu.ua)</span>.
      </p>

      <button
        onClick={handleLogin}
        className="mt-7 w-full rounded-full bg-zinc-100 text-zinc-900 px-6 py-3 text-sm md:text-base font-alt font-semibold uppercase tracking-wide hover:bg-white transition"
      >
        Увійти через Google
      </button>
    </div>
  );
}