import { z } from "zod";

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string().nullable().optional(),
});

export const FolderSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const BookmarkSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  is_favorite: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  folders: FolderSchema.nullable().optional(),
  bookmark_tags: z
    .array(
      z.object({
        tags: TagSchema,
      })
    )
    .optional(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Folder = z.infer<typeof FolderSchema>;
