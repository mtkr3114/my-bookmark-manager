"use server";

import { createClient } from "@/lib/supabase/server";

export async function addTag(name: string, color?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("tags").insert({
    user_id: user.id,
    name,
    color,
  });

  if (error) throw error;
}

export async function updateTag(id: number, name: string, color?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("tags")
    .update({ name, color })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function deleteTag(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
