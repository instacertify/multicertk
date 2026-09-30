import { NextResponse } from "next/server";

export const SESSION_COOKIE = "ck_session";
export const CAPTCHA_COOKIE = "ck_captcha";
export const SESSION_MAX_AGE = 60 * 60 * 12;
export const CAPTCHA_MAX_AGE = 60 * 5;

const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function splitLocalePath(pathname: string) {
  const match = pathname.match(/^\/(hi|zh|es|fr|ar|ru)(?=\/|$)/);
  const locale = match?.[1] ?? "";
  const rest = locale ? pathname.slice(locale.length + 1) || "/" : pathname;
  return { locale, rest, prefix: locale ? `/${locale}` : "" };
}

export function isAdminPath(pathname: string) {
  const { rest } = splitLocalePath(pathname);
  return rest === "/admin" || rest.startsWith("/admin/");
}

export function isAdminLoginPath(pathname: string) {
  const { rest } = splitLocalePath(pathname);
  return rest === "/admin/login" || rest.startsWith("/admin/login/");
}

export function safeAdminNext(next: string | null | undefined, fallback = "/admin") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  const { rest } = splitLocalePath(next);
  if (!(rest === "/admin" || rest.startsWith("/admin/"))) return fallback;
  if (rest === "/admin/login" || rest.startsWith("/admin/login/")) return fallback;
  return next;
}

export function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.EDITOR_SECRET ||
    `certko-editor:${process.env.EDITOR_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD || "certko-admin"}`
  );
}

export function getEditorCredentials() {
  return {
    email: (process.env.EDITOR_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL || "admin@certko.com").trim().toLowerCase(),
    password: process.env.EDITOR_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD || "certko-admin",
  };
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmacHex(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export function timingSafeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length === rightBytes.length ? 0 : 1;
  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return diff === 0;
}

async function signToken(payload: string) {
  return `${encodeBase64Url(payload)}.${await hmacHex(getAuthSecret(), payload)}`;
}

async function readToken(token: string | undefined) {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  let payload = "";
  try {
    payload = decodeBase64Url(encoded);
  } catch {
    return null;
  }
  const expected = await hmacHex(getAuthSecret(), payload);
  if (!timingSafeEqual(signature, expected)) return null;
  return payload;
}

export function shouldSecureCookie(request?: Request) {
  if (process.env.AUTH_COOKIE_SECURE === "1") return true;
  if (process.env.AUTH_COOKIE_SECURE === "0") return false;
  const forwarded = request?.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  try {
    if (request?.url) return new URL(request.url).protocol === "https:";
  } catch {
    /* ignore */
  }
  return false;
}

function cookieBase(maxAge: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
    maxAge,
  };
}

export function applyCookie(response: NextResponse, name: string, value: string, maxAge: number, request?: Request) {
  response.cookies.set(name, value, cookieBase(maxAge, shouldSecureCookie(request)));
}

export function clearCookie(response: NextResponse, name: string, request?: Request) {
  response.cookies.set(name, "", { ...cookieBase(0, shouldSecureCookie(request)), maxAge: 0 });
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      return part.slice(index + 1).trim();
    }
  }
  return undefined;
}

export async function createSessionToken(email: string) {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  return signToken(`session:${email.toLowerCase()}:${exp}`);
}

export async function readSession(request: Request) {
  const payload = await readToken(readCookie(request, SESSION_COOKIE));
  if (!payload) return null;
  const match = payload.match(/^session:([^:]+):(\d+)$/);
  if (!match) return null;
  const exp = Number(match[2]);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  return { email: match[1] };
}

export async function requireEditorSession(request: Request) {
  const session = await readSession(request);
  if (session) return null;
  return NextResponse.json({ error: "Sign in required" }, { status: 401 });
}

function randomInt(max: number) {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % max;
}

export function randomCaptchaText(length = 5) {
  let text = "";
  for (let index = 0; index < length; index += 1) {
    text += CAPTCHA_CHARS[randomInt(CAPTCHA_CHARS.length)];
  }
  return text;
}

export async function createCaptchaToken(text: string) {
  const exp = Date.now() + CAPTCHA_MAX_AGE * 1000;
  return signToken(`captcha:${text.toUpperCase()}:${exp}`);
}

export async function readCaptchaText(request: Request) {
  const payload = await readToken(readCookie(request, CAPTCHA_COOKIE));
  if (!payload) return null;
  const match = payload.match(/^captcha:([A-Z0-9]+):(\d+)$/);
  if (!match) return null;
  const exp = Number(match[2]);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  return match[1];
}

export async function credentialsMatch(email: string, password: string) {
  const expected = getEditorCredentials();
  const emailOk = timingSafeEqual(await sha256Hex(email.trim().toLowerCase()), await sha256Hex(expected.email));
  const passwordOk = timingSafeEqual(await sha256Hex(password), await sha256Hex(expected.password));
  return emailOk && passwordOk;
}

export function renderCaptchaSvg(text: string) {
  const width = 220;
  const height = 72;
  const chars = [...text];
  const lines = Array.from({ length: 7 }, () => {
    const x1 = randomInt(width);
    const y1 = randomInt(height);
    const x2 = randomInt(width);
    const y2 = randomInt(height);
    const color = randomInt(2) ? "#f5b400" : "#7a8ea3";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${1 + randomInt(2)}" opacity="0.45"/>`;
  });
  const dots = Array.from({ length: 28 }, () => {
    const cx = randomInt(width);
    const cy = randomInt(height);
    return `<circle cx="${cx}" cy="${cy}" r="${1 + randomInt(2)}" fill="${randomInt(2) ? "#0b1f3d" : "#f5b400"}" opacity="0.28"/>`;
  });
  const letters = chars.map((char, index) => {
    const x = 22 + index * 38 + randomInt(8);
    const y = 42 + randomInt(12);
    const rotate = randomInt(22) - 11;
    const size = 28 + randomInt(6);
    const fill = index % 2 === 0 ? "#f6f3ec" : "#f5b400";
    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Verification characters">
  <rect width="${width}" height="${height}" rx="10" fill="#0b1f3d"/>
  <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="8" fill="#061428"/>
  ${lines.join("")}
  ${dots.join("")}
  ${letters.join("")}
</svg>`;
}
