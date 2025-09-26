# 📑 MyBookmarks

Next.js + Supabase で作った **シンプルなブックマーク管理アプリ**
Google ログインで認証し、ブックマークを保存・整理できます。
OGP を自動取得してカード形式で一覧表示、タグや検索でフィルタリング可能です。

---

## 🚀 セットアップ手順

### 1. リポジトリを取得

git clone https://github.com/<your-username>/my-bookmark-manager.git
cd my-bookmark-manager

### 2. パッケージをインストール

npm install

### 3. 環境変数を設定

.env.local を作成して以下を記入してください。

NEXT_PUBLIC_SUPABASE_URL=xxxxxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx

※ Supabase プロジェクトの Project Settings > API から取得できます。

### 4. 開発サーバーを起動

npm run dev

http://localhost:3000 にアクセス。

---

## ✨ 実装済み機能

- Google ログイン / ログアウト
- ブックマーク管理
  - 新規登録（URL 入力 + OGP 自動取得）
  - 一覧表示（カード UI）
  - 編集（更新）
  - 削除（論理削除）
- タグ機能
  - タグ作成・編集・削除（専用ページ）
  - ブックマークに複数タグを付与
  - タグフィルタ（AND 条件対応）
  - UI 改善（折りたたみ + 横スクロール）
- 検索機能
  - タイトル・説明・URL を対象に部分一致検索
  - タグフィルタとの複合検索に対応

---

## 🛠️ 技術スタック

- Next.js 14 (App Router)
- Supabase
- TypeScript
- Tailwind CSS
- shadcn/ui
- open-graph-scraper
- Zod

---

## 📌 今後の追加予定

- フォルダ分け（1 階層）
- お気に入り機能
- ソート機能（作成日・更新日・タイトル順）
- 検索の拡張（タグ名も対象にする、ライブ検索対応）
- ブラウザ拡張
- モバイル最適化
- CI/CD 導入（GitHub Actions + Vercel Preview）
- E2E テスト（Playwright）導入
