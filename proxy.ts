import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";

const LOCALES = ["en", "zh"] as const;
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";
const VOTER_COOKIE = "voter_id";
const VOTER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Locale = (typeof LOCALES)[number];

function pickLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }
  const header = req.headers.get("accept-language") ?? "";
  const wantsZh = /\bzh\b/i.test(header);
  return wantsZh ? "zh" : DEFAULT_LOCALE;
}

function ensureVoterCookie(req: NextRequest, response: NextResponse) {
  if (req.cookies.get(VOTER_COOKIE)?.value) return;
  response.cookies.set({
    name: VOTER_COOKIE,
    value: nanoid(16),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: VOTER_COOKIE_MAX_AGE,
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (hasLocale) {
    const response = NextResponse.next();
    ensureVoterCookie(request, response);
    return response;
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  ensureVoterCookie(request, response);
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\.).*)"],
};
