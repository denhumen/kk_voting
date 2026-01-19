import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import LoginFormClient from "./LoginFormClient";

export default async function LoginPage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // already logged in → go vote
  if (user) redirect("/vote");

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-50 flex items-center justify-center px-6">
      <LoginFormClient />
    </main>
  );
}