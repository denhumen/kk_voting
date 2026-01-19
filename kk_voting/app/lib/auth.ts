import { createClient } from "@/utils/supabase/client";

export async function signInWithGoogle() {
  const supabase = createClient();
  const returnTo = window.location.pathname;
  localStorage.setItem("auth-return-path", returnTo);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback}`,
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
  }
}