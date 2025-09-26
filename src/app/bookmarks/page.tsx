import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkCard } from "@/components/BookmarkCard"
import { TagFilterBar } from "@/components/TagFilterBar"
import { BookmarkSchema, type Bookmark } from "@/lib/schemas/bookmark"

export default async function BookmarksPage(props: {
  searchParams: Promise<{ tags?: string; q?: string }>
}) {
  const { tags, q } = await props.searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const tagFilters = tags ? tags.split(",").map((id) => Number(id)) : []
  const keyword = q ?? null

  let bookmarkIds: number[] | null = null

  if (tagFilters.length > 0) {
    for (const tagId of tagFilters) {
      const { data, error } = await supabase
        .from("bookmark_tags")
        .select("bookmark_id")
        .eq("tag_id", tagId)

      if (error) {
        console.error("タグ絞り込みエラー:", error)
        return <p>読み込みエラー</p>
      }

      const ids = data.map((d) => d.bookmark_id)

      // ✅ AND条件にするため共通部分を取る
      bookmarkIds = bookmarkIds ? bookmarkIds.filter((id) => ids.includes(id)) : ids
    }
  }

  // Supabaseクエリ作成
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
    folders (
      id,
      name
    ),
    bookmark_tags (
      tag_id,
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

  // ✅ tagFilters がある場合だけ適用
  if (bookmarkIds && bookmarkIds.length > 0) {
    query = query.in("id", bookmarkIds)
  } else if (tagFilters.length > 0) {
    // AND条件で絞った結果ゼロ件なら即リターン
    return <p className="p-4">条件に一致するブックマークはありません。</p>
  }

  // ✅ 検索
  if (keyword) {
    query = query.or(
      `title.ilike.%${keyword}%,description.ilike.%${keyword}%,url.ilike.%${keyword}%`
    )
  }

  const { data: bookmarks, error } = await query

  if (error) {
    console.error("ブックマーク取得エラー:", error)
    return <p className="p-4">読み込みエラーが発生しました。</p>
  }

  // Zodでバリデーション
  const parsedBookmarks: Bookmark[] = (bookmarks ?? []).map((bm) => BookmarkSchema.parse(bm))

  // 全タグ取得（フィルタUI用）
  const { data: allTags } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-xl font-bold">ブックマーク一覧</h1>

        {/* 検索フォーム */}
        <form action="/bookmarks" method="get" className="flex gap-2">
          {/* タグフィルタを保持して検索 */}
          {tagFilters.length > 0 && (
            <input type="hidden" name="tags" value={tagFilters.join(",")} />
          )}
          <input
            type="text"
            name="q"
            defaultValue={keyword ?? ""}
            placeholder="検索 (タイトル・説明・URL)"
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            検索
          </button>
        </form>
      </div>

      {/* フィルタUI */}
      <TagFilterBar allTags={allTags ?? []} selectedTagIds={tagFilters} keyword={keyword} />

      {parsedBookmarks.length === 0 ? (
        <div className="text-gray-600">
          {keyword || tagFilters.length > 0
            ? "条件に一致するブックマークはありません。"
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
