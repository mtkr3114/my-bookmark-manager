"use client"

import Link from "next/link"
import type { Bookmark } from "@/lib/schemas/bookmark"

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <div className="border rounded-lg shadow-sm bg-white flex flex-col">
      {/* OGP画像 */}
      {bookmark.og_image_url && (
        <img
          src={bookmark.og_image_url}
          alt="OGP画像"
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )}

      {/* 内容 */}
      <div className="p-3 flex-1">
        <h3 className="font-semibold text-lg line-clamp-2">{bookmark.title ?? "タイトル未設定"}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{bookmark.description ?? ""}</p>
        <p className="mt-2 text-xs text-blue-600 truncate">{bookmark.url}</p>
        {bookmark.updated_at && (
          <p className="mt-1 text-xs text-gray-400">
            更新日: {new Date(bookmark.updated_at).toLocaleString()}
          </p>
        )}

        {/* タグ一覧 */}
        {bookmark.bookmark_tags && bookmark.bookmark_tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {bookmark.bookmark_tags.map((bt) =>
              bt.tags ? ( // 👈 null チェックを追加
                <Link
                  key={bt.tags.id}
                  href={`/bookmarks?tag=${bt.tags.id}`}
                  className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  style={{ backgroundColor: bt.tags.color ?? undefined }}
                >
                  {bt.tags.name}
                </Link>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* アクション */}
      <div className="p-3 flex justify-between items-center border-t">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          開く
        </a>
        <Link href={`/bookmarks/${bookmark.id}`} className="text-sm text-gray-600 hover:underline">
          編集
        </Link>
      </div>
    </div>
  )
}
