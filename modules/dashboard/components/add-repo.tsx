"use client";

import { Github } from "lucide-react";

const AddRepo = () => {
  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-200 overflow-hidden p-6 opacity-60">
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.08),transparent_60%)]" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <Github className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Open Repository</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Import from GitHub</p>
          </div>
        </div>

        {/* Coming Soon badge */}
        <div className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
          <span className="text-xs font-medium text-violet-400">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="relative flex items-center gap-3 mt-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 group-hover:border-violet-500/15 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-zinc-500">OAuth connected</span>
        </div>
        <span className="text-xs text-zinc-600">Public & private repos</span>
      </div>
    </div>
  );
};

export default AddRepo;
