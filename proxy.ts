import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "zh"] as const;
const DEFAULT_LOCALE = "en";
const COOKIE_NAME = "NEXT_LOCALE";

type Locale = (typeof LOCALES)[number];

function pickLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }
  const header = req.headers.get("accept-language") ?? "";
  const wantsZh = /\bzh\b/i.test(header);
  return wantsZh ? "zh" : DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\.).*)"],
};
