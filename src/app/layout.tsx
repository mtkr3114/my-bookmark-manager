import "./globals.css"
import { Header } from "@/components/Header"

export const metadata = {
  title: "MyBookmarks",
  description: "シンプルなブックマーク管理アプリ",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
