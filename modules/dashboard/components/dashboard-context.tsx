"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Project } from "../types";

interface PlaygroundSidebarItem {
  id: string;
  name: string;
  starred: boolean;
  icon: string;
  createdAt: string;
}

interface DashboardContextValue {
  projects: Project[];
  sidebarItems: PlaygroundSidebarItem[];
  removeProject: (id: string) => void;
  updateProjectStar: (id: string, starred: boolean) => void;
  updateProjectDetails: (
    id: string,
    data: { title: string; description: string },
  ) => void;
  addProject: (project: Project) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const technologyIconMap: Record<string, string> = {
  REACT: "Zap",
  NEXTJS: "Lightbulb",
  EXPRESS: "Database",
  VUE: "Compass",
  HONO: "FlameIcon",
  ANGULAR: "Terminal",
};

export function DashboardProvider({
  initialProjects,
  children,
}: {
  initialProjects: Project[];
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const toSidebarItem = (p: Project): PlaygroundSidebarItem => ({
    id: p.id,
    name: p.title,
    starred: p.Starmark?.[0]?.isMarked || false,
    icon: technologyIconMap[p.template] || "Code2",
    createdAt: p.createdAt.toString(),
  });

  const sidebarItems = projects.map(toSidebarItem);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProjectStar = useCallback((id: string, starred: boolean) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, Starmark: [{ isMarked: starred }] } : p,
      ),
    );
  }, []);

  const updateProjectDetails = useCallback(
    (id: string, data: { title: string; description: string }) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      );
    },
    [],
  );

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        projects,
        sidebarItems,
        removeProject,
        updateProjectStar,
        updateProjectDetails,
        addProject,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
