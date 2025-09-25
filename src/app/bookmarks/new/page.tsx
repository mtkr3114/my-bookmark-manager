import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookmarkForm } from "@/components/BookmarkForm"

export default async function NewBookmarkPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">新規ブックマーク</h1>
      <BookmarkForm />
    </div>
  )
}
