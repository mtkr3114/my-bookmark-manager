import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditBookmarkForm } from "@/components/EditBookmarkForm"

export default async function EditBookmarkPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: bookmark, error } = await supabase
    .from("bookmarks")
    .select("id, url, title, description, og_image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single()

  if (error || !bookmark) {
    console.error("ブックマーク取得エラー:", error)
    redirect("/bookmarks")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ブックマーク編集</h1>
      <EditBookmarkForm bookmark={bookmark} />
    </div>
  )
}
