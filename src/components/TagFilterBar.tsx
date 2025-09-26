"use client"

import { useState } from "react"
import Link from "next/link"
import type { Tag } from "@/lib/schemas/bookmark"

export function TagFilterBar({
  allTags,
  selectedTagIds,
  keyword,
}: {
  allTags: Tag[]
  selectedTagIds: number[]
  keyword?: string | null
}) {
  const [showAll, setShowAll] = useState(false)

  const visibleTags = showAll ? allTags : allTags.slice(0, 10)

  // ヘルパー: リンク生成
  const makeHref = (nextTags: number[]) => {
    const params = new URLSearchParams()
    if (nextTags.length > 0) params.set("tags", nextTags.join(","))
    if (keyword) params.set("q", keyword)
    return `/bookmarks?${params.toString()}`
  }

  return (
    <div className="mb-4">
      {/* 横スクロール可能なバー */}
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2">
        {/* すべて */}
        <Link
          href={makeHref([])}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition ${
            selectedTagIds.length === 0
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {selectedTagIds.length === 0 && <span>✔</span>}
          すべて
        </Link>

        {/* タグ一覧 */}
        {visibleTags.map((t) => {
          const isSelected = selectedTagIds.includes(t.id)
          const nextTags = isSelected
            ? selectedTagIds.filter((id) => id !== t.id)
            : [...selectedTagIds, t.id]

          return (
            <Link
              key={t.id}
              href={makeHref(nextTags)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              style={{
                backgroundColor: isSelected ? t.color ?? undefined : undefined,
              }}
            >
              {isSelected && <span>✔</span>}
              {t.name}
            </Link>
          )
        })}
      </div>

      {/* 折りたたみボタン */}
      {allTags.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {showAll ? "閉じる" : "もっと見る"}
        </button>
      )}
    </div>
  )
}
