import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isAdminLoginPath, isAdminPath, readSession, safeAdminNext, splitLocalePath } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    const session = await readSession(request);
    if (isAdminLoginPath(pathname)) {
      if (session) {
        const url = request.nextUrl.clone();
        url.pathname = safeAdminNext(request.nextUrl.searchParams.get("next"), `${splitLocalePath(pathname).prefix}/admin` || "/admin");
        url.search = "";
        return NextResponse.redirect(url);
      }
    } else if (!session) {
      const { prefix } = splitLocalePath(pathname);
      const url = request.nextUrl.clone();
      url.pathname = `${prefix}/admin/login`;
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  if (isAdminLoginPath(pathname)) {
    const headers = new Headers(request.headers);
    headers.set("x-certko-login", "1");
    return intlMiddleware(new NextRequest(request, { headers }));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
