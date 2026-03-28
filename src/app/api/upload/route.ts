import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isStorageConfigured,
  generateStorageKey,
  getPresignedUploadUrl,
  deleteObject,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { folder, filename, contentType } = body as {
    folder: string;
    filename: string;
    contentType: string;
  };

  if (!folder || !filename || !contentType) {
    return NextResponse.json(
      { error: "Missing required fields: folder, filename, contentType" },
      { status: 400 }
    );
  }

  const allowedFolders = [
    "heroes",
    "about",
    "recipes",
    "ingredients",
    "testimonials",
    "services",
    "misc",
  ];
  if (!allowedFolders.includes(folder)) {
    return NextResponse.json(
      { error: `Invalid folder. Allowed: ${allowedFolders.join(", ")}` },
      { status: 400 }
    );
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are allowed" },
      { status: 400 }
    );
  }

  const key = generateStorageKey(folder, filename);

  const result = await getPresignedUploadUrl(key, contentType, 5);

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { key } = body as { key: string };

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  await deleteObject(key);

  return NextResponse.json({ success: true });
}
