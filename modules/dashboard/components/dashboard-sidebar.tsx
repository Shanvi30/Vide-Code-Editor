"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Compass,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  type LucideIcon,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
  Database,
  FlameIcon,
} from "lucide-react";
import Image from "next/image";

interface PlaygroundData {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  FlameIcon,
  Terminal,
  Code2,
};

export function DashboardSidebar({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundData[];
}) {
  const pathname = usePathname();
  const [starredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred),
  );
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  const navLink = (href: string, icon: React.ReactNode, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150
        ${
          active
            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col w-64 shrink-0 min-h-screen bg-[#07080f] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
          <Image src="/logo.svg" alt="logo" height={18} width={18} />
        </div>
        <span className="font-bold text-sm text-white tracking-tight">
          Vide<span className="text-indigo-400">Code</span>
        </span>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1 px-3 pt-4">
        {navLink("/", <Home className="w-4 h-4" />, "Home")}
        {navLink(
          "/dashboard",
          <LayoutDashboard className="w-4 h-4" />,
          "Dashboard",
        )}
      </div>

      {/* Starred */}
      <div className="px-3 pt-6">
        <div className="flex items-center justify-between px-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            <Star className="w-3 h-3" /> Starred
          </div>
          <button className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {starredPlaygrounds.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-600">
              No starred projects
            </p>
          ) : (
            starredPlaygrounds.map((p) => {
              const Icon = lucideIconMap[p.icon] || Code2;
              const active = pathname === `/playground/${p.id}`;
              return (
                <Link
                  key={p.id}
                  href={`/playground/${p.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150
                    ${active ? "bg-indigo-500/15 text-indigo-400" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{p.name}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Recent */}
      <div className="px-3 pt-5 flex-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            <History className="w-3 h-3" /> Recent
          </div>
          <button className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
            <FolderPlus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {recentPlaygrounds.map((p) => {
            const Icon = lucideIconMap[p.icon] || Code2;
            const active = pathname === `/playground/${p.id}`;
            return (
              <Link
                key={p.id}
                href={`/playground/${p.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150
                  ${active ? "bg-indigo-500/15 text-indigo-400" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{p.name}</span>
              </Link>
            );
          })}
          <Link
            href="/playgrounds"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
          >
            View all playgrounds →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        {navLink("/settings", <Settings className="w-4 h-4" />, "Settings")}
      </div>
    </div>
  );
}
