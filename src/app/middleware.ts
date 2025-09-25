import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // /bookmarks や /profile など protected 配下は認証必須
  if (url.pathname.startsWith("/bookmarks") || url.pathname.startsWith("/profile")) {
    const hasSession = req.cookies.has("sb-access-token"); // SupabaseのCookie
    if (!hasSession) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
