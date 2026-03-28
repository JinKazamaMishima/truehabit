import { NextRequest, NextResponse } from "next/server";
import { isStorageConfigured, getPresignedDownloadUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  const key = keyParts.map(decodeURIComponent).join("/");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured" },
      { status: 503 }
    );
  }

  const url = await getPresignedDownloadUrl(key, 3600);

  return NextResponse.redirect(url, {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=3000, s-maxage=3000",
    },
  });
}
