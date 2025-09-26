import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkCard } from "@/components/BookmarkCard"
import { TagFilterBar } from "@/components/TagFilterBar"
import Link from "next/link"
import { BookmarkSchema, type Bookmark } from "@/lib/schemas/bookmark"
export default async function BookmarksPage(props: { searchParams: Promise<{ tags?: string }> }) {
  const { tags } = await props.searchParams
  const tagFilters = tags ? tags.split(",").map((id) => Number(id)) : []

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // タグ一覧を取得
  const { data: allTags } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // フィルタ対象の bookmark_id を取得
  let bookmarkIds: number[] = []
  if (tagFilters.length > 0) {
    const { data: ids } = await supabase.from("bookmark_tags").select("bookmark_id, tag_id")

    if (ids) {
      // bookmark_id ごとに tag_id を集める
      const grouped = ids.reduce<Record<number, number[]>>((acc, row) => {
        acc[row.bookmark_id] = acc[row.bookmark_id] || []
        acc[row.bookmark_id].push(row.tag_id)
        return acc
      }, {})

      // AND 条件: 選択した全てのタグを含む bookmark_id だけ残す
      bookmarkIds = Object.keys(grouped)
        .map(Number)
        .filter((id) => tagFilters.every((t) => grouped[id].includes(t)))
    }
  }

  // ブックマーク取得
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

  // ✅ AND 条件の結果に基づいて絞り込み
  if (tagFilters.length > 0) {
    query = query.in("id", bookmarkIds.length > 0 ? bookmarkIds : [-1])
    // -1 を指定して空配列にせずUIだけ残す
  }

  const { data: bookmarks, error } = await query
  if (error) {
    console.error("ブックマーク取得エラー:", error)
    return <p className="p-4">読み込みエラーが発生しました。</p>
  }

  const parsedBookmarks: Bookmark[] = (bookmarks ?? []).map((bm) => BookmarkSchema.parse(bm))

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ブックマーク一覧</h1>
        <div className="flex gap-2">
          <Link href="/tags" className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700">
            タグ管理
          </Link>
          <Link
            href="/bookmarks/new"
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + 新規追加
          </Link>
        </div>
      </div>

      {/* タグフィルタ UI */}
      <TagFilterBar allTags={allTags ?? []} selectedTagIds={tagFilters} />

      {/* ✅ ブックマークが0件でもタグUIは消さず、メッセージだけ */}
      {parsedBookmarks.length === 0 ? (
        <div className="text-gray-600">
          {tagFilters.length > 0
            ? "このタグの組み合わせに一致するブックマークはありません。"
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
