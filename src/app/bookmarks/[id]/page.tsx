import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditBookmarkForm } from "@/components/EditBookmarkForm"
import { BookmarkSchema, type Bookmark, type Tag } from "@/lib/schemas/bookmark"

export default async function EditBookmarkPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 編集対象のブックマークを取得（タグ付き）
  const { data: bookmark, error: bookmarkError } = await supabase
    .from("bookmarks")
    .select(
      `
    id,
    url,
    title,
    description,
    og_image_url,
    is_favorite,
    created_at,
    updated_at,
    bookmark_tags (
      tags (
        id,
        name,
        color
      )
    )
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single()

  if (bookmarkError || !bookmark) {
    console.error("ブックマーク取得エラー:", bookmarkError)
    redirect("/bookmarks")
  }

  // ✅ zodでバリデーション＆型推論
  const parsedBookmark: Bookmark = BookmarkSchema.parse(bookmark)

  // ユーザーの全タグ一覧を取得
  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (tagsError) {
    console.error("タグ一覧取得エラー:", tagsError)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ブックマーク編集</h1>
      <EditBookmarkForm bookmark={parsedBookmark} availableTags={(tags as Tag[]) ?? []} />
    </div>
  )
}
