"use client";

import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
} from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import { useDashboard } from "@/modules/dashboard/components/dashboard-context";
import { LayoutDashboard } from "lucide-react";

export default function DashboardContent() {
  const { projects } = useDashboard();

  return (
    <div className="min-h-screen bg-[#07080f] px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500">Manage your playgrounds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="w-full">
        {projects && projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                All Projects
                <span className="ml-2 text-xs font-normal text-zinc-600 normal-case tracking-normal">
                  {projects?.length} total
                </span>
              </h2>
            </div>
            <ProjectTable
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={duplicateProjectById}
            />
          </>
        )}
      </div>
    </div>
  );
}
