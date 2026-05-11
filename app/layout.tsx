import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "King of Shit — the Uni Bathroom Tier List",
  description:
    "Crowd-sourced tier list of university and school bathrooms. Submit, rate, and crown the porcelain throne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="text-2xl">🚽</span>
              <span className="font-black tracking-tight text-lg sm:text-xl">
                King of <span className="text-amber-400">Shit</span>
              </span>
              <span className="hidden sm:inline text-xs text-zinc-400 group-hover:text-zinc-200 transition">
                / the uni bathroom tier list
              </span>
            </Link>
            <Link
              href="/submit"
              className="rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 transition"
            >
              + Submit a bathroom
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800/80 px-4 py-6 text-xs text-zinc-500">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2">
            <span>made for the people. flush responsibly.</span>
            <span>no login. no judgement (except of the toilets).</span>
          </div>
        </footer>
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
