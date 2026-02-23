"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#ffffff",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/expressjs-icon.svg",
    color: "#ffffff",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    icon: "/vuejs-icon.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description:
      "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: ["Ultra Fast", "TypeScript Support", "Web Standards"],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["TypeScript", "Fullstack", "Enterprise"],
    features: [
      "Dependency Injection",
      "TypeScript Support",
      "Modular Architecture",
    ],
    category: "fullstack",
  },
];

const categories = ["all", "frontend", "backend", "fullstack"] as const;

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack"
  >("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory = category === "all" || t.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProject = () => {
    if (!selectedTemplate) return;
    const templateMap: Record<
      string,
      "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR"
    > = {
      react: "REACT",
      nextjs: "NEXTJS",
      express: "EXPRESS",
      vue: "VUE",
      hono: "HONO",
      angular: "ANGULAR",
    };
    const template = templates.find((t) => t.id === selectedTemplate);
    onSubmit({
      title: projectName || `New ${template?.name} Project`,
      template: templateMap[selectedTemplate] || "REACT",
      description: template?.description,
    });
    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
  };

  const handleClose = () => {
    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
    setSearchQuery("");
    setCategory("all");
  };

  const renderStars = (count: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < count
              ? "fill-yellow-400 text-yellow-400"
              : "text-zinc-700 fill-zinc-700"
          }
        />
      ));

  const selectedTpl = templates.find((t) => t.id === selectedTemplate);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[820px] h-[88vh] p-0 bg-[#09090f] border border-white/8 rounded-2xl shadow-2xl shadow-black/80 gap-0 flex flex-col">
        {" "}
        {step === "select" ? (
          <div className="flex flex-col h-full">
            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Plus size={16} className="text-blue-400" />
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  Select a Template
                </DialogTitle>
              </div>
              <DialogDescription className="text-zinc-500 text-sm ml-11">
                Choose a starting point for your new playground
              </DialogDescription>
            </div>

            {/* ── Search + Filter ── */}
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 border-b border-white/5">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                  size={15}
                />
                <input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:bg-blue-500/[0.04] transition-all"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/8 rounded-xl p-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150
                      ${
                        category === cat
                          ? "bg-blue-400 text-white shadow-lg"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Template Grid ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              {" "}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group
                          ${
                            isSelected
                              ? "bg-blue-500/[0.07] 0_8px_32px_rgba(59,130,246,0.12)]"
                              : "border-white/6 bg-white/[0.02] hover:bg-blue-500/[0.04]"
                          }`}
                      >
                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check
                              size={11}
                              className="text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}

                        {/* Stars top-right (when not selected) */}
                        {!isSelected && (
                          <div className="absolute top-3 right-3 flex gap-0.5">
                            {renderStars(template.popularity)}
                          </div>
                        )}

                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/8"
                          style={{ backgroundColor: `${template.color}12` }}
                        >
                          <Image
                            src={template.icon}
                            alt={template.name}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-white">
                              {template.name}
                            </span>
                            {template.category === "frontend" && (
                              <Code
                                size={12}
                                className="text-blue-400 shrink-0"
                              />
                            )}
                            {template.category === "backend" && (
                              <Server
                                size={12}
                                className="text-emerald-400 shrink-0"
                              />
                            )}
                            {template.category === "fullstack" && (
                              <Globe
                                size={12}
                                className="text-violet-400 shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed mb-2.5 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {template.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors
                                  ${
                                    isSelected
                                      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                                      : "border-white/8 bg-white/[0.04] text-zinc-500 group-hover:border-blue-500/20 group-hover:text-zinc-400"
                                  }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center mb-4">
                    <Search size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">
                    No templates found
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Clock size={13} />
                <span>
                  {selectedTemplate
                    ? "Estimated setup: 2–5 mins"
                    : "Select a template to continue"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/8"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedTemplate}
                  onClick={() => selectedTemplate && setStep("configure")}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150
                    ${
                      selectedTemplate
                        ? "bg-blue-500 text-white"
                        : "bg-white/[0.04] text-zinc-600 cursor-not-allowed border border-white/8"
                    }`}
                >
                  Continue <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Configure Step ── */
          <div className="flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles size={15} className="text-blue-400" />
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  Configure Project
                </DialogTitle>
              </div>
              <DialogDescription className="text-zinc-500 text-sm ml-11">
                {selectedTpl?.name} · Customize your project settings
              </DialogDescription>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 min-h-0">
              {" "}
              {/* Selected template preview */}
              {selectedTpl && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/8"
                    style={{ backgroundColor: `${selectedTpl.color}12` }}
                  >
                    <Image
                      src={selectedTpl.icon}
                      alt={selectedTpl.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedTpl.name}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {selectedTpl.category} template
                    </p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {renderStars(selectedTpl.popularity)}
                  </div>
                </div>
              )}
              {/* Project name */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="project-name"
                  className="text-sm text-zinc-300 font-medium"
                >
                  Project Name
                </Label>
                <input
                  id="project-name"
                  placeholder={`New ${selectedTpl?.name} Project`}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04] transition-all"
                />
              </div>
              {/* Features */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                  Included Features
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTpl?.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Zap size={11} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setStep("select")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/8"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleCreateProject}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white transition-all duration-150"
              >
                <Sparkles size={14} />
                Create Project
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
