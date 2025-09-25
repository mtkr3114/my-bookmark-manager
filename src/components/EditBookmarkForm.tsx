"use client"

import { useState } from "react"
import { updateBookmark, deleteBookmark } from "@/app/bookmarks/actions"

type Bookmark = {
  id: string
  url: string
  title: string
  description: string
  og_image_url?: string | null
}

export function EditBookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const [url, setUrl] = useState(bookmark.url)
  const [title, setTitle] = useState(bookmark.title)
  const [description, setDescription] = useState(bookmark.description)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateBookmark({
        id: bookmark.id,
        url,
        title,
        description,
        og_image_url: bookmark.og_image_url ?? undefined,
      })
      window.location.href = "/bookmarks"
    } catch (err) {
      console.error("更新失敗:", err)
    }
  }

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return
    try {
      await deleteBookmark(bookmark.id)
      window.location.href = "/bookmarks"
    } catch (err) {
      console.error("削除失敗:", err)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* URL */}
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border w-full p-2 rounded"
        required
      />

      {/* タイトル */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border w-full p-2 rounded"
      />

      {/* 説明 */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border w-full p-2 rounded"
      />

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          更新
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          削除
        </button>
      </div>
    </form>
  )
}
