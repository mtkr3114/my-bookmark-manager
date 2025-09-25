"use client"

import { useState, useEffect } from "react"
import { fetchOgp } from "@/lib/fetchOgp"
import { addBookmark } from "@/app/bookmarks/actions"

export function BookmarkForm() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  // URL入力が止まってから 800ms 後に OGP を取得
  useEffect(() => {
    if (!url || !/^https?:\/\//.test(url)) return

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchOgp(url)
        if (data.title && !title) setTitle(data.title)
        if (data.description && !description) setDescription(data.description)
        if (data.image) setImage(data.image)
      } catch (e) {
        console.error("OGP取得失敗:", e)
      } finally {
        setLoading(false)
      }
    }, 800)

    return () => clearTimeout(timeout)
  }, [url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addBookmark({ url, title, description, og_image_url: image })
      window.location.href = "/bookmarks"
    } catch (err) {
      console.error("登録失敗:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL入力 */}
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URLを入力"
        className="border w-full p-2 rounded"
        required
      />

      {loading && <p className="text-sm text-gray-500">OGP取得中...</p>}

      {/* プレビュー */}
      {(image || title || description) && (
        <div className="border rounded p-3 flex space-x-3 bg-gray-50">
          {image && <img src={image} alt="OGP画像" className="w-24 h-24 object-cover rounded" />}
          <div>
            <h3 className="font-semibold">{title || "タイトル未取得"}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{description || "説明未取得"}</p>
          </div>
        </div>
      )}

      {/* タイトル */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="border w-full p-2 rounded"
      />

      {/* 説明 */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
        className="border w-full p-2 rounded"
      />

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        保存
      </button>
    </form>
  )
}
