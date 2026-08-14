"use server";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import convert from "heic-convert";
import type { GalleryPhoto, Project } from "@/lib/supabase";

const AUTH_COOKIE = "admin_auth";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const BUCKET = "project-images";

type ProjectPayload = {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  year: string;
  link: string | null;
  image_url: string | null;
  images: string[];
  type: "dev" | "design";
};


function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? requireEnv("ADMIN_PASSWORD");
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function createSessionToken() {
  const expires = Date.now() + SESSION_TTL_MS;
  const nonce = randomBytes(16).toString("base64url");
  const payload = `${nonce}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [nonce, expiresRaw, signature] = token.split(".");
  if (!nonce || !expiresRaw || !signature) return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  return safeEqual(signature, sign(`${nonce}.${expiresRaw}`));
}

function adminSupabase() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function requireAdmin() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(AUTH_COOKIE)?.value)) {
    throw new Error("Unauthorized");
  }
}

function cleanText(value: string, field: string) {
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`${field} is required.`);
  return cleaned;
}

function cleanOptionalUrl(value: string | null) {
  const cleaned = value?.trim();
  if (!cleaned) return null;

  const url = new URL(cleaned);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Links must start with http:// or https://.");
  }
  return url.toString();
}

function imageExtension(file: File) {
  const byType: Record<string, string> = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  if (byType[file.type]) return byType[file.type];
  return file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
}

function isHeic(file: File) {
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" || ext === "heif";
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifySessionToken(jar.get(AUTH_COOKIE)?.value);
}

export async function login(_prev: unknown, formData: FormData) {
  const expected = process.env.ADMIN_PASSWORD;
  const password = String(formData.get("password") ?? "");

  if (!expected) return { error: "Admin password is not configured" };

  if (safeEqual(password, expected)) {
    const jar = await cookies();
    jar.set(AUTH_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_MS / 1000,
      path: "/",
    });
    redirect("/admin");
  }

  return { error: "Invalid password" };
}

export async function logout() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  redirect("/admin");
}

export async function fetchAdminData(): Promise<{
  projects: Project[];
  photos: GalleryPhoto[];
}> {
  await requireAdmin();
  const db = adminSupabase();
  const [projectRes, photoRes] = await Promise.all([
    db.from("projects").select("*").order("sort_order", { ascending: true }),
    db.from("gallery_photos").select("*").order("sort_order", { ascending: true }),
  ]);

  if (projectRes.error) throw new Error(projectRes.error.message);
  if (photoRes.error) throw new Error(photoRes.error.message);

  return {
    projects: projectRes.data ?? [],
    photos: photoRes.data ?? [],
  };
}

export async function saveProject(payload: ProjectPayload) {
  await requireAdmin();

  const db = adminSupabase();
  const data = {
    title: cleanText(payload.title, "Title"),
    description: payload.description.trim(),
    category: cleanText(payload.category, "Category"),
    tags: payload.tags.map((tag) => tag.trim()).filter(Boolean),
    year: cleanText(payload.year, "Year"),
    link: cleanOptionalUrl(payload.link),
    image_url: payload.image_url?.trim() || null,
    images: payload.images,
    type: payload.type,
  };

  const result = payload.id
    ? await db.from("projects").update(data).eq("id", payload.id)
    : await db.from("projects").insert(data);

  if (result.error) throw new Error(result.error.message);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const { error } = await adminSupabase().from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}



export async function saveProjectOrder(updates: { id: string; sort_order: number }[]) {
  await requireAdmin();
  const db = adminSupabase();

  const results = await Promise.all(
    updates.map((item) =>
      db.from("projects").update({ sort_order: item.sort_order }).eq("id", item.id)
    )
  );

  const errors = results.filter((r) => r.error).map((r) => r.error!.message);
  if (errors.length) throw new Error(errors.join("; "));
}


export async function uploadImage(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image to upload.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  let buffer = Buffer.from(await file.arrayBuffer());
  let contentType = file.type;
  let ext = imageExtension(file);

  // Convert HEIC/HEIF (iPhone photos) to JPEG for universal browser support
  if (isHeic(file)) {
    const converted = await convert({
      buffer: new Uint8Array(buffer),
      format: "JPEG",
      quality: 0.9,
    });
    buffer = Buffer.from(converted);
    contentType = "image/jpeg";
    ext = "jpg";
  }

  const path = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  const { error } = await adminSupabase()
    .storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  return adminSupabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadGalleryPhoto(formData: FormData) {
  await requireAdmin();
  const imageUrl = await uploadImage(formData);
  const { error } = await adminSupabase().from("gallery_photos").insert({ image_url: imageUrl });
  if (error) throw new Error(error.message);
}

export async function deleteGalleryPhoto(id: string) {
  await requireAdmin();
  const { error } = await adminSupabase().from("gallery_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function removeStoredImage(url: string) {
  await requireAdmin();
  const path = url.split(`/${BUCKET}/`)[1];
  if (!path) return;

  const { error } = await adminSupabase().storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
