"use server";

import { createClient } from "@/lib/supabase/server";

type BookmarkInput = {
  id?: number;
  url: string;
  title: string;
  description: string;
  og_image_url?: string;
  tagIds?: number[];
};

export async function addBookmark(input: BookmarkInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  // ブックマーク作成
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      url: input.url,
      title: input.title,
      description: input.description,
      og_image_url: input.og_image_url,
    })
    .select("id");

  if (error) throw error;

  const bookmark = bookmarks?.[0];
  if (!bookmark) throw new Error("ブックマーク作成に失敗しました");

  // タグが指定されていれば bookmark_tags に追加
  if (input.tagIds && input.tagIds.length > 0) {
    const rows = input.tagIds.map((tagId) => ({
      bookmark_id: bookmark.id,
      tag_id: tagId,
    }));
    const { error: tagError } = await supabase
      .from("bookmark_tags")
      .insert(rows);
    if (tagError) throw tagError;
  }
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

  if (input.tagIds) {
    await supabase
      .from("bookmark_tags")
      .delete()
      .eq("bookmark_id", input.id);

    if (input.tagIds.length > 0) {
      const rows = input.tagIds.map((tagId) => ({
        bookmark_id: input.id,
        tag_id: tagId,
      }));
      const { error: tagError } = await supabase
        .from("bookmark_tags")
        .insert(rows);
      if (tagError) throw tagError;
    }
  }
}

export async function deleteBookmark(id: number) {
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

export async function addTag(name: string, color?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { data, error } = await supabase
    .from("tags")
    .insert({ user_id: user.id, name, color })
    .select()
    .single();

  if (error) throw error;
  return data;
}