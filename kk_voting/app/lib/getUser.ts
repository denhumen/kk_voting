import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getUser() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}