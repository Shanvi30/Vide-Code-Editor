import Link from "next/link";
import { Github, Twitter, Linkedin, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#07080f]">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <Code2 className="w-3 h-3 text-indigo-400" />
          </div>
          <span className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-zinc-400 font-medium">VibeCode Editor</span>.
            All rights reserved.
          </span>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {[
            {
              href: "#",
              icon: <Github className="w-3.5 h-3.5" />,
              label: "GitHub",
            },
            {
              href: "#",
              icon: <Twitter className="w-3.5 h-3.5" />,
              label: "Twitter",
            },
            {
              href: "#",
              icon: <Linkedin className="w-3.5 h-3.5" />,
              label: "LinkedIn",
            },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="w-7 h-7 rounded-lg border border-white/8 bg-white/[0.03] flex items-center justify-center text-zinc-500 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-150"
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
