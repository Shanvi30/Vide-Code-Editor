import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { DashboardProvider } from "@/modules/dashboard/components/dashboard-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playgroundData = await getAllPlaygroundForUser();

  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  const formattedPlaygroundData = (playgroundData ?? []).map((item) => ({
    id: item.id,
    name: item.title,
    starred: item.Starmark?.[0]?.isMarked || false,
    icon: technologyIconMap[item.template] || "Code2",
    createdAt: item.createdAt.toString(),
  }));

  return (
    <SidebarProvider>
      <DashboardProvider initialProjects={playgroundData ?? []}>
        <div className="flex h-screen w-full overflow-hidden bg-[#07080f]">
          {/* @ts-ignore */}
          <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
          <main className="flex-1 h-screen overflow-y-auto">{children}</main>
        </div>
      </DashboardProvider>
    </SidebarProvider>
  );
}