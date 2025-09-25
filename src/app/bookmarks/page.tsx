import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkCard } from "@/components/BookmarkCard"
import Link from "next/link"
import { BookmarkSchema, type Bookmark } from "@/lib/schemas/bookmark"

export default async function BookmarksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // ✅ BookmarkSchema に合わせて必要なカラムを全取得
  const { data: bookmarks, error } = await supabase
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
      folders (
        id,
        name
      ),
      bookmark_tags (
        tags (
          id,
          name,
          color
        )
      )
    `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("ブックマーク取得エラー:", error)
    return <p className="p-4">読み込みエラーが発生しました。</p>
  }

  // ✅ Zod でバリデーション
  const parsedBookmarks: Bookmark[] = (bookmarks ?? []).map((bm) => BookmarkSchema.parse(bm))

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ブックマーク一覧</h1>
        <Link
          href="/bookmarks/new"
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + 新規追加
        </Link>
      </div>

      {parsedBookmarks.length === 0 ? (
        <div className="text-gray-600">
          まだブックマークがありません。{" "}
          <Link href="/bookmarks/new" className="text-blue-600 underline">
            まずは登録してみる
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {parsedBookmarks.map((bm) => (
            <BookmarkCard key={bm.id} bookmark={bm} />
          ))}
        </div>
      )}
    </div>
  )
}
