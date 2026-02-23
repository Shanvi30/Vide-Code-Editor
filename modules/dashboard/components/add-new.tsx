"use client";

import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import TemplateSelectingModal from "./template-selecting-modal";
import { createPlayground } from "../actions";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    const res = await createPlayground(data);
    toast.success("Playground created successfully");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-200 overflow-hidden p-6"
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.08),transparent_60%)]" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <Plus className="w-5 h-5 text-indigo-400 transition-transform duration-300 group-hover:rotate-90" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">New Playground</h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                Start from a template
              </p>
            </div>
          </div>

          {/* Right decorative element */}
          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Template pills */}
        <div className="relative flex items-center gap-2 mt-5 flex-wrap">
          {["React", "Next.js", "Vue", "Express"].map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-500 border border-white/5 group-hover:border-indigo-500/15 group-hover:text-zinc-400 transition-colors"
            >
              {t}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium text-zinc-600">
            +2 more
          </span>
        </div>
      </div>

      <TemplateSelectingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
