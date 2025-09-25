// app/profile/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  const user = session.user

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}
