import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkCard } from "@/components/BookmarkCard"
import Link from "next/link"
import { BookmarkSchema, type Bookmark } from "@/lib/schemas/bookmark"

export default async function BookmarksPage(props: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await props.searchParams
  const tagFilter = tag ? Number(tag) : null

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // ================================
  // 1. タグフィルタ用に bookmark_id を取得
  // ================================
  let bookmarkIds: number[] = []
  if (tagFilter) {
    const { data: ids, error: idError } = await supabase
      .from("bookmark_tags")
      .select("bookmark_id")
      .eq("tag_id", tagFilter)

    if (idError) {
      console.error("タグフィルタ用のID取得エラー:", idError)
    } else {
      bookmarkIds = ids.map((row) => row.bookmark_id)
    }
  }

  // ================================
  // 2. ブックマーク本体を取得
  // ================================
  let query = supabase
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
      folders ( id, name ),
      bookmark_tags ( tags ( id, name, color ) )
    `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (tagFilter && bookmarkIds.length > 0) {
    query = query.in("id", bookmarkIds)
  } else if (tagFilter && bookmarkIds.length === 0) {
    // タグがあるのに1件も紐づいてなければ空にする
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">ブックマーク一覧</h1>
        <p className="text-gray-600">このタグに一致するブックマークはありません。</p>
      </div>
    )
  }

  const { data: bookmarks, error } = await query

  if (error) {
    console.error("ブックマーク取得エラー:", error)
    return <p className="p-4">読み込みエラーが発生しました。</p>
  }

  // ================================
  // 3. Zodで型バリデーション
  // ================================
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
          {tagFilter
            ? "このタグに一致するブックマークはありません。"
            : "まだブックマークがありません。"}
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
