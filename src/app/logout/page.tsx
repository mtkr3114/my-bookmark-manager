// app/logout/page.tsx
"use client"

import { useAuth } from "@/components/AuthProvider"
import { useEffect } from "react"

export default function LogoutPage() {
  const { signOut } = useAuth()

  useEffect(() => {
    signOut().then(() => {
      window.location.href = "/login"
    })
  }, [signOut])

  return <p>Logging out...</p>
}
