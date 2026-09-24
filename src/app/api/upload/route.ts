import { readdir } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";

const folders = new Set(["pages", "blogs", "logos", "reviews", "menu", "library"]);
const allowed = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
  ["image/avif", "avif"],
]);

function slugName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "image";
}

export async function GET(request: Request) {
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const root = path.join(process.cwd(), "public", "uploads");
  const images: { url: string; folder: string; name: string }[] = [];
  for (const folder of folders) {
    try {
      const names = await readdir(path.join(root, folder));
      for (const name of names) {
        if (name.startsWith(".")) continue;
        images.push({ url: `/uploads/${folder}/${name}`, folder, name });
      }
    } catch {
      // folder may not exist yet
    }
  }
  images.sort((left, right) => right.name.localeCompare(left.name));
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const denied = await requireEditorSession(request);
  if (denied) return denied;
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  const file = form.get("file");
  const folder = String(form.get("folder") || "pages");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (!folders.has(folder)) return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 4 MB" }, { status: 400 });
  const ext = allowed.get(file.type);
  if (!ext) return NextResponse.json({ error: "Use PNG, JPG, WebP, GIF, SVG or AVIF" }, { status: 400 });

  const filename = `${Date.now()}-${slugName(file.name)}.${ext}`;
  const relative = path.posix.join("/uploads", folder, filename);
  const destDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(destDir, { recursive: true });
  await writeFile(path.join(destDir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: relative });
}
