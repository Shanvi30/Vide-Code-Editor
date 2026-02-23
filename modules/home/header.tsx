import Link from "next/link";
import Image from "next/image";
import UserButton from "../auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowUpRight, Code2 } from "lucide-react";

export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="w-full max-w-5xl flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/60 backdrop-blur-xl px-4 py-2.5 shadow-2xl shadow-black/40">
        {/* ── Left: Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center transition-colors group-hover:bg-blue-500/25">
            <Image src="/logo.svg" alt="Logo" height={20} width={20} />
          </div>
          <span className="hidden sm:block font-bold text-sm text-white tracking-tight">
            VideCode <span className="text-blue-400">Editor</span>
          </span>
        </Link>

        {/* ── Center: Nav links ── */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/docs/components/background-paths"
            className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            Docs
          </Link>
          <Link
            href="https://codesnippetui.pro/templates"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            API
            <span className="text-[10px] font-semibold text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 rounded-md px-1.5 py-0.5 leading-none">
              New
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <Code2 className="w-3.5 h-3.5" />
            Editor
          </Link>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-white/10" />

          {/* User avatar */}
          <UserButton />
        </div>
      </nav>
    </div>
  );
}
