import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type Category = {
  id: string;
  title: string;
  sort_order: number | null;
};

export type Candidate = {
  id: string;
  full_name: string;
  city: string;
  photo_url: string | null;
  short_description: string;
  long_description: string;
  is_published: boolean;
  category_id: string;
  is_wide: boolean;
  created_at: string;
};

export async function getCategories() {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("categories")
    .select("id,title,sort_order")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Category[];
}

export async function getCandidates() {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("candidates")
    .select("id,category_id,full_name,city,photo_url,short_description,long_description,is_published,is_wide,created_at")
    .order("created_at", { ascending: false });
  
  console.log("Data: " + data);

  if (error) throw new Error(error.message);
  return data as Candidate[];
}

export async function getCandidateById(id: string) {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("candidates")
    .select("id,full_name,city,photo_url,short_description,long_description,category_id,is_wide,created_at")
    .eq("id", id)
    .single();

  if (error) return null; // для notFound()
  return data as Candidate;
}