"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

type User = { email?: string }

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser({ email: data.user.email ?? undefined })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ email: session.user.email ?? undefined })
      }
      if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/login")
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b bg-white shadow-sm">
      <Link href="/bookmarks" className="text-lg font-bold text-blue-600">
        📑 MyBookmarks
      </Link>
      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.email ?? "ログイン中"}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ログイン
          </Link>
        )}
      </nav>
    </header>
  )
}
