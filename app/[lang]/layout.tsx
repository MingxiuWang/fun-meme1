import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  if (lang === "zh") {
    return {
      title: "大学必拉榜 — 抽象校园厕所图鉴",
      description:
        "全民众包,记录每一间值得蹲(或值得逃离)的大学厕所。1–10 打分,均分定生死。免登录。",
    };
  }
  return {
    title: "King of Shit — the Uni Bathroom Tier List",
    description:
      "Crowd-sourced tier list of university and school bathrooms. Submit, rate, and crown the porcelain throne.",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <html
      lang={dict.htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href={`/${lang}`} className="flex items-baseline gap-2 group">
              <span className="text-2xl">🚽</span>
              <span className="font-black tracking-tight text-lg sm:text-xl">
                {dict.nav.brandA}
                <span className="text-amber-400">{dict.nav.brandB}</span>
              </span>
              <span className="hidden sm:inline text-xs text-zinc-400 group-hover:text-zinc-200 transition">
                {dict.nav.tagline}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LocaleSwitcher current={lang as Locale} otherLabel={dict.switchTo} />
              <Link
                href={`/${lang}/submit`}
                className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 transition"
              >
                {dict.nav.submit}
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800/80 px-4 py-6 text-xs text-zinc-500">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2">
            <span>{dict.footer.left}</span>
            <span>{dict.footer.right}</span>
          </div>
        </footer>
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
