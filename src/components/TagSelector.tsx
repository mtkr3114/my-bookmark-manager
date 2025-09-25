"use client"

import { useState } from "react"
import CreatableSelect from "react-select/creatable"
import type { Tag } from "@/lib/schemas/bookmark"
import { addTag } from "@/app/bookmarks/actions"

type Option = { value: number; label: string }

type Props = {
  availableTags: Tag[]
  selectedTagIds: number[]
  onChange: (tagIds: number[]) => void
}

export function TagSelector({ availableTags, selectedTagIds, onChange }: Props) {
  const [options, setOptions] = useState<Option[]>(
    availableTags.map((t) => ({ value: t.id, label: t.name }))
  )

  const handleChange = (newValue: readonly Option[]) => {
    onChange(newValue.map((opt) => opt.value))
  }

  const handleCreate = async (inputValue: string) => {
    const newTag = await addTag(inputValue)
    const newOption = { value: newTag.id, label: newTag.name }
    setOptions([...options, newOption])
    onChange([...selectedTagIds, newTag.id]) // 追加したタグを即選択
  }

  return (
    <div>
      <label className="font-semibold">タグ</label>
      <CreatableSelect
        isMulti
        options={options}
        value={options.filter((opt) => selectedTagIds.includes(opt.value))}
        onChange={(newValue) => handleChange(newValue as Option[])}
        onCreateOption={handleCreate}
        placeholder="タグを選択または作成..."
        className="mt-2"
      />
    </div>
  )
}
