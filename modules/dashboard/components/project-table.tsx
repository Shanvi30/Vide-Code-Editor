"use client";

import { useDashboard } from "./dashboard-context";
import Image from "next/image";
import { format } from "date-fns";
import type { Project } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { MarkedToggleButton } from "./marked-toggle";

interface ProjectTableProps {
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string },
  ) => Promise<void>;
  onDeleteProject?: (id: string) => Promise<void>;
  onDuplicateProject?: (id: string) => Promise<void>;
}

const templateColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  REACT: {
    text: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  NEXTJS: {
    text: "text-zinc-300",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
  EXPRESS: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  VUE: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  HONO: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  ANGULAR: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
};

export default function ProjectTable({
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: ProjectTableProps) {
  const { projects, removeProject, updateProjectDetails, updateProjectStar } =
    useDashboard();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try {
      await onUpdateProject(selectedProject.id, editData);
      updateProjectDetails(selectedProject.id, editData);
      setEditDialogOpen(false);
      toast.success("Project updated successfully");
    } catch {
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try {
      await onDeleteProject(selectedProject.id);
      removeProject(selectedProject.id);
      setDeleteDialogOpen(false);
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated successfully");
    } catch {
      toast.error("Failed to duplicate project");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = (projectId: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/playground/${projectId}`,
    );
    toast.success("URL copied to clipboard");
  };

  return (
    <>
      <div className="w-full rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02]">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_120px_160px_48px] gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
          {["Project", "Template", "Created", "User", ""].map((h, i) => (
            <div
              key={i}
              className="text-xs font-semibold text-zinc-500 uppercase tracking-widest"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {projects.map((project) => {
            const tc = templateColors[project.template] || templateColors.REACT;
            return (
              <div
                key={project.id}
                className="grid grid-cols-[1fr_100px_120px_160px_48px] gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Project name */}
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/playground/${project.id}`}
                    className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors truncate"
                  >
                    {project.title}
                  </Link>
                  <span className="text-xs text-zinc-500 truncate mt-0.5">
                    {project.description}
                  </span>
                </div>

                {/* Template badge */}
                <div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${tc.text} ${tc.bg} ${tc.border}`}
                  >
                    {project.template}
                  </span>
                </div>

                {/* Date */}
                <div className="text-xs text-zinc-500">
                  {format(new Date(project.createdAt), "MMM dd, yyyy")}
                </div>

                {/* User */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                    <Image
                      src={project.user.image || "/placeholder.svg"}
                      alt={project.user.name}
                      width={28}
                      height={28}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 truncate">
                    {project.user.name}
                  </span>
                </div>

                {/* Actions */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-600 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-[#0d0e1a] border-white/10"
                    >
                      <DropdownMenuItem asChild>
                        <MarkedToggleButton
                          markedForRevision={project.Starmark[0]?.isMarked}
                          id={project.id}
                          onStarChange={updateProjectStar}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          className="flex items-center gap-2 text-zinc-300"
                        >
                          <Eye className="h-4 w-4" /> Open Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          target="_blank"
                          className="flex items-center gap-2 text-zinc-300"
                        >
                          <ExternalLink className="h-4 w-4" /> Open in New Tab
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project)}
                        className="gap-2 text-zinc-300"
                      >
                        <Edit3 className="h-4 w-4" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateProject(project)}
                        className="gap-2 text-zinc-300"
                      >
                        <Copy className="h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyProjectUrl(project.id)}
                        className="gap-2 text-zinc-300"
                      >
                        <Copy className="h-4 w-4" /> Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="gap-2 text-rose-400 focus:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" /> Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0d0e1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update your project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-zinc-300">Project Title</Label>
              <Input
                value={editData.title}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, title: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                placeholder="Enter project title"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
              className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              disabled={isLoading || !editData.title.trim()}
              className="bg-indigo-500 hover:bg-indigo-400 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#0d0e1a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete &quot;{selectedProject?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              className="border-white/10 text-zinc-300 hover:text-white bg-transparent hover:bg-white/5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-rose-500 hover:bg-rose-400 text-white border-0"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
