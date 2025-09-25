"use server";

import { createClient } from "@/lib/supabase/server";

type BookmarkInput = {
  id?: string;
  url: string;
  title: string;
  description: string;
  og_image_url?: string;
};

export async function addBookmark(input: BookmarkInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    url: input.url,
    title: input.title,
    description: input.description,
    og_image_url: input.og_image_url,
  });

  if (error) throw error;
}
export async function updateBookmark(input: BookmarkInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("bookmarks")
    .update({
      url: input.url,
      title: input.title,
      description: input.description,
      og_image_url: input.og_image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("bookmarks")
    .update({ deleted_at: new Date().toISOString() }) // 論理削除
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}