import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const { result } = await ogs({ url });
    return NextResponse.json({
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image: result.ogImage?.[0]?.url || "",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
