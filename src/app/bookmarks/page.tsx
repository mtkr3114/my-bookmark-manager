import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkCard } from "@/components/BookmarkCard"
import Link from "next/link"
import { BookmarkSchema, type Bookmark, type Tag } from "@/lib/schemas/bookmark"

export default async function BookmarksPage(props: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await props.searchParams
  const tagFilter = tag ? Number(tag) : null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // タグ一覧を取得
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // タグフィルタ用の bookmark_id を取得
  let bookmarkIds: number[] = []
  if (tagFilter) {
    const { data: ids } = await supabase
      .from("bookmark_tags")
      .select("bookmark_id")
      .eq("tag_id", tagFilter)

    bookmarkIds = ids?.map((row) => row.bookmark_id) ?? []
  }

  // ブックマークを取得
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
    return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">ブックマーク一覧</h1>
          <div className="flex gap-2">
            <Link
              href="/tags"
              className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
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

        {/* タグ一覧 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href="/bookmarks"
            className={`px-3 py-1 rounded text-sm ${
              !tagFilter ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            すべて
          </Link>
          {tags?.map((t: Tag) => (
            <Link
              key={t.id}
              href={`/bookmarks?tag=${t.id}`}
              className={`px-3 py-1 rounded text-sm ${
                tagFilter === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              style={{
                backgroundColor: tagFilter === t.id ? t.color ?? undefined : undefined,
              }}
            >
              {t.name}
            </Link>
          ))}
        </div>

        <p className="text-gray-600">このタグに一致するブックマークはありません。</p>
      </div>
    )
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

      {/* タグ一覧 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/bookmarks"
          className={`px-3 py-1 rounded text-sm ${
            !tagFilter ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          すべて
        </Link>
        {tags?.map((t: Tag) => (
          <Link
            key={t.id}
            href={`/bookmarks?tag=${t.id}`}
            className={`px-3 py-1 rounded text-sm ${
              tagFilter === t.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            style={{
              backgroundColor: tagFilter === t.id ? t.color ?? undefined : undefined,
            }}
          >
            {t.name}
          </Link>
        ))}
      </div>

      {parsedBookmarks.length === 0 ? (
        <div className="text-gray-600">まだブックマークがありません。</div>
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
