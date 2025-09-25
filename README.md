# 📑 MyBookmarks

Next.js + Supabase で作った **シンプルなブックマーク管理アプリ (MVP 版)**  
Google ログインで認証し、URL・タイトル・説明文を保存できます。  
OGP を自動取得してカード形式で一覧表示、編集・削除も可能です。

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

## ✨ 機能 (MVP)

- Google ログイン / ログアウト
- ブックマーク新規登録
  - URL 入力
  - OGP 自動取得（タイトル・説明・画像）
- 一覧表示（カード UI）
- 編集（更新）
- 削除（論理削除）

---

## 🛠️ 技術スタック

- Next.js 14 (App Router)
- Supabase
- TypeScript
- Tailwind CSS
- open-graph-scraper

---

## 📌 今後の追加予定

- タグ付け（複数）
- フォルダ分け（1 階層）
- お気に入り機能
- 検索 / フィルタ
- ブラウザ拡張
- モバイル対応
