"use client";

import Link from "next/link";
import Image from "next/image";
import UserButton from "../auth/components/user-button";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300"
      style={{
        padding: scrolled ? "0" : "16px 16px 0 16px",
      }}
    >
      <nav
        className="w-full flex items-center justify-between gap-4 px-5 py-3 transition-all duration-300"
        style={{
          maxWidth: scrolled ? "100%" : "64rem",
          borderRadius: scrolled ? "0" : "1rem",
          background: scrolled ? "rgba(7, 8, 15, 0.92)" : "rgba(0, 0, 0, 0.60)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          border: scrolled ? undefined : "1px solid rgba(255,255,255,0.08)",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Left: Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center transition-colors group-hover:bg-indigo-500/25">
            <Image src="/logo.svg" alt="Logo" height={20} width={20} />
          </div>
          <span className="hidden sm:block font-bold text-sm text-white tracking-tight">
            VideCode <span className="text-indigo-400">Editor</span>
          </span>
        </Link>

        {/* ── Center: Nav links ── */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/docs"
            className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/Shanvi30/Vide-Code-Editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </Link>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <Link href="/dashboard" className="hidden sm:block">
            <button className="group inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-3.5 py-1.5 text-xs transition-all duration-200 shadow-lg shadow-indigo-500/20">
              Get Started
            </button>
          </Link>
          <UserButton />
        </div>
      </nav>
    </div>
  );
}
