import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import LoginRequiredBadge from "./LoginRequiredBadge";

export async function VoteMenuItem({ children }: { children: React.ReactNode }) {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-between">
      {children}

      {!user && <LoginRequiredBadge />}
    </div>
  );
}

export async function ResultsMenuItem({ children }: { children: React.ReactNode }) {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-between">
      {children}

      {!user && <LoginRequiredBadge />}
    </div>
  );
}