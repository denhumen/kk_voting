import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  const origin = url.origin;

  if (code) {
    const supabase = createClient(cookies());
    await supabase.auth.exchangeCodeForSession(code);

    const { data } = await supabase.auth.getUser();
    const email = data.user?.email ?? "";
    const canVote = email.endsWith("@ucu.edu.ua") ? "1" : "0";

    const nextUrl = new URL(`${origin}${next}`);
    nextUrl.searchParams.set("toast", "login");
    nextUrl.searchParams.set("canVote", canVote);

    return NextResponse.redirect(nextUrl.toString());
  }

  return NextResponse.redirect(`${origin}${next}`);
}
