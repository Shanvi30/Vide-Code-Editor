"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createPlayground, toggleStarMarked } from "../actions";
import TemplateSelectingModal from "./template-selecting-modal";
import { useDashboard } from "./dashboard-context";

interface PlaygroundData {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
  createdAt: string;
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
  const router = useRouter();

  const { sidebarItems, updateProjectStar } = useDashboard();
  const allPlaygrounds = sidebarItems;

  const starredPlaygrounds = allPlaygrounds.filter((p) => p.starred);
  const recentPlaygrounds = [...allPlaygrounds]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarPopoverOpen, setIsStarPopoverOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const starPopoverRef = useRef<HTMLDivElement>(null);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const allProjectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        starPopoverRef.current &&
        !starPopoverRef.current.contains(e.target as Node)
      ) {
        setIsStarPopoverOpen(false);
      }
      if (
        allProjectsRef.current &&
        !allProjectsRef.current.contains(e.target as Node)
      ) {
        setIsAllProjectsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreatePlayground = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    try {
      const res = await createPlayground(data);
      toast.success("Playground created successfully!");
      setIsModalOpen(false);
      router.push(`/playground/${res?.id}`);
    } catch {
      toast.error("Failed to create playground");
    }
  };

  const handleToggleStar = async (playground: PlaygroundData) => {
    if (togglingId === playground.id) return;
    setTogglingId(playground.id);
    const newStarred = !playground.starred;

    updateProjectStar(playground.id, newStarred);

    try {
      const res = await toggleStarMarked(playground.id, newStarred);
      if (res.success) {
        toast.success(
          newStarred
            ? `⭐ "${playground.name}" added to starred`
            : `"${playground.name}" removed from starred`,
        );
      } else {
        throw new Error("Failed");
      }
    } catch {
      updateProjectStar(playground.id, !newStarred);
      toast.error("Failed to update star");
    } finally {
      setTogglingId(null);
    }
  };

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
    <>
      <TemplateSelectingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlayground}
      />

      <div className="flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#07080f] border-r border-white/5">
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

        {/* Starred Section */}
        <div className="px-3 pt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              <Star className="w-3 h-3" /> Starred
            </div>
            <div className="relative" ref={starPopoverRef}>
              <button
                onClick={() => setIsStarPopoverOpen((v) => !v)}
                title="Manage starred projects"
                className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>

              {isStarPopoverOpen && (
                <div className="fixed left-64 z-[999] w-64 rounded-2xl border border-white/10 bg-[#0e0f1a] shadow-2xl shadow-black/60 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                      All Projects
                    </span>
                    <button
                      onClick={() => setIsStarPopoverOpen(false)}
                      className="text-zinc-600 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col max-h-72 overflow-y-auto py-2">
                    {allPlaygrounds.length === 0 ? (
                      <p className="px-4 py-6 text-xs text-zinc-600 text-center">
                        No projects yet
                      </p>
                    ) : (
                      allPlaygrounds.map((p) => {
                        const Icon = lucideIconMap[p.icon] || Code2;
                        const isToggling = togglingId === p.id;
                        return (
                          <div
                            key={p.id}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.04] transition-colors group"
                          >
                            <Link
                              href={`/playground/${p.id}`}
                              onClick={() => setIsStarPopoverOpen(false)}
                              className="flex items-center gap-2.5 flex-1 min-w-0"
                            >
                              <Icon className="w-3.5 h-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                              <span className="text-sm text-zinc-400 group-hover:text-white truncate transition-colors">
                                {p.name}
                              </span>
                            </Link>
                            <button
                              onClick={() => handleToggleStar(p)}
                              disabled={isToggling}
                              title={
                                p.starred
                                  ? "Remove from starred"
                                  : "Add to starred"
                              }
                              className={`ml-2 shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-150
                                ${
                                  p.starred
                                    ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                                    : "text-zinc-600 hover:text-yellow-400 hover:bg-yellow-400/10 opacity-0 group-hover:opacity-100"
                                }
                                ${isToggling ? "opacity-50 cursor-not-allowed" : ""}
                              `}
                            >
                              <Star
                                className="w-3.5 h-3.5"
                                fill={p.starred ? "currentColor" : "none"}
                              />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-white/5 px-4 py-2.5">
                    <p className="text-[10px] text-zinc-600">
                      {starredPlaygrounds.length} starred ·{" "}
                      {allPlaygrounds.length} total
                    </p>
                  </div>
                </div>
              )}
            </div>
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

        {/* Recent Section */}
        <div className="px-3 pt-5 flex-1 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between px-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              <History className="w-3 h-3" /> Recent
            </div>

            <div className="relative" ref={allProjectsRef}>
              <button
                onClick={() => setIsAllProjectsOpen((v) => !v)}
                title="View all projects"
                className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors"
              >
                <FolderPlus className="w-3 h-3" />
              </button>

              {isAllProjectsOpen && (
                <div className="fixed left-64 z-[999] w-64 rounded-2xl border border-white/10 bg-[#0e0f1a] shadow-2xl shadow-black/60 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                      All Projects
                    </span>
                    <button
                      onClick={() => setIsAllProjectsOpen(false)}
                      className="text-zinc-600 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col max-h-80 overflow-y-auto py-2">
                    {allPlaygrounds.length === 0 ? (
                      <p className="px-4 py-6 text-xs text-zinc-600 text-center">
                        No projects yet
                      </p>
                    ) : (
                      allPlaygrounds.map((p) => {
                        const Icon = lucideIconMap[p.icon] || Code2;
                        const active = pathname === `/playground/${p.id}`;
                        return (
                          <Link
                            key={p.id}
                            href={`/playground/${p.id}`}
                            onClick={() => setIsAllProjectsOpen(false)}
                            className={`flex items-center justify-between px-4 py-2.5 transition-colors group
                              ${active ? "bg-indigo-500/10" : "hover:bg-white/[0.04]"}`}
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <Icon
                                className={`w-3.5 h-3.5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
                              />
                              <span
                                className={`text-sm truncate transition-colors ${active ? "text-indigo-400" : "text-zinc-400 group-hover:text-white"}`}
                              >
                                {p.name}
                              </span>
                              {p.starred && (
                                <Star
                                  className="w-3 h-3 text-yellow-400 shrink-0"
                                  fill="currentColor"
                                />
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                          </Link>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
                    <p className="text-[10px] text-zinc-600">
                      {allPlaygrounds.length} total projects
                    </p>
                    <button
                      onClick={() => {
                        setIsAllProjectsOpen(false);
                        router.push("/dashboard");
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>
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

            {allPlaygrounds.length > 5 && (
              <button
                onClick={() => setIsAllProjectsOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-0.5 w-full text-left"
              >
                +{allPlaygrounds.length - 5} more projects...
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-white/5 pt-4">
          {navLink("/settings", <Settings className="w-4 h-4" />, "Settings")}
        </div>
      </div>
    </>
  );
}
