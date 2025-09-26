import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { addTag, updateTag, deleteTag } from "./actions"
import { revalidatePath } from "next/cache"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function TagsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("タグ一覧取得エラー:", error)
    return <p className="p-4">タグ一覧の読み込みに失敗しました。</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">タグ管理</h1>

        {/* 新規タグ追加モーダル */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ 新規タグ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しいタグを作成</DialogTitle>
            </DialogHeader>
            <form
              action={async (formData) => {
                "use server"
                const name = formData.get("name") as string
                const color = formData.get("color") as string | null
                if (!name) return
                await addTag(name, color ?? undefined)
                revalidatePath("/tags")
              }}
              className="space-y-3"
            >
              <Input name="name" placeholder="タグ名" required />
              <Input type="color" name="color" defaultValue="#cccccc" />
              <Button type="submit" className="w-full">
                作成
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* タグ一覧 */}
      <ul className="space-y-2">
        {tags?.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between border p-3 rounded">
            {/* タグの見た目 */}
            <span
              className="px-2 py-1 rounded text-sm font-medium"
              style={{
                backgroundColor: tag.color ?? "#ccc",
                color: "white",
              }}
            >
              {tag.name}
            </span>

            <div className="flex gap-2">
              {/* 編集モーダル */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    編集
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>タグを編集</DialogTitle>
                  </DialogHeader>
                  <form
                    action={async (formData) => {
                      "use server"
                      const name = formData.get("name") as string
                      const color = formData.get("color") as string | null
                      await updateTag(tag.id, name, color ?? undefined)
                      revalidatePath("/tags")
                    }}
                    className="space-y-3"
                  >
                    <Input name="name" defaultValue={tag.name} placeholder="タグ名" required />
                    <Input type="color" name="color" defaultValue={tag.color ?? "#cccccc"} />
                    <Button type="submit" className="w-full">
                      更新
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {/* 削除ボタン */}
              <form
                action={async () => {
                  "use server"
                  await deleteTag(tag.id)
                  revalidatePath("/tags")
                }}
              >
                <Button type="submit" variant="destructive" size="sm">
                  削除
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
