"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      // redirectTo をあえて指定しない → Supabase の SITE_URL に戻る
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      })
      if (error) console.error("Googleログイン失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">ログイン</h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 w-full"
        >
          {loading ? "ログイン中..." : "Googleでログイン"}
        </button>
      </div>
    </div>
  )
}
