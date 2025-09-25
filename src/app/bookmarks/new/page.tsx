import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkForm } from "@/components/BookmarkForm"
import type { Tag } from "@/lib/schemas/bookmark"

export default async function NewBookmarkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // ユーザーのタグ一覧を取得
  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("タグ取得失敗:", error)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">新規ブックマーク</h1>
      <BookmarkForm availableTags={(tags as Tag[]) ?? []} />
    </div>
  )
}
